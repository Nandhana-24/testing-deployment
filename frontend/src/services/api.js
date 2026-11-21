import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const saved = sessionStorage.getItem('watchhub-auth');
  if (saved) {
    const { email, password } = JSON.parse(saved);
    const bytes = new TextEncoder().encode(`${email}:${password}`);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    config.headers.Authorization = `Basic ${window.btoa(binary)}`;
  }
  return config;
});

export function getErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong.';
}

export default api;
