import { useFormContext } from 'react-hook-form';
import listOfStates from '../../assets/data/listOfStates.json';
import errorIcon from '../../assets/images/error-12px.svg';
import type { UploadFormValues } from '../../pages/UploadPage/uploadFormValues';

function UploadPage2() {
    const {
        register,
        formState: { errors },
    } = useFormContext<UploadFormValues>();

    return (
        <>
        <h2 className='form__sub-header'>Location</h2>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='streetAddress'>*Street Address:</label>
                <input
                    className='form__input'
                    id='streetAddress'
                    placeholder="Street Address"
                    {...register('streetAddress', {
                        required: 'You must enter the street address',
                    })}
                />
                {
                    errors.streetAddress ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.streetAddress.message}</p>
                    : ''
                }
            </div>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='city'>*City:</label>
            <input
                className='form__input'
                id='city'
                placeholder="City"
                {...register('city', {
                    required: 'You must enter the city',
                })}
            />
             {
                errors.city ?
                <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.city.message}</p>
                : ''
            }
        </div>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='state'>*State:</label>
            <select
                id='state'
                className='form__select'
                {...register('state', {
                    required: 'You must select a state',
                })}
            >
                <option value=''>Please select</option>
                {listOfStates.states.map(state => <option value={`${state}`} key={`${state}`}>{state}</option>)}
            </select>
            {
                errors.state ?
                <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.state.message}</p>
                : ''
            }
        </div>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='zipCode'>*Zip Code:</label>
            <input
                className='form__input'
                id='zipCode'
                placeholder="Zip Code"
                inputMode='numeric'
                {...register('zipCode', {
                    required: 'You must enter the zip code',
                    pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: 'Please enter a valid 5-digit zip code',
                    },
                })}
            />
            {
                errors.zipCode ?
                <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.zipCode.message}</p>
                : ''
            }
        </div>
    </>
    )
}

export default UploadPage2
