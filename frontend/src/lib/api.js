// frontend/src/lib/api.js
import axios from 'axios';

const BASE =
  import.meta.env?.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

const api = axios.create({
  baseURL: BASE,
  withCredentials: false, // using Bearer token; no cookies
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
