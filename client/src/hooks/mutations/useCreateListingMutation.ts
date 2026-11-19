import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getGeocode } from '../../api/geocoding';
import { createListing } from '../../api/listings';
import { queryKeys } from '../queryKeys';

export const useCreateListingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: any) => {
      const location = await getGeocode(
        `${listing.streetAddress},${listing.city},${listing.state}`
      );

      return createListing({
        ...listing,
        coordinates: { lat: String(location.lat), lng: String(location.lng) },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings });
    },
  });
};
