import React from 'react'

function UploadPage1({handleInputChange}) {
    return (
        <>
            <h2 className='form__header'>Post your workspace</h2>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='title'>Give a title to your post:</label>
                <input 
                    className='form__input' 
                    name='title' 
                    id='title' 
                    placeholder="Title"
                    onChange={handleInputChange}
                />
            </div>
            <div className='form__element-container'>
                <label className='form__label' htmlFor='description'>Describe your space:</label>
                <textarea 
                    className='form__input' 
                    name='description' 
                    id='description' 
                    placeholder="Description"
                    onChange={handleInputChange}
                >
                </textarea>
            </div>
            <div className='form__element-container'>
                <div className='form__inner-container'>
                    <div className='form__inner-left'>
                        <label className='form__label'>Length of availability:</label>
                        <div className='form__check-box-container'>
                            <label className='form__label'>
                                <input 
                                    className='form__input' 
                                    name='rentPeriod'
                                    id='daily' 
                                    value='Daily' 
                                    type='checkbox'
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
                                    onChange={handleInputChange}
                                />
                                Monthly
                            </label>
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
                    onChange={handleInputChange}
                />
            </div>
        </>
    )
}

export default UploadPage1
