import React from 'react'

function UploadPage3({handleInputChange}) {
    return (
        <>
            <h2 className='form__sub-header'>Contact Info</h2>
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
            </div>
        </>
    )
}

export default UploadPage3
