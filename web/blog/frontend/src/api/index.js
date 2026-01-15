import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const BASE_URL = '';

export const getFileUrl = (path) => {
  if (!path) return '';
  // 如果已经是完整的 http 链接（如阿里云 OSS 链接），直接返回
  if (path.startsWith('http')) return path;
  
  // 处理本地代理链接，确保有 /api 前缀
  if (path.startsWith('/api')) return path;
  return path.startsWith('/') ? `/api${path}` : `/api/${path}`;
};

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
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc', publishedOnly = true, featuredOnly = false } = params;
    return api.get(`/articles?page=${page}&size=${size}&sort=${sort}&publishedOnly=${publishedOnly}&featuredOnly=${featuredOnly}`);
  },
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
  like: (id) => api.post(`/articles/${id}/like`),
  unlike: (id) => api.post(`/articles/${id}/unlike`),
  view: (id) => api.post(`/articles/${id}/view`),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

export const commentApi = {
  getByArticle: (articleId) => api.get(`/comments/article/${articleId}`),
  create: (data) => api.post('/comments', data),
};

export const subscriptionApi = {
  subscribe: (email) => api.post('/subscriptions', { email }),
};

export const uploadApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
