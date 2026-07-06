import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../../api/auth';

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
