import { useQuery } from '@tanstack/react-query';
import { getListings } from '../../api/listings';
import { queryKeys } from '../queryKeys';

export const useCityListingsQuery = (city?: string) => {
  return useQuery({
    queryKey: queryKeys.cityListings(city || ''),
    queryFn: getListings,
    enabled: Boolean(city),
    select: (listings) =>
      listings.filter(
        (listing) => listing.city.toLowerCase() === city?.toLowerCase()
      ),
  });
};
