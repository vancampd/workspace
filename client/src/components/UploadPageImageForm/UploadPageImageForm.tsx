import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useUploadListingImageMutation } from '../../hooks/mutations/useUploadListingImageMutation';

function UploadPageImageForm({newListingId, city, errorIcon}) {

    const navigate = useNavigate();

    const [showMissingImageError, setShowMissingImageError] = useState(false);
    const [image, setImage] = useState('');
    const uploadListingImageMutation = useUploadListingImageMutation();

    const handleSetImage = (e) => {

        const image = e.target.files[0];

        if(image){
            return setImage(image)
        } else {
            setImage('')
        }

    }

    const handleUploadImage = (e) => {
        e.preventDefault();

        if(!e.target[0].files[0]){
            return setShowMissingImageError(true)
        }

        const data = new FormData();
        data.append('file', e.target[0].files[0]);

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
        <form className='form' onSubmit={handleUploadImage}>
            <div className='form__upload-image-container'>
                <label className='form__label' htmlFor='images'>*Images:</label>
                <input
                    className='form__input' 
                    name='images' 
                    id='images' 
                    type='file'
                    onChange={handleSetImage}
                />
                {
                    showMissingImageError && !image ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> You must upload an image</p> 
                    : ''
                }
                {
                    uploadListingImageMutation.isError ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> Image upload failed. Please try again.</p>
                    : ''
                }
            </div>
            <button className='button'>Submit</button> 
        </form>
    )
}

export default UploadPageImageForm
