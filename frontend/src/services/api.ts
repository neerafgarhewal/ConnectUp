import axios from 'axios';

// Use environment variable for API URL, fallback to relative URL for development
const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 and we're not on the login page, redirect to login
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        console.warn('Token expired or invalid, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },
  getRecommended: async (limit = 6) => {
    const response = await api.get(`/dashboard/recommended?limit=${limit}`);
    return response.data;
  },
};

// Messaging API
export const messagingAPI = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/messaging/conversations');
    return response.data;
  },
  
  // Get or create conversation
  getOrCreateConversation: async (participantId: string) => {
    const response = await api.post('/messaging/conversations', { participantId });
    return response.data;
  },
  
  // Get messages for a conversation
  getMessages: async (conversationId: string, page = 1, limit = 50) => {
    const response = await api.get(`/messaging/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Send message
  sendMessage: async (conversationId: string, data: { content: string; messageType?: string; attachmentUrl?: string; replyTo?: string }) => {
    const response = await api.post(`/messaging/conversations/${conversationId}/messages`, data);
    return response.data;
  },
  
  // Mark messages as read
  markAsRead: async (conversationId: string, messageIds: string[]) => {
    const response = await api.put(`/messaging/conversations/${conversationId}/mark-read`, { messageIds });
    return response.data;
  },
  
  // Edit message
  editMessage: async (messageId: string, content: string) => {
    const response = await api.put(`/messaging/messages/${messageId}`, { content });
    return response.data;
  },
  
  // Delete message
  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/messaging/messages/${messageId}`);
    return response.data;
  },
  
  // Search messages
  searchMessages: async (conversationId: string, query: string) => {
    const response = await api.get(`/messaging/conversations/${conversationId}/search?q=${query}`);
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  // Get all posts (community feed)
  getPosts: async (page = 1, limit = 10, filter = 'all') => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}&filter=${filter}`);
    return response.data;
  },
  
  // Create new post
  createPost: async (data: { content: string; imageUrl?: string; tags?: string[]; visibility?: string }) => {
    const response = await api.post('/posts', data);
    return response.data;
  },
  
  // Like/unlike post
  toggleLike: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },
  
  // Add comment
  addComment: async (postId: string, content: string) => {
    const response = await api.post(`/posts/${postId}/comment`, { content });
    return response.data;
  },
  
  // Share post
  sharePost: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/share`);
    return response.data;
  },
  
  // Edit post
  editPost: async (postId: string, data: { content: string; imageUrl?: string }) => {
    const response = await api.patch(`/posts/${postId}`, data);
    return response.data;
  },
  
  // Delete post
  deletePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },
};

// Forum API
export const forumAPI = {
  // Get all posts
  getPosts: async (page = 1, limit = 10, category?: string, tag?: string, sort?: string) => {
    let url = `/forum/posts?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (tag) url += `&tag=${tag}`;
    if (sort) url += `&sort=${sort}`;
    const response = await api.get(url);
    return response.data;
  },
  
  // Create post
  createPost: async (data: { title: string; content: string; category: string; tags?: string[] }) => {
    const response = await api.post('/forum/posts', data);
    return response.data;
  },
  
  // Vote on post
  votePost: async (postId: string, voteType: 'up' | 'down') => {
    const response = await api.post(`/forum/posts/${postId}/vote`, { voteType });
    return response.data;
  },
  
  // Save/unsave post
  toggleSave: async (postId: string) => {
    const response = await api.post(`/forum/posts/${postId}/save`);
    return response.data;
  },
  
  // Share post
  sharePost: async (postId: string) => {
    const response = await api.post(`/forum/posts/${postId}/share`);
    return response.data;
  },
  
  // Add reply
  addReply: async (postId: string, content: string) => {
    const response = await api.post(`/forum/posts/${postId}/reply`, { content });
    return response.data;
  },
  
  // Get stats
  getStats: async () => {
    const response = await api.get('/forum/stats');
    return response.data;
  },
  
  // Get popular tags
  getPopularTags: async () => {
    const response = await api.get('/forum/tags');
    return response.data;
  },
  
  // Get trending posts
  getTrendingPosts: async () => {
    const response = await api.get('/forum/trending');
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  // Get all events
  getEvents: async (category?: string, location?: string, format?: string, search?: string, sort?: string) => {
    let url = '/events?';
    if (category) url += `category=${category}&`;
    if (location) url += `location=${location}&`;
    if (format) url += `format=${format}&`;
    if (search) url += `search=${search}&`;
    if (sort) url += `sort=${sort}&`;
    const response = await api.get(url);
    return response.data;
  },
  
  // Create event
  createEvent: async (data: {
    title: string;
    description: string;
    category: string;
    date: string;
    startTime: string;
    endTime?: string;
    location: string;
    format: string;
    coverImage?: string;
    tags?: string[];
    maxAttendees?: number;
    meetingLink?: string;
  }) => {
    const response = await api.post('/events', data);
    return response.data;
  },
  
  // Get event by ID
  getEvent: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },
  
  // Register for event
  registerForEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },
  
  // Get locations
  getLocations: async () => {
    const response = await api.get('/events/locations');
    return response.data;
  },
  
  // Get categories
  getCategories: async () => {
    const response = await api.get('/events/categories');
    return response.data;
  },
  
  // Update event
  updateEvent: async (eventId: string, data: any) => {
    const response = await api.patch(`/events/${eventId}`, data);
    return response.data;
  },
  
  // Delete event
  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },
};

// Student API
export const studentAPI = {
  register: async (data: any) => {
    console.log('API: Calling POST /students/register');
    console.log('API: Base URL:', API_URL);
    console.log('API: Data:', data);
    try {
      const response = await api.post('/students/register', data);
      console.log('API: Response received:', response);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('userType', 'student');
      }
      return response.data;
    } catch (error: any) {
      console.error('API: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    console.log('Student login API call');
    const response = await api.post('/students/login', { email, password });
    console.log('Login response:', response.data);
    
    if (response.data.token && response.data.data?.user) {
      const token = response.data.token;
      const user = response.data.data.user;
      
      console.log('Saving auth data:', {
        token: token.substring(0, 20) + '...',
        userId: user._id,
        userEmail: user.email
      });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', 'student');
      
      // Verify it was saved
      const saved = localStorage.getItem('token');
      console.log('Token saved?', !!saved);
    } else {
      console.error('Invalid response structure:', response.data);
    }
    return response.data;
  },

  getProfile: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  getAllStudents: async (params?: any) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  updateProfile: async (id: string, data: any) => {
    const response = await api.patch(`/students/${id}`, data);
    return response.data;
  },
};

// Alumni API
export const alumniAPI = {
  register: async (data: any) => {
    const response = await api.post('/alumni/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('userType', 'alumni');
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    console.log('Alumni login API call');
    const response = await api.post('/alumni/login', { email, password });
    console.log('Login response:', response.data);
    
    if (response.data.token && response.data.data?.user) {
      const token = response.data.token;
      const user = response.data.data.user;
      
      console.log('Saving auth data:', {
        token: token.substring(0, 20) + '...',
        userId: user._id,
        userEmail: user.email
      });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', 'alumni');
      
      // Verify it was saved
      const saved = localStorage.getItem('token');
      console.log('Token saved?', !!saved);
    } else {
      console.error('Invalid response structure:', response.data);
    }
    return response.data;
  },

  getProfile: async (id: string) => {
    const response = await api.get(`/alumni/${id}`);
    return response.data;
  },

  getAllAlumni: async (params?: any) => {
    const response = await api.get('/alumni', { params });
    return response.data;
  },

  updateProfile: async (id: string, data: any) => {
    const response = await api.patch(`/alumni/${id}`, data);
    return response.data;
  },

  acceptMentorshipRequest: async (id: string, studentId: string) => {
    const response = await api.post(`/alumni/${id}/accept-request`, { studentId });
    return response.data;
  },
};

// Auth API
export const authAPI = {
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserType: () => {
    return localStorage.getItem('userType');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default api;
