import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '../../api/favorites';
import { queryKeys } from '../queryKeys';

export const useFavoritesQuery = (name?: string) => {
  return useQuery({
    queryKey: queryKeys.favorites(name || ''),
    queryFn: () => getFavorites(name || ''),
    enabled: Boolean(name),
  });
};
