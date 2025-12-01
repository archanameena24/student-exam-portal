// src/services/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080'
});

// Add request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

// Auth token setter
export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};

// API endpoints
export const authAPI = {
    login: (credentials) => API.post('/api/auth/login', credentials),
    register: (userData) => API.post('/api/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setAuthToken(null);
    }
};

export default API;
