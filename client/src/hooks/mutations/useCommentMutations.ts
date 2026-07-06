import { useMutation } from '@tanstack/react-query';
import {
  createComment,
  deleteComment,
} from '../../api/comments';

export const useCreateCommentMutation = () => {
  return useMutation({
    mutationFn: createComment,
  });
};

export const useDeleteCommentMutation = () => {
  return useMutation({
    mutationFn: deleteComment,
  });
};
