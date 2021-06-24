import React from 'react'

function UploadPage1({handleInputChange, error, input, errorIcon}) {
    const {title, description, rentPeriod, price } = input;

    return (
        <>
            <h2 className='form__header'>Post your workspace</h2>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='title'>*Give a title to your post:</label>
                <input 
                    className='form__input' 
                    name='title' 
                    id='title' 
                    placeholder="Title"
                    value={input.title}
                    onChange={handleInputChange}
                />
                {
                    error && !title ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> You must enter the title of your post</p> 
                    : ''
                }
            </div>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='description'>*Describe your space:</label>
                <textarea 
                    className='form__input' 
                    name='description' 
                    id='description' 
                    placeholder="Description"
                    value={input.description}
                    onChange={handleInputChange}
                >
                </textarea>
                {
                    error && !description ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> You must write the description of your space</p> 
                    : ''
                }
            </div>
            <div className='form__element-container'>
                <div className='form__inner-container'>
                    <div className='form__inner-left'>
                        <label className='form__label'>**Length of availability:</label>
                        <div className='form__check-box-container'>
                            <label className='form__label'>
                                <input 
                                    className='form__input' 
                                    name='rentPeriod'
                                    id='daily' 
                                    value='Daily' 
                                    type='checkbox'
                                    checked={input.rentPeriod.includes('Daily') ? true : false}
                                    onChange={handleInputChange}
                                />
                                Daily
                            </label>
                            <label className='form__label'>
                                <input 
                                    className='form__input' 
                                    name='rentPeriod'
                                    id='weekly' 
                                    value='Weekly' 
                                    type='checkbox'
                                    checked={input.rentPeriod.includes('Weekly') ? true : false}
                                    onChange={handleInputChange}
                                />
                                Weekly
                            </label>
                            <label className='form__label'>
                                <input 
                                    className='form__input' 
                                    name='rentPeriod' 
                                    id='monthly'
                                    value='Monthly' 
                                    type='checkbox'
                                    checked={input.rentPeriod.includes('Monthly') ? true : false}
                                    onChange={handleInputChange}
                                />
                                Monthly
                            </label>
                            {
                                error && !rentPeriod ? 
                                <p className='error-text'><img src={errorIcon} alt='error icon'/> You must leave a time period</p> 
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
                                    name='amenities'
                                    id='Conference Room' 
                                    value='Conference Room' 
                                    type='checkbox'
                                    checked={input.amenities.includes('Conference Room') ? true : false}
                                    onChange={handleInputChange}
                                />
                                Conference Room
                            </label>
                            <label className='form__label'>
                                <input 
                                    className='form__input' 
                                    name='amenities'
                                    id='Refrigerator' 
                                    value='Refrigerator' 
                                    type='checkbox'
                                    checked={input.amenities.includes('Refrigerator') ? true : false}
                                    onChange={handleInputChange}
                                />
                                Refrigerator
                            </label>
                            <label className='form__label'>
                                <input 
                                    className='form__input' 
                                    name='amenities' 
                                    id='Bathroom'
                                    value='Bathroom' 
                                    type='checkbox'
                                    checked={input.amenities.includes('Bathroom') ? true : false}
                                    onChange={handleInputChange}
                                />
                                Bathroom
                            </label>
                            <label className='form__label'>
                                <input 
                                    className='form__input' 
                                    name='amenities' 
                                    id='Coffee'
                                    value='Coffee' 
                                    type='checkbox'
                                    checked={input.amenities.includes('Coffee') ? true : false}
                                    onChange={handleInputChange}
                                />
                                Coffee
                            </label>
                            <label className='form__label'>
                                <input 
                                    className='form__input' 
                                    name='amenities' 
                                    id='Outside work area'
                                    value='Outside work area' 
                                    type='checkbox'
                                    checked={input.amenities.includes('Outside work area') ? true : false}
                                    onChange={handleInputChange}
                                />
                                Outside work area
                            </label>
                        </div>
                    </div>
                </div>    
            </div>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='description'>Daily price:</label>
                <input 
                    className='form__input' 
                    name='price' 
                    id='price' 
                    placeholder="Enter the price to rent each day"
                    type='number'
                    value={parseInt(input.price, 10) || ''}
                    onChange={handleInputChange}
                />
                {
                    error && !price ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> You must list your daily price</p> 
                    : ''
                }
            </div>
        </>
    )
}

export default UploadPage1
