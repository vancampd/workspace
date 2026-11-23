import { apiClient } from './client';

export const getListings = async () => {
  const response = await apiClient.get('listings');

  return response.data;
};

// The listing fields are sent as a JSON string next to the image so the
// server can run its image middleware before creating the listing.
export const createListing = async ({ image, ...listing }) => {
  const data = new FormData();
  data.append('listing', JSON.stringify(listing));
  data.append('file', image);

  const response = await apiClient.post('listings', data);

  return response.data;
};
