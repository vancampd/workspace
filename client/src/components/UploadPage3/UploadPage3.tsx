import { useFormContext } from 'react-hook-form';
import errorIcon from '../../assets/images/error-12px.svg';
import type { UploadFormValues } from '../../pages/UploadPage/uploadFormValues';

// Accepts 10 digits (optionally prefixed with 1) with common separators.
const validatePhone = (phone: string) => {
    if (!/^[\d\s().+-]+$/.test(phone)) return false;

    const digits = phone.replace(/\D/g, '');

    return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function UploadPage3() {
    const {
        register,
        formState: { errors },
    } = useFormContext<UploadFormValues>();

    const contactRequiredError =
        errors.phone?.type === 'contactRequired' ||
        errors.email?.type === 'contactRequired';
    const getContactValidation = (
        otherField: 'phone' | 'email',
        validateValue: (value: string) => boolean,
        invalidMessage: string
    ) => ({
        contactRequired: (value: string, formValues: UploadFormValues) =>
            Boolean(value || formValues[otherField]) ||
            'Either a valid phone or a valid email is required',
        validFormat: (value: string) => !value || validateValue(value) || invalidMessage,
    });

    return (
        <>
            <h2 className='form__sub-header'>**Contact Info</h2>
            {
                    contactRequiredError ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> Either a valid phone or a valid email is required</p>
                    : ''
            }
            <div className='form__element-container'>
                <label className='form__label' htmlFor='phone'>Phone:</label>
                <input
                    className='form__input'
                    id='phone'
                    type='tel'
                    placeholder="Phone Number"
                    {...register('phone', {
                        deps: 'email',
                        validate: getContactValidation(
                            'email',
                            validatePhone,
                            'Please enter a valid phone number'
                        ),
                    })}
                />
                {
                    errors.phone?.type === 'validFormat' ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.phone.message}</p>
                    : ''
                }
            </div>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='email'>Email:</label>
                <input
                    className='form__input'
                    id='email'
                    type='email'
                    placeholder="Email"
                    {...register('email', {
                        deps: 'phone',
                        validate: getContactValidation(
                            'phone',
                            validateEmail,
                            'Please enter a valid email'
                        ),
                    })}
                />
                {
                    errors.email?.type === 'validFormat' ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> {errors.email.message}</p>
                    : ''
                }
            </div>
        </>
    )
}

export default UploadPage3
