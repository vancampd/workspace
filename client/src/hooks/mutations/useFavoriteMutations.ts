import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFavorite, removeFavorite } from '../../api/favorites';
import { queryKeys } from '../queryKeys';

export const useAddFavoriteMutation = (name: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (favorites) => {
      queryClient.setQueryData(queryKeys.favorites(name), favorites);
    },
  });
};

export const useRemoveFavoriteMutation = (name: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: (favorites) => {
      queryClient.setQueryData(queryKeys.favorites(name), favorites);
    },
  });
};
