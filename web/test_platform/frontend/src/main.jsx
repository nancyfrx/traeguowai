import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Global axios config
// Use relative path to let Vite proxy handle development requests
axios.defaults.baseURL = import.meta.env.MODE === 'production' ? '/test-api' : '';
axios.defaults.withCredentials = true;

// Add a response interceptor to handle unauthorized errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error interceptor:', error.response?.status, error.config?.url);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear login status and redirect to login page
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      
      const loginPath = import.meta.env.MODE === 'production' ? '/testplatform/login' : '/login';
      
      // Use replace to prevent back button from returning to the unauthorized page
      if (window.location.pathname !== loginPath) {
        window.location.replace(loginPath);
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
