import { useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './IndividualListing.scss';
import axios from 'axios';
import emptyLike from '../../assets/images/like-empty.svg';
import filledLike from '../../assets/images/like.svg';
import BackArrow from '../../components/BackArrow';
import Map from '../../components/Map';
import CommentSection from '../../components/CommentSection';
require('dotenv').config();
const API_URL = process.env.REACT_APP_EXPRESS_API_URL;

function IndividualListing({signedIn}) {

    const profileName = sessionStorage.getItem('name');

    const {listingID} = useParams();

    const [listings, setListings] = useState([]);
    useEffect(() => {
        // Get the listings
        getListings()
    }, [])

    const [mainListing, setMainListing] = useState(null)
    useEffect(()=> {
        // Set the main listing being displayed on the page
        if(listings){
            const mainListing = listings.find(listing => listing.id === listingID)
            setMainListing(mainListing)
        }
    } 
    , [listings, listingID])

    const [image, setImage] = useState('');
    useEffect(()=>{
        if(mainListing){
            setImage(mainListing.images[0])
        }
    },[mainListing])

    const getListings = () => {
        axios
        .get(`${API_URL}listings`)
        .then(res => {
            const listings = res.data;
            setListings(listings)
        })
        .catch(err => console.log("Error fetching listings", err))
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
        .catch(err => console.log("error posting favorite", err))
    }

    const handleRemoveFavorite = () => {
        setFavorite(false)

        axios
        .delete(`${API_URL}favorites`, {
            data:{
                id: mainListing.id
            }
        })
        .catch(err => console.log('error removing favorite', err))
    }

    const [error, setError] = useState(false);

    const [rating, setRating] = useState(0)

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        const newComment = {
            // name: e.target[0].value,
            name: profileName,
            comment: e.target[0].value
        }

        if(!profileName|| !newComment.comment || !rating){   
            return setError(true)
        }

        axios
        .post(`${API_URL}listings/${mainListing.id}/comments`, {
            listingID: mainListing.id,
            rating,
            ...newComment
        })
        .then(res => setMainListing(res.data))
        .catch(err => console.log('error posting comment', err))

        e.target.reset();
        setRating(0)
        setError(false)

    }


    const handleDeleteComment = (e, commentID) => {
        e.preventDefault();    
     
        axios
          .delete(`${API_URL}listings/${mainListing.id}/comments/${commentID}`, 
          {
            data:{
              listingID: mainListing.id, commentID
            }
          })
          .then(res => setMainListing(res.data))
    }

    if(!mainListing){
        return <div className='individual-listing'>Loading...</div>
    }

    const sideImages = mainListing.images.filter(img => img !== image)
    
    return (
        <>    
            {/* <BackArrow path={`/listings/${city}`} page='listings'/> */}
            <BackArrow/>
            <section className='individual-listing'>
                <h2 className='individual-listing__header'>{mainListing.title}</h2>
                <div className='individual-listing__image-container'>
                    <img className='individual-listing__image' src={image} alt="Office overview"/>
                    <div className='individual-listing__counter-container'>
                        {mainListing.images.map((img) => {
                            return ( 
                                <div
                                    className={img === image ? 'individual-listing__image-counter--active' : 'individual-listing__image-counter'}
                                    key={img}
                                >
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='individual-listing__side-images'>
                    {
                        sideImages.map((img,i) => {
                            return (
                                <div className='individual-listing__side-image-container' key={i}>
                                    <img className='individual-listing__side-image' onClick={()=>{setImage(img)}} src={img} alt='Listing'/>
                                </div>
                            )
                        })
                    }
                </div>
                <section className='individual-listing__info'>
                    <div className='individual-listing__details-left'>
                        <p className='individual-listing__text'>{mainListing.description}</p>
                        <p className='individual-listing__text'>Rent period: <span className='individual-listing__text--bold'>{mainListing.rentPeriod}</span></p>
                        <p className='individual-listing__text'>Daily rent: <span className='individual-listing__text--bold'>{mainListing.price}</span></p>
                        <ul className='individual-listing__contact-info'>
                        {
                           mainListing.name || mainListing.phone || mainListing.email ?
                           <h3 className='individual-listing__list-heading'>Contact:</h3>
                           : ''
                        }
                        {
                            mainListing.name ?
                            <li className='individual-listing__list-item'>Name: {mainListing.name}</li>
                            : ''
                        }
                        {
                            mainListing.phone ?
                            <li className='individual-listing__list-item'>Phone: {mainListing.phone}</li>
                            : ''
                        }
                        {
                            mainListing.email ?
                            <li className='individual-listing__list-item'>Email: {mainListing.email}</li>
                            : ''
                        }
                    </ul>
                    </div>
                    <div className='individual-listing__details-right'>
                        {
                            signedIn ?
                            <div className='individual-listing__like-button-container'>
                                {
                                    isFavorite ?
                                    <img className='individual-listing__like-button' src={filledLike} alt='Like Button' onClick={handleRemoveFavorite}/>
                                    : <img className='individual-listing__like-button' src={emptyLike} alt='Like Button' onClick={handleAddFavorite}/>
                                } 
                            </div>
                            : <img className='individual-listing__like-button' src={emptyLike} alt='Like Button' title='You must be signed in to add a favorite'/>
                        }
                        
                        {
                            mainListing.amenities.length > 0 ?
                            <ul className='individual-listing__features'>
                                <h3 className='individual-listing__list-heading'>Amenities:</h3>
                                {
                                    mainListing.amenities.map((detail,i) => <li className='individual-listing__list-item' key={i}>{detail}</li>)
                                }
                            </ul>
                            : ''
                        }
                        
                    </div>
                </section>
                <Map 
                    listings={mainListing} 
                    center={{lat: Number(mainListing.coordinates.lat), lng: Number(mainListing.coordinates.lng)}} 
                    zoom={13}
                />
                <CommentSection 
                    mainListing={mainListing} 
                    handleCommentSubmit={handleCommentSubmit} 
                    handleDeleteComment={handleDeleteComment} 
                    rating={rating} 
                    setRating={setRating}
                    error={error}
                    setError={setError}
                    signedIn={signedIn}
                />
            </section>
        </>
    )
    
}

export default IndividualListing;
