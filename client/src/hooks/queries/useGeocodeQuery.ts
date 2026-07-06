import { useQuery } from '@tanstack/react-query';
import { getGeocode } from '../../api/geocoding';
import { queryKeys } from '../queryKeys';

export const useGeocodeQuery = (address?: string) => {
  return useQuery({
    queryKey: queryKeys.geocode(address || ''),
    queryFn: () => getGeocode(address || ''),
    enabled: Boolean(address),
  });
};
