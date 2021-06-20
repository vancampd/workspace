import { useState, useEffect } from 'react';
import {useLocation, useParams} from 'react-router-dom';
import './ListingsPage.scss';
import axios from 'axios';
import Listing from '../../components/Listing';
import ListingMapNav from '../../components/ListingsMapNav';
import Map from '../../components/Map';
import BackArrow from '../../components/BackArrow';
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const API_URL = process.env.REACT_APP_EXPRESS_API_URL;
const GEO_URL = process.env.REACT_APP_GOOGLE_GEOCODING_URL;

function ListingsPage() {

    const {pathname}=useLocation()

    const {city} = useParams();

    const [mapActive, setMapActive] = useState(false)
  
    // const getListings = () => {
    //     axios
    //     .get(`${API_URL}listings`)
    //     .then(res => {
    //         const listings = res.data;

    //         const foundListings = listings.filter(listing => listing.city === city)

    //         setListings(foundListings)
    //     })
    //     .catch(err => console.log("Error fetching listings", err))
    // }
  
    const getFavorites = () => {
        axios
        .get(`${API_URL}favorites`)
        .then(res => {
            const favorites = res.data;
            setListings(favorites)
        })
        .catch(err => console.log("Error fetching listings", err))
    }

    const [listings, setListings] = useState([]);
    useEffect(() => {
        if(pathname ==='/favorites'){
            getFavorites()
        } else {
            // Get the listings
            axios
            .get(`${API_URL}listings`)
            .then(res => {
                const listings = res.data;

                const foundListings = listings.filter(listing => listing.city.toLowerCase() === city.toLowerCase())

                setListings(foundListings)
            })
            .catch(err => console.log("Error fetching listings", err))
        }
        
    }, [pathname, city])

    const [coordinates, setCoordinates] = useState();
    useEffect(()=> {
        axios
        .get(`${GEO_URL}${city}&key=${API_KEY}`)
    .then(res => {
        // console.log('geocode', res)
        const coordinates = res.data.results[0].geometry.location
        // console.log('coordinates', coordinates)
        setCoordinates(coordinates)
    })
    }, [city])

    if(pathname==='/favorites' && !listings.length){
        
        return (
            <>
                <BackArrow page='listings'/>
                <div className='listing-card'>You don't have any favorites</div>
            </>
        )
    }

    if(!listings.length || !coordinates){
        return <div className='listings-page'>Loading...</div>
    }
    
    return (
        <div className='listings-page'>
            {
                pathname==='/favorites' ?
                // <BackArrow path={`/listings/${city}`} page='listings'/>
                <BackArrow/>
                : ''
            }
            {
                pathname !== '/favorites' ?
                <>
                    <ListingMapNav mapActive={mapActive} setMapActive={setMapActive}/>
                    {mapActive ? <Map listings={listings} center={coordinates}/> : ''}
                </>
                : ''
            }
            {/* <ListingMapNav mapActive={mapActive} setMapActive={setMapActive}/>
            {mapActive ? <Map listings={listings} center={coordinates}/> : ''} */}
            {
                listings.map((listing, l) =>
                    <Listing 
                        listing={listing}
                        key={listing.id}
                        city={city}
                    />
                )
           }
        </div>
    )
    
}

export default ListingsPage

