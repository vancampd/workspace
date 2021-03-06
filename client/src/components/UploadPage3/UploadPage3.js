import React from 'react'

function UploadPage3({handleInputChange, error, input, errorIcon, validatePhone, validateEmail}) {
    const {phone, email} = input;

    return (
        <>
            <h2 className='form__sub-header'>**Contact Info</h2>
            {
                    error && !phone && !email ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> Either a valid phone or a valid email is required</p> 
                    : ''
            }
            <div className='form__element-container'>
                <label className='form__label' htmlFor='phone'>Phone:</label>
                <input
                    className='form__input' 
                    name='phone' 
                    id='phone' 
                    placeholder="Phone Number"
                    value={input.phone}
                    onChange={handleInputChange}
                />
                {
                    error && phone && !validatePhone(phone) ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> Please enter a valid phone number</p> 
                    : ''
                }
            </div>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='email'>Email:</label>
                <input
                    className='form__input' 
                    name='email' 
                    id='email' 
                    placeholder="Email"
                    value={input.email}
                    onChange={handleInputChange}
                />
                {
                    error && email && !validateEmail(email) ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> Please enter a valid email</p> 
                    : ''
                }
            </div>
        </>
    )
}

export default UploadPage3
