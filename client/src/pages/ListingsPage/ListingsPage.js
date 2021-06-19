import { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import './ListingsPage.scss';
import axios from 'axios';
import Listing from '../../components/Listing';
import ListingMapNav from '../../components/ListingsMapNav';
import Map from '../../components/Map';
import BackArrow from '../../components/BackArrow';
const API_URL = 'http://localhost:8080/'

function ListingsPage() {

    const {pathname}=useLocation()

    const [listings, setListings] = useState([]);
    useEffect(() => {
        if(pathname ==='/favorites'){
            getFavorites()
        } else {
            // Get the listings
            getListings()
        }
        
    }, [pathname])

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
  
    const getFavorites = () => {
        axios
        .get(`${API_URL}favorites`)
        .then(res => {
            const favorites = res.data;
            setListings(favorites)
        })
        .catch(err => console.log("Error fetching listings", err))
    }

    if(pathname==='/favorites' && !listings.length){
        
        return (
            <>
                <BackArrow page='listings'/>
                <div className='listing-card'>You don't have any favorites</div>
            </>
        )
    }

    if(!listings.length){
        return <div className='listings-page'>Loading...</div>
    }
    
    return (
        <div className='listings-page'>
            {
                pathname==='/favorites' ?
                <BackArrow page='listings'/>
                : ''
            }
            <ListingMapNav mapActive={mapActive} setMapActive={setMapActive}/>
            {mapActive ? <Map listings={listings}/> : ''}
            {
                listings.map((listing, l) =>
                    <Listing 
                        listing={listing}
                        key={listing.id}
                    />
                )
           }
        </div>
    )
    
}

export default ListingsPage

