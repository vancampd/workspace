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
                <label className='form__label' htmlFor='name'>Name:</label>
                <input
                    className='form__input' 
                    name='name' 
                    id='name' 
                    placeholder="Your Name"
                    onChange={handleInputChange}
                />
            </div>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='phone'>Phone:</label>
                <input
                    className='form__input' 
                    name='phone' 
                    id='phone' 
                    placeholder="Phone Number"
                    onChange={handleInputChange}
                />
                {/* {
                    !validPhone ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> Please enter a valid phone number</p> 
                    : ''
                } */}
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
                    onChange={handleInputChange}
                />
                {/* {
                    !validEmail ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> Please enter a email</p> 
                    : ''
                } */}
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
