# ConnectUp - Alumni-Student Networking Platform

ConnectUp is a full-stack web application that bridges the gap between students and alumni, facilitating mentorship, networking, and knowledge sharing.

## 🚀 Features

- **User Authentication**: Secure registration and login for students and alumni
- **Profile Management**: Comprehensive profiles with skills, interests, and experience
- **Smart Matching**: Algorithm-based matching between students and alumni
- **Real-time Messaging**: Direct communication between matched users
- **Events Management**: Create and participate in networking events
- **Forum Discussions**: Community-driven discussions and Q&A
- **Mentor Discovery**: Find mentors based on skills and interests

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

## 📁 Project Structure

```
├── backend/          # Express backend API
│   ├── controllers/  # Route controllers
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── utils/        # Utility functions
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── public/
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student profile

### Alumni
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/:id` - Get alumni by ID
- `PUT /api/alumni/:id` - Update alumni profile

### Matches
- `GET /api/matches` - Get user matches
- `POST /api/matches` - Create new match

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message

## 🔒 Environment Variables

Make sure to set up the following environment variables:

**Backend (.env)**
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRES_IN` - JWT expiration time

**Frontend (.env)**
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- Neeraf Garhewal

## 📧 Contact

For any queries, reach out at neerafgarhewal5@gmail.com
