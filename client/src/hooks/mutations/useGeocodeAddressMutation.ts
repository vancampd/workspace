import { useMutation } from '@tanstack/react-query';
import { getGeocode } from '../../api/geocoding';

export const useGeocodeAddressMutation = () => {
  return useMutation({
    mutationFn: getGeocode,
  });
};
