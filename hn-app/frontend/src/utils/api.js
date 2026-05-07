import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hn_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hn_token');
      localStorage.removeItem('hn_user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const storiesAPI = {
  getAll: (page = 1, limit = 10) => API.get(`/stories?page=${page}&limit=${limit}`),
  getById: (id) => API.get(`/stories/${id}`),
  toggleBookmark: (id) => API.post(`/stories/${id}/bookmark`),
};

export const scraperAPI = {
  trigger: () => API.post('/scrape'),
};

export default API;
