import axios from 'axios';

const API_URL = 'http://localhost:8888';

const api = axios.create({
  baseURL: API_URL,
});

// リクエストインターセプター: トークンをヘッダーに自動付与
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// レスポンスインターセプター: 401エラー時にログイン画面へ（任意）
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    // window.location.href = '/login'; // 必要に応じて
  }
  return Promise.reject(error);
});

export default api;
