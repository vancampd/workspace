import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createListing } from '../../api/listings';
import { queryKeys } from '../queryKeys';

export const useCreateListingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings });
    },
  });
};
