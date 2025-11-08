import axios from 'axios';

// Use relative URL - Vite proxy will forward to backend
const API_URL = '/api/v1';

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
    const response = await api.post('/students/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('userType', 'student');
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
    const response = await api.post('/alumni/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('userType', 'alumni');
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
