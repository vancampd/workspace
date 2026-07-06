import { apiClient } from './client';

export const getListings = async () => {
  const response = await apiClient.get('listings');

  return response.data;
};

export const createListing = async (listing) => {
  const response = await apiClient.post('listings', listing);

  return response.data;
};

export const uploadListingImage = async ({ listingId, data }) => {
  const response = await apiClient.post(`listings/${listingId}/images`, data);

  return response.data;
};
