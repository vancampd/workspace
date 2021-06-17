import { useState, useEffect } from 'react';
import './ListingsPage.scss';
import axios from 'axios';
import Listing from '../../components/Listing';
import ListingMapNav from '../../components/ListingsMapNav';
import Map from '../../components/Map';
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

    const [mapActive, setMapActive] = useState(false)
  
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
        return <div className='listings-page'>Loading...</div>
    }
    
    return (
        <div className='listings-page'>
            <ListingMapNav mapActive={mapActive} setMapActive={setMapActive}/>
            {mapActive ? <Map listings={listings}/> : ''}
            {
                listings.map((listing, l) =>
                    <Listing 
                        listing={listing}
                        l={l}
                        handlePreviousImage={handlePreviousImage} 
                        handleNextImage={handleNextImage} 
                        image={image}
                        key={listing.id}
                    />
                )
           }
        </div>
    )
    
}

export default ListingsPage

