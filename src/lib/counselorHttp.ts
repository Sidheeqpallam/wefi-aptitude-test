import axios, { type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const http = axios.create({
  baseURL: `${API_BASE_URL}/career-aptitude`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('counselorToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('counselorToken');
      localStorage.removeItem('counselorInfo');
      window.location.href = '/counselor';
    }
    return Promise.reject(error);
  },
);

export default http;