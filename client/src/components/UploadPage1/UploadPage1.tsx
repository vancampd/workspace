import { useFormContext } from 'react-hook-form';
import errorIcon from '../../assets/images/error-12px.svg';
import type { UploadFormValues } from '../../pages/UploadPage/uploadFormValues';

const RENT_PERIODS = ['Daily', 'Weekly', 'Monthly'];

function UploadPage1() {
    const {
        register,
        formState: { errors },
    } = useFormContext<UploadFormValues>();

    const rentPeriodRules = {
        validate: (value: string[]) =>
            value.length > 0 || 'You must leave a time period',
    };

    return (
        <>
            <h2 className='form__header'>Post your workspace</h2>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='title'>*Give a title to your post:</label>
                <input
                    className='form__input'
                    id='title'
                    placeholder="Title"
                    {...register('title', {
                        required: 'You must enter the title of your post',
                    })}
                />
                {
                    errors.title ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.title.message}</p>
                    : ''
                }
            </div>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='description'>*Describe your space:</label>
                <textarea
                    className='form__input'
                    id='description'
                    placeholder="Description"
                    {...register('description', {
                        required: 'You must write the description of your space',
                    })}
                >
                </textarea>
                {
                    errors.description ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.description.message}</p>
                    : ''
                }
            </div>
            <div className='form__element-container'>
                <div className='form__inner-container'>
                    <div className='form__inner-left'>
                        <label className='form__label'>**Length of availability:</label>
                        <div className='form__check-box-container'>
                            {RENT_PERIODS.map((period) => (
                                <label className='form__label' key={period}>
                                    <input
                                        className='form__input'
                                        id={period.toLowerCase()}
                                        value={period}
                                        type='checkbox'
                                        {...register('rentPeriod', rentPeriodRules)}
                                    />
                                    {period}
                                </label>
                            ))}
                            {
                                errors.rentPeriod ?
                                <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.rentPeriod.message}</p>
                                : ''
                            }
                        </div>
                    </div>
                    <div className='form__inner-right'>
                        <label className='form__label'>Amenities:</label>
                        <div className='form__check-box-container'>
                            <label className='form__label'>
                                <input
                                    className='form__input'
                                    id='Conference Room'
                                    value='Conference Room'
                                    type='checkbox'
                                    {...register('amenities')}
                                />
                                Conference Room
                            </label>
                            <label className='form__label'>
                                <input
                                    className='form__input'
                                    id='Refrigerator'
                                    value='Refrigerator'
                                    type='checkbox'
                                    {...register('amenities')}
                                />
                                Refrigerator
                            </label>
                            <label className='form__label'>
                                <input
                                    className='form__input'
                                    id='Bathroom'
                                    value='Bathroom'
                                    type='checkbox'
                                    {...register('amenities')}
                                />
                                Bathroom
                            </label>
                            <label className='form__label'>
                                <input
                                    className='form__input'
                                    id='Coffee'
                                    value='Coffee'
                                    type='checkbox'
                                    {...register('amenities')}
                                />
                                Coffee
                            </label>
                            <label className='form__label'>
                                <input
                                    className='form__input'
                                    id='Outside work area'
                                    value='Outside work area'
                                    type='checkbox'
                                    {...register('amenities')}
                                />
                                Outside work area
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='price'>*Daily price:</label>
                <input
                    className='form__input'
                    id='price'
                    placeholder="Enter the price to rent each day"
                    type='number'
                    {...register('price', {
                        required: 'You must list your daily price',
                    })}
                />
                {
                    errors.price ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.price.message}</p>
                    : ''
                }
            </div>
        </>
    )
}

export default UploadPage1
