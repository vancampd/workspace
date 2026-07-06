import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../api/auth';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
