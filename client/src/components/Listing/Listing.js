import {useState} from 'react';
import rightArrow from '../../assets/images/right-arrow.svg'
import leftArrow from '../../assets/images/left-arrow.svg'
import './Listing.scss';
import {Link} from 'react-router-dom';

function Listing({listing, city}) {

    // image is the index of the image being displayed from the listing.images array
    // set the initial image value to be 0
    const [image, setImage] = useState(0);

    const handleNextImage = () => {
        // Create copy of image that we can alter, rather than changing state directly
        let imageCopy = image;

        imageCopy++

        setImage(imageCopy)
    }

    const handlePreviousImage = () => {
        // Create copy of image that we can alter, rather than changing state directly
        let imageCopy = image;

        imageCopy--

        setImage(imageCopy)
    }



    return (
        <section key={listing.id} className='listing-card' id={listing.id}>
            <div className='listing-card__image-container'>
                <img className='listing-card__image' src={`${listing.images[image]}`} alt="Office overview"/>
                {image < (listing.images.length-1) ? <img className='listing-card__right-arrow' onClick={() => handleNextImage()} src={rightArrow} alt='Right Arrow'/> : ''}
                {image > 0 ? <img className='listing-card__left-arrow' onClick={() => handlePreviousImage()} src={leftArrow} alt='Left Arrow'/> : ''}
                <div className='listing-card__counter-container'>
                    {listing.images.map((img, i) => {
                        return ( 
                            <div
                                className={i === image ? 'listing-card__image-counter--active' : 'listing-card__image-counter'}
                                key={i}
                            >
                            </div>
                        )
                    })}
                </div>
            </div>
            <Link to={`/listings/${city}/${listing.id}`} className='listing-card__link'>
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

