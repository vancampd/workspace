import { useQuery } from '@tanstack/react-query';
import { getListings } from '../../api/listings';
import { queryKeys } from '../queryKeys';

export const useListingQuery = (listingId?: string) => {
  return useQuery({
    queryKey: queryKeys.listing(listingId || ''),
    queryFn: getListings,
    enabled: Boolean(listingId),
    select: (listings) => listings.find((listing) => listing.id === listingId),
  });
};
