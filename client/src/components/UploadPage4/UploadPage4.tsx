import { useFormContext } from 'react-hook-form';
import errorIcon from '../../assets/images/error-12px.svg';
import type { UploadFormValues } from '../../pages/UploadPage/uploadFormValues';

function UploadPage4() {
    const {
        register,
        formState: { errors },
    } = useFormContext<UploadFormValues>();

    return (
        <>
            <h2 className='form__sub-header'>Photo</h2>
            <div className='form__upload-image-container'>
                <label className='form__label' htmlFor='image'>*Image:</label>
                <input
                    className='form__input'
                    id='image'
                    type='file'
                    accept='image/*'
                    {...register('image', {
                        required: 'You must upload an image',
                    })}
                />
                {
                    errors.image ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.image.message}</p>
                    : ''
                }
            </div>
        </>
    )
}

export default UploadPage4
