function UploadPage3({register, errors, errorIcon, validatePhone, validateEmail}) {
    const contactRequiredError =
        errors.phone?.type === 'contactRequired' ||
        errors.email?.type === 'contactRequired';
    const getContactValidation = (otherField, validateValue, invalidMessage) => ({
        contactRequired: (value, formValues) =>
            Boolean(value || formValues[otherField]) ||
            'Either a valid phone or a valid email is required',
        validFormat: (value) => !value || validateValue(value) || invalidMessage,
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
