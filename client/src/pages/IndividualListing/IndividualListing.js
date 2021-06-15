import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './IndividualListing.scss';
import axios from 'axios';
import emptyLike from '../../assets/images/like-empty.svg';
import filledLike from '../../assets/images/like.svg';
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

    const handleChangeImage = (i) => {
        // Create copy array that we can alter, rather than changing state directly
        let imageCopy = image;

        imageCopy = i;

        setImage(imageCopy)
    }

    const [isFavorite, setFavorite] = useState(false);
    useEffect(()=> {
        // Check if mainListing exists in favorites
        if(mainListing){
           axios
            .get(`${API_URL}favorites`)
            .then(res => {
                const favorites = res.data;
                if(favorites.some(favorite => favorite.id === mainListing.id)){
                    setFavorite(true)
                } else {
                    setFavorite(false)
                }
            }) 
        }
        
    }, [mainListing])

    const handleAddFavorite = () => {
        setFavorite(true)

        axios
        .post(`${API_URL}favorites`, mainListing)
        // .then(res => console.log(res.data))
        .catch(err => console.log("error posting favorite", err))
    }

    const handleRemoveFavorite = () => {
        setFavorite(false)
        // console.log('removing favorite')

        axios
        .delete(`${API_URL}favorites`, {
            data:{
                id: mainListing.id
            }
        })
        // .then(res => console.log(res.data))
        .catch(err => console.log('error removing favorite', err))
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
                                <div className='individual-listing__side-image-container' key={i}>
                                    <img className='individual-listing__side-image' onClick={()=>{handleChangeImage(i)}} src={img} alt='Listing'/>
                                </div>
                            )
                        }                    
                    })        
                }
            </div>
            <div>
                {
                    isFavorite ?
                    <img className='individual-listing__like-button' src={filledLike} alt='Like Button' onClick={handleRemoveFavorite}/>
                    : <img className='individual-listing__like-button' src={emptyLike} alt='Like Button' onClick={handleAddFavorite}/>
                } 
            </div>
            <section className='individual-listing__details'>
                <div>
                    <p className='individual-listing__text'>{mainListing.description}</p>
                    <p className='individual-listing__text'>Rent period: <span className='individual-listing__text--bold'>{mainListing.rentPeriod}</span></p>
                    <p className='individual-listing__text'>Price: <span className='individual-listing__text--bold'>{mainListing.price}</span></p>
                    <ul>
                    {/* Contact:
                    {
                        for(key in mainListing.contactInfo){
                            
                        }
                    } */}
                </ul>
                </div>
                <ul className='individual-listing__features'>
                    Features:
                    {
                        mainListing.details.map((detail,i) => <li key={i}>{detail}</li>)
                    }
                </ul>
            </section>
          
        </section>
    )
    
}

export default IndividualListing;
