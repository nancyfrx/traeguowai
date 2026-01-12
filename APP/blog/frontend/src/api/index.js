import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Request interceptor for API calls
api.interceptors.request.use(
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

export const articleApi = {
  getAll: (page = 0, size = 10) => api.get(`/articles?page=${page}&size=${size}`),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

export const commentApi = {
  getByArticle: (articleId) => api.get(`/comments/article/${articleId}`),
  create: (data) => api.post('/comments', data),
};

export default api;
