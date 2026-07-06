import { apiClient } from './client';

export const getFavorites = async (name: string) => {
  const response = await apiClient.get(`favorites/${name}`);

  return response.data;
};

export const addFavorite = async ({ name, favoriteListing }) => {
  const response = await apiClient.post(`favorites/${name}`, favoriteListing);

  return response.data;
};

export const removeFavorite = async ({ name, listingId }) => {
  const response = await apiClient.delete(`favorites/${name}/${listingId}`);

  return response.data;
};
