function UploadPage1({register, errors, errorIcon}) {
    const rentPeriodRules = {
        validate: (value) =>
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
                            <label className='form__label'>
                                <input
                                    className='form__input'
                                    id='daily'
                                    value='Daily'
                                    type='checkbox'
                                    {...register('rentPeriod', rentPeriodRules)}
                                />
                                Daily
                            </label>
                            <label className='form__label'>
                                <input
                                    className='form__input'
                                    id='weekly'
                                    value='Weekly'
                                    type='checkbox'
                                    {...register('rentPeriod', rentPeriodRules)}
                                />
                                Weekly
                            </label>
                            <label className='form__label'>
                                <input
                                    className='form__input'
                                    id='monthly'
                                    value='Monthly'
                                    type='checkbox'
                                    {...register('rentPeriod', rentPeriodRules)}
                                />
                                Monthly
                            </label>
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
                <label className='form__label' htmlFor='price'>Daily price:</label>
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
