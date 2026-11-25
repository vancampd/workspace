import { useFormContext } from 'react-hook-form';
import FormError from '../FormError';
import TextField from '../TextField';
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
            {contactRequiredError ? <FormError>Either a valid phone or a valid email is required</FormError> : ''}
            <TextField
                name='phone'
                label='Phone:'
                type='tel'
                placeholder='Phone Number'
                shouldShowError={(error) => error.type === 'validFormat'}
                rules={{
                    deps: 'email',
                    validate: getContactValidation(
                        'email',
                        validatePhone,
                        'Please enter a valid phone number'
                    ),
                }}
            />
            <TextField
                name='email'
                label='Email:'
                type='email'
                placeholder='Email'
                shouldShowError={(error) => error.type === 'validFormat'}
                rules={{
                    deps: 'phone',
                    validate: getContactValidation(
                        'phone',
                        validateEmail,
                        'Please enter a valid email'
                    ),
                }}
            />
        </>
    )
}

export default UploadPage3
