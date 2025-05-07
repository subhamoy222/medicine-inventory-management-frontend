// utils/axios.js
import axios from 'axios';

// Create a customized axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://medicine-inventory-management-backend.onrender.com',
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from multiple possible storage keys for compatibility
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log request being made (helpful for debugging)
    console.log(`Making request to: ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Optional: Log successful responses
    // console.log('Response:', response.data);
    return response;
  },
  async (error) => {
    // Enhanced error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      console.error('Error config:', error.config);
      
      // Specific handling for timeout errors
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out. Please check your internet connection or the server might be down.');
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      // Redirect to login for unauthorized requests
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('email');
        
        // Use a more reliable way to navigate
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;