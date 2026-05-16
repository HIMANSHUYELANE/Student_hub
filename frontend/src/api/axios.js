import axios from 'axios';
import { STORAGE_KEY } from '../constants/storage';

const api = axios.create({
  baseURL: 'https://student-hub-lgxf.onrender.com/api'  
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { token } = JSON.parse(stored);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore parse errors
      }
    }
  }
  return config;
});

export default api;

