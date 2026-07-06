import { useMutation } from '@tanstack/react-query';
import { uploadListingImage } from '../../api/listings';

export const useUploadListingImageMutation = () => {
  return useMutation({
    mutationFn: uploadListingImage,
  });
};
