import { useState } from 'react';
import {useLocation, useParams} from 'react-router-dom';
import './ListingsPage.scss';
import Listing from '../../components/Listing';
import ListingMapNav from '../../components/ListingsMapNav';
import Map from '../../components/Map';
import BackArrow from '../../components/BackArrow';
import { useCityListingsQuery } from '../../hooks/queries/useCityListingsQuery';
import { useFavoritesQuery } from '../../hooks/queries/useFavoritesQuery';
import { useGeocodeQuery } from '../../hooks/queries/useGeocodeQuery';

const ListingSkeletons = () => (
    <div className='listings-page__skeletons' aria-label='Loading listings'>
        {[0, 1, 2].map((item) => (
            <div className='listing-skeleton' key={item}>
                <div className='listing-skeleton__image' />
                <div className='listing-skeleton__content'>
                    <div className='listing-skeleton__line listing-skeleton__line--title' />
                    <div className='listing-skeleton__line' />
                    <div className='listing-skeleton__line listing-skeleton__line--short' />
                </div>
            </div>
        ))}
    </div>
)

function ListingsPage({signedIn, credentials}) {

    const {pathname}=useLocation()

    const {city} = useParams<{city: string}>();

    const [mapActive, setMapActive] = useState(false)

    const name = credentials.name
    const isFavoritesPage = pathname === '/favorites'

    const cityListingsQuery = useCityListingsQuery(city)
    const favoritesQuery = useFavoritesQuery(name)
    const geocodeQuery = useGeocodeQuery(city)
    const listings = isFavoritesPage ? favoritesQuery.data || [] : cityListingsQuery.data || []
    const coordinates = geocodeQuery.data

    if(isFavoritesPage && !signedIn){
        return <p className='listing-card'>You must be logged in to view your favorites</p>
    }

    if(isFavoritesPage && !listings.length){
        
        return (
            <>
                <BackArrow page='listings'/>
                <div className='listing-card'>You don't have any favorites</div>
            </>
        )
    }

    if(!listings.length || (!isFavoritesPage && !coordinates)){
        return (
            <div className='listings-page'>
                <ListingSkeletons />
            </div>
        )
    }
    
    return (
        <div className='listings-page'>
            {
                isFavoritesPage ?
                <BackArrow/>
                : <>
                    <ListingMapNav mapActive={mapActive} setMapActive={setMapActive}/>
                    {mapActive ? <Map listings={listings} center={coordinates}/> : ''}
                </>
            }
            {
                listings.map((listing) =>
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
