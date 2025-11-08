require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const { StatusCodes } = require('http-status-codes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const messageRoutes = require('./routes/messages');
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ====================
// GLOBAL MIDDLEWARES
// ====================

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: process.env.RATE_LIMIT_MAX || 100,
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ====================
// ROUTES
// ====================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/alumni', alumniRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    database: {
      status: dbStatusMap[dbStatus],
      readyState: dbStatus
    },
    timestamp: new Date()
  });
});

// ====================
// SOCKET.IO CONNECTION
// ====================
const users = {};

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('addUser', (userId) => {
    users[userId] = socket.id;
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('getMessage', {
        senderId,
        text,
        timestamp: new Date()
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    const userId = Object.keys(users).find(key => users[key] === socket.id);
    if (userId) {
      delete users[userId];
      io.emit('getUsers', users);
    }
  });
});

// ====================
// ERROR HANDLING
// ====================
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

app.use(globalErrorHandler);

// ====================
// DATABASE & SERVER
// ====================
const PORT = process.env.PORT || 5000;

// Database connection
console.log('🔄 Attempting to connect to MongoDB...');
console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'URI found in .env' : 'Using default URI');

// Configure mongoose settings
mongoose.set('strictQuery', false);
mongoose.set('bufferTimeoutMS', 30000); // Increase buffer timeout to 30 seconds

const connectDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Connection attempt ${i + 1}/${retries}...`);
      
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/connectup', {
        serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
      
      console.log('✅ Connected to MongoDB successfully!');
      return true;
    } catch (err) {
      console.error(`❌ Connection attempt ${i + 1} failed:`, err.message);
      
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  return false;
};

// Start server
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}...`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
};

// Connect to database and start server
connectDB()
  .then((connected) => {
    if (connected) {
      console.log('✅ Database connected - All systems operational');
      startServer();
    } else {
      console.error('❌ Failed to connect to MongoDB after multiple attempts');
      console.error('⚠️  Starting server anyway...');
      console.error('⚠️  API endpoints requiring database will fail');
      console.error('');
      console.error('💡 Troubleshooting tips:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB Atlas IP whitelist includes your IP');
      console.error('   3. Confirm credentials in .env file are correct');
      console.error('   4. Check if MongoDB Atlas cluster is active');
      startServer();
    }
  })
  .catch((err) => {
    console.error('❌ Unexpected error during startup:', err);
    startServer();
  });

// ====================
// ERROR HANDLERS
// ====================
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Server startup is now handled after MongoDB connection
