import { apiClient } from './client';

export const createComment = async ({ listingId, comment }) => {
  const response = await apiClient.post(
    `listings/${listingId}/comments`,
    comment
  );

  return response.data;
};

export const deleteComment = async ({ listingId, commentId }) => {
  const response = await apiClient.delete(
    `listings/${listingId}/comments/${commentId}`
  );

  return response.data;
};
