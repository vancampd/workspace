import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './IndividualListing.scss';
import axios from 'axios';
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

    const handleChangeImage = (i) => {
        // Create copy array that we can alter, rather than changing state directly
        let imageCopy = image;

        imageCopy = i;

        setImage(imageCopy)
    }

    if(!mainListing){
        return <div>Loading...</div>
    }

    return (

        <section className='individual-listing'>
            <h2 className='individual-listing__header'>{mainListing.title}</h2>
            <div className='individual-listing__image-container'>
                <img className='individual-listing__image' src={`${mainListing.images[image]}`} alt="Office overview"/>
                <div className='individual-listing__counter-container'>
                    {mainListing.images.map((img, i) => {
                        return ( 
                            <div
                                className={i === image ? 'individual-listing__image-counter--active' : 'individual-listing__image-counter'}
                                key={i}
                            >
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='individual-listing__side-images'>
                {
                    mainListing.images.map((img,i) => {
                        if(img !== mainListing.images[image]){
                            return (
                                <div className='individual-listing__side-image-container'>
                                    <img className='individual-listing__side-image' onClick={()=>{handleChangeImage(i)}} src={img} alt='Listing'/>
                                </div>
                            )
                        }
                    
                    })
                           
                }
            </div>
            {/* <IndividualListingImages mainListing={mainListing} image={image} listings={listings}/> */}
          
        </section>
    )
    
}

export default IndividualListing;
