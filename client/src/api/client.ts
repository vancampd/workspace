import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || 'http://localhost:8080/',
});

// Send the stored token so the server can verify who is making the request.
// Temporary: cookie-based sessions will replace localStorage tokens (see docs/auth.md).
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
