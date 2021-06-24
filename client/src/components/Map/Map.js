import './Map.scss'
import GoogleMapReact from 'google-map-react';
import MapIcon from '../MapIcon';
require('dotenv').config()
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function Map({listings, center, zoom}) {
    const defaultProps={
        zoom: 10
    };

    return (
        <div>
            <div className='map-container'>
            <GoogleMapReact
                bootstrapURLKeys={{key: `${API_KEY}`, language: 'en'}}
                defaultCenter={center}
                defaultZoom={zoom || defaultProps.zoom}
            >
                {
                    listings.length ?
                    listings.map(listing => {
                        return (
                            <MapIcon
                                lat={listing.coordinates.lat}
                                lng={listing.coordinates.lng}
                                text={listing.price}
                                key={listing.id}
                                href={listing.id}
                            />
                        )
                    })
                    : <MapIcon
                        lat={listings.coordinates.lat}
                        lng={listings.coordinates.lng}
                        text={listings.price}
                        key={listings.id}
                        href={listings.id}
                    />
                }
            </GoogleMapReact>
            </div>
        </div>
        ) 
    
}

export default Map
