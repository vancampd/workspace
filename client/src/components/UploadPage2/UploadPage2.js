import React from 'react'
import listOfStates from '../../assets/data/listOfStates.json';

function UploadPage2({handleInputChange}) {
    return (
        <>
        <h2 className='form__sub-header'>Location</h2>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='streetAddress'>Street Address:</label>
                <input 
                    className='form__input' 
                    name='streetAddress' 
                    id='streetAddress' 
                    placeholder="Street Address"
                    onChange={handleInputChange}
                />
            </div>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='city'>City:</label>
            <input 
                className='form__input' 
                name='city' 
                id='city' 
                placeholder="City"
                onChange={handleInputChange}
            />
        </div>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='state'>State:</label>
            <select id='state' name='state' onChange={handleInputChange} className='form__select'>
                {listOfStates.states.map(state => <option value={`${state}`} key={`${state}`}>{state}</option>)}
            </select>
        </div>
        <div className='form__element-container'>
            <label className='form__label' htmlFor='zipCode'>Zip Code:</label>
            <input 
                className='form__input' 
                name='zipCode' 
                id='zipCode' 
                placeholder="Zip Code"
                onChange={handleInputChange}
            />
        </div>
    </>
    )
}

export default UploadPage2
