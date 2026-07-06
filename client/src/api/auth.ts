import { apiClient } from './client';

export const loginUser = async (credentials) => {
  const response = await apiClient.post('users/login', credentials);

  return response.data;
};

export const registerUser = async (user) => {
  const response = await apiClient.post('users/register', user);

  return response.data;
};
