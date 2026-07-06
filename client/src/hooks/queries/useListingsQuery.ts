import { useQuery } from '@tanstack/react-query';
import { getListings } from '../../api/listings';
import { queryKeys } from '../queryKeys';

export const useListingsQuery = () => {
  return useQuery({
    queryKey: queryKeys.listings,
    queryFn: getListings,
  });
};
