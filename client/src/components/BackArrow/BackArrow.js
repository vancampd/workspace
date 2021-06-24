import React from 'react'
import leftArrow from '../../assets/images/left-arrow.svg';
import './BackArrow.scss';

function BackArrow() {
    
    const handleReturnToListings = () => {
        window.history.back()
    }
    return (
        <div className='arrow-div' onClick={handleReturnToListings}>
            <img className='back-arrow' src={leftArrow} alt='back arrow'/>
            <p className='back-arrow-text'>back</p>
        </div>
    )
}

export default BackArrow
