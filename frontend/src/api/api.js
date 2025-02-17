import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://ai-job-helper-mern.onrender.com/api', // Adjust base URL
  timeout: 10000, // Request timeout (10 seconds)
});

// Optional: Add request/response interceptors for logging, token handling, etc.
api.interceptors.request.use(
  (config) => {
    // You can add Authorization header if required
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchCodeData = async () => {
  try {
    const response = await api.get('/code');
    return response.data;
  } catch (error) {
    console.error('Error fetching code data:', error);
    throw error;
  }
};
