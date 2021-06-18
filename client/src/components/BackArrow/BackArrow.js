import React from 'react'
import leftArrow from '../../assets/images/left-arrow.svg';
import {useHistory} from 'react-router-dom';
import './BackArrow.scss';

function BackArrow({page}) {

    const history = useHistory();
    
    const handleReturnToListings = () => {
        history.push(`/${page}`)
    }
    return (
        <div className='arrow-div' onClick={handleReturnToListings}>
            <img className='back-arrow' src={leftArrow} alt='back arrow'/>
            <p className='back-arrow-text'>{page}</p>
        </div>
    )
}

export default BackArrow
