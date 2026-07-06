import { apiClient } from './client';

export const getGeocode = async (address: string) => {
  const response = await apiClient.get('geocode', {
    params: {
      address,
    },
  });

  return response.data;
};
