import React from 'react'
import listOfStates from '../../assets/data/listOfStates.json';

function UploadPage2({handleInputChange, error, input, errorIcon}) {
    const {streetAddress, city, state} = input;

    return (
        <>
        <h2 className='form__sub-header'>Location</h2>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='streetAddress'>*Street Address:</label>
                <input 
                    className='form__input' 
                    name='streetAddress' 
                    id='streetAddress' 
                    placeholder="Street Address"
                    onChange={handleInputChange}
                />
                {
                    error && !streetAddress ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> You must enter the street address</p> 
                    : ''
                }
            </div>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='city'>*City:</label>
            <input 
                className='form__input' 
                name='city' 
                id='city' 
                placeholder="City"
                onChange={handleInputChange}
            />
             {
                error && !city ? 
                <p className='error-text'><img src={errorIcon} alt='error icon'/> You must enter the city</p> 
                : ''
            }
        </div>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='state'>*State:</label>
            <select id='state' name='state' onChange={handleInputChange} className='form__select'>
                {listOfStates.states.map(state => <option value={`${state}`} key={`${state}`}>{state}</option>)}
            </select>
            {
                error && !state ? 
                <p className='error-text'><img src={errorIcon} alt='error icon'/> You must select a state</p> 
                : ''
            }
        </div>
        {/* <div className='form__element-container'>
            <label className='form__label' htmlFor='zipCode'>Zip Code:</label>
            <input 
                className='form__input' 
                name='zipCode' 
                id='zipCode' 
                placeholder="Zip Code"
                onChange={handleInputChange}
            />
        </div> */}
    </>
    )
}

export default UploadPage2