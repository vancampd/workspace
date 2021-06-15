import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './IndividualListing.scss';
import axios from 'axios';
import rightArrow from '../../assets/images/right-arrow.svg'
import leftArrow from '../../assets/images/left-arrow.svg'
const API_URL = 'http://localhost:8080/'

function IndividualListing() {

    const {listingID} = useParams();

    const [listings, setListings] = useState([]);
    useEffect(() => {
        // Get the listings
        getListings()
    }, [])

    const [mainListing, setMainListing] = useState(null)
    useEffect(()=> {
        // Set the listing being displayed on the page
        getMainListing()
    }, [listings])

    const [image, setImage] = useState(0);
    // useEffect(() => {
    //     if(listings.length > 0){
    //         const initialImage = listings.map(listing => 0)

    //         setImage(initialImage)
    //     }
    // }, [listings])

    const getListings = () => {
        axios
        .get(`${API_URL}listings`)
        .then(res => {
            const listings = res.data;
            setListings(listings)
        })
        .catch(err => console.log("Error fetching listings", err))
    }

    const getMainListing = () => {
        if(listings){
            const mainListing = listings.find(listing => listing.id === listingID)
            setMainListing(mainListing)
        }
    }

    const handleNextImage = () => {
        // Create copy array that we can alter, rather than changing state directly
        let imageCopy = image;

        imageCopy++

        setImage(imageCopy)
    }

    const handlePreviousImage = () => {
        // Create copy array that we can alter, rather than changing state directly
        let imageCopy = image;

        imageCopy--

        setImage(imageCopy)
    }

    if(!mainListing){
        return <div>Loading...</div>
    }

    return (

        <section className='individual-listing'>
            <h2 className='individual-listing__header'>{mainListing.title}</h2>
            <div className='listing-card__image-container'>
                <img className='listing-card__image' src={`http://localhost:8080/public/images/${mainListing.id}/${mainListing.images[image]}`} alt="Office overview"/>
                {image < (mainListing.images.length-1) ? <img className='listing-card__right-arrow' onClick={() => handleNextImage()} src={rightArrow} alt='Right Arrow'/> : ''}
                {image > 0 ? <img className='listing-card__left-arrow' onClick={() => handlePreviousImage()} src={leftArrow} alt='Left Arrow'/> : ''}
                <div className='listing-card__counter-container'>
                    {mainListing.images.map((img, i) => {
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
          
        </section>
    )
    
}

export default IndividualListing;
