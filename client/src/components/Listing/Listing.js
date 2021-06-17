import React from 'react'
import rightArrow from '../../assets/images/right-arrow.svg'
import leftArrow from '../../assets/images/left-arrow.svg'
import {Link} from 'react-router-dom';

function Listing({listing, l, handlePreviousImage, handleNextImage, image}) {
    return (
        <section key={listing.id} className='listing-card' id={listing.id}>
            <div className='listing-card__image-container'>
                <img className='listing-card__image' src={`${listing.images[image[l]]}`} alt="Office overview"/>
                {image[l] < (listing.images.length-1) ? <img className='listing-card__right-arrow' onClick={() => handleNextImage(l)} src={rightArrow} alt='Right Arrow'/> : ''}
                {image[l] > 0 ? <img className='listing-card__left-arrow' onClick={() => handlePreviousImage(l)} src={leftArrow} alt='Left Arrow'/> : ''}
                <div className='listing-card__counter-container'>
                    {listing.images.map((img, i) => {
                        return ( 
                            <div
                                className={i === image[l] ? 'listing-card__image-counter--active' : 'listing-card__image-counter'}
                                key={i}
                            >
                            </div>
                        )
                    })}
                </div>
            </div>
            <Link to={`/listings/${listing.id}`} className='listing-card__link'>
                <div className='listing-card__description'>
                    <h2 className='listing-card__header'>{listing.title}</h2>
                    <p className='listing-card__text'>Rent period: {listing.rentPeriod}</p>
                    <p className='listing-card__cost'>
                        {listing.price}
                    </p>
                    
                </div>
            </Link>
        </section>
    )
}

export default Listing

