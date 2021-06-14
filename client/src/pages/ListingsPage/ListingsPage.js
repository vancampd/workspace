import { useState, useEffect } from 'react';
import './ListingsPage.scss';
import axios from 'axios';
import rightArrow from '../../assets/images/right-arrow.svg'
import leftArrow from '../../assets/images/left-arrow.svg'
import {Link} from 'react-router-dom';
const API_URL = 'http://localhost:8080/'

function ListingsPage() {


    const [listings, setListings] = useState([]);
    useEffect(() => {
        // Get the listings
        getListings()
    }, [])

    const [image, setImage] = useState([]);
    useEffect(() => {
        if(listings.length > 0){
            const initialImage = listings.map(listing => 0)

            setImage(initialImage)
        }
    }, [listings])

    const getListings = () => {
        axios
        .get(`${API_URL}listings`)
        .then(res => {
            const listings = res.data;
            setListings(listings)
        })
        .catch(err => console.log("Error fetching listings", err))
    }

    const handleNextImage = (i) => {
        // Create copy array that we can alter, rather than changing state directly
        const imageCopy = [...image];

        imageCopy[i]++

        setImage(imageCopy)
    }

    const handlePreviousImage = (i) => {
        // Create copy array that we can alter, rather than changing state directly
        const imageCopy = [...image];

        imageCopy[i]--

        setImage(imageCopy)
    }

    if(!listings.length || !image.length){
        return <div>Loading...</div>
    }
    
    return (

        <div className='listings-page'>
            {
                listings.map((listing, l) => {
                    return (
                        <section key={listing.id} className='listing-card'>
                            <div className='listing-card__image-container'>
                                <img className='listing-card__image' src={`http://localhost:8080/public/images/${listing.images[image[l]]}`} alt="Office overview"/>
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
                                </div>
                            </Link>
                        </section>
                    )
                })
            }
        </div>
    )
    
}

export default ListingsPage

