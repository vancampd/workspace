import { useParams } from 'react-router-dom';
import './IndividualListing.scss';
// import axios from 'axios';
// const API_URL = 'http://localhost:8080/'

function IndividualListing() {

    const {listingID} = useParams();

    console.log('id', listingID)
    
    return (

        <div>
            Welcome to the individual listing page
            {/* {
                listings.map((listing) => {
                    return (
                        <section key={listing.id}>
                            <h2>{listing.title}</h2>
                            {listing.images.map((image, j) => {
                                return <img src={`http://localhost:8080/public/images/${image}`} alt={j} key={j}/>
                            })}
                            <p>{listing.description || ''}</p>

                        </section>
                    )
                })
            } */}
        </div>
    )
    
}

export default IndividualListing;
