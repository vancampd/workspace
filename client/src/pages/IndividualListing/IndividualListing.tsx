import { useParams} from 'react-router-dom';
import { useState } from 'react';
import './IndividualListing.scss';
import emptyLike from '../../assets/images/like-empty.svg';
import filledLike from '../../assets/images/like.svg';
import BackArrow from '../../components/BackArrow';
import Map from '../../components/Map';
import CommentSection from '../../components/CommentSection';
import {
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
} from '../../hooks/mutations/useFavoriteMutations';
import {
    useCreateCommentMutation,
    useDeleteCommentMutation,
} from '../../hooks/mutations/useCommentMutations';
import { useFavoritesQuery } from '../../hooks/queries/useFavoritesQuery';
import { useListingQuery } from '../../hooks/queries/useListingQuery';

function IndividualListing({signedIn, credentials}) {

    const profileName = credentials.name

    const {listingID} = useParams<{listingID: string}>();

    const [favoriteClicked, setFavoriteClicked] = useState(false);

    const listingQuery = useListingQuery(listingID);
    const [updatedListing, setUpdatedListing] = useState(null)
    const [selectedImage, setSelectedImage] = useState('');
    const favoritesQuery = useFavoritesQuery(profileName)
    const addFavoriteMutation = useAddFavoriteMutation(profileName)
    const removeFavoriteMutation = useRemoveFavoriteMutation(profileName)
    const createCommentMutation = useCreateCommentMutation()
    const deleteCommentMutation = useDeleteCommentMutation()
    const mainListing = updatedListing?.id === listingID ? updatedListing : listingQuery.data
    const isFavorite = Boolean(
        mainListing &&
        favoritesQuery.data?.some(favorite => favorite.id === mainListing.id)
    )

    const handleAddFavorite = () => {
        addFavoriteMutation.mutate(
            { name: profileName, favoriteListing: mainListing },
            {
                onError: (err) => {
                    console.log("error posting favorite", err)
                }
            }
        )
    }

    const handleRemoveFavorite = () => {
        removeFavoriteMutation.mutate(
            { name: profileName, listingId: mainListing.id },
            {
                onError: (err) => {
                    console.log('error removing favorite', err)
                }
            }
        )
    }

    const [error, setError] = useState(false);

    const [rating, setRating] = useState(0)

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        const newComment = {
            name: profileName,
            comment: e.target[0].value
        }

        if(!profileName|| !newComment.comment || !rating){   
            return setError(true)
        }

        createCommentMutation.mutate(
            {
                listingId: mainListing.id,
                comment: {
                    listingID: mainListing.id,
                    rating,
                    ...newComment
                }
            },
            {
                onSuccess: (data) => setUpdatedListing(data),
                onError: (err) => console.log('error posting comment', err),
            }
        )

        e.target.reset();
        setRating(0)
        setError(false)

    }


    const handleDeleteComment = (e, commentID) => {
        e.preventDefault();    
     
        deleteCommentMutation.mutate(
            {
                listingId: mainListing.id,
                commentId: commentID,
            },
            {
                onSuccess: (data) => setUpdatedListing(data),
            }
        )
    }

    if(!mainListing){
        return <div className='individual-listing'>Loading...</div>
    }

    const image = selectedImage || mainListing.images[0]
    const sideImages = mainListing.images.filter(img => img !== image)
    
    return (
        <>    
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
                                    <img className='individual-listing__side-image' onClick={()=>{setSelectedImage(img)}} src={img} alt='Listing'/>
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
                            : <div className='individual-listing__like-button-container'>
                                <img className='individual-listing__like-button' src={emptyLike} alt='Like Button' onClick={()=>setFavoriteClicked(true)}title='You must be signed in to add a favorite'/>
                                {
                                    favoriteClicked?
                                    <p className='error-text'>You must be signed in to like a post</p>
                                    : ''
                                }
                            </div>
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
                    profileName={profileName}
                />
            </section>
        </>
    )
    
}

export default IndividualListing;
