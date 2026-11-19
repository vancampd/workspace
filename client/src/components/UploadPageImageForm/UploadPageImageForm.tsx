import {useNavigate} from 'react-router-dom';
import { useUploadListingImageMutation } from '../../hooks/mutations/useUploadListingImageMutation';
import { useForm } from 'react-hook-form';

type UploadImageFormValues = {
    image: FileList;
};

function UploadPageImageForm({newListingId, city, errorIcon}) {

    const navigate = useNavigate();
    const uploadListingImageMutation = useUploadListingImageMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UploadImageFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    });

    const handleUploadImage = ({ image }: UploadImageFormValues) => {
        const data = new FormData();
        data.append('file', image[0]);

        uploadListingImageMutation.mutate(
            { listingId: newListingId, data },
            {
                onSuccess: () => {
                    navigate(`/listings/${city}`)
                }
            }
        );
    }

    return (
        <form className='form' onSubmit={handleSubmit(handleUploadImage)}>
            <div className='form__upload-image-container'>
                <label className='form__label' htmlFor='images'>*Images:</label>
                <input
                    className='form__input'
                    id='images'
                    type='file'
                    {...register('image', {
                        required: 'You must upload an image',
                    })}
                />
                {
                    errors.image ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.image.message}</p>
                    : ''
                }
                {
                    uploadListingImageMutation.isError ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> Image upload failed. Please try again.</p>
                    : ''
                }
            </div>
            <button className='button' type='submit' disabled={uploadListingImageMutation.isPending}>Submit</button>
        </form>
    )
}

export default UploadPageImageForm
