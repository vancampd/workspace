import './CommentSection.scss';
import Comment from '../Comment';
import {useState} from 'react';
import Rating from '../Rating';
import errorIcon from '../../assets/images/error-12px.svg';
require('dotenv').config();

function CommentSection({mainListing, handleCommentSubmit, handleDeleteComment, rating, setRating, error}) {

    const [input, setInput]= useState({})

    const handleInputChange = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    const comments = mainListing.comments.sort((commentA, commentB) => {
        return (commentB.date - commentA.date);
    })

    let totalRatings = 0;
    mainListing.comments.forEach(comment => totalRatings = totalRatings + comment.rating)
    const averageRating = (Math.round((totalRatings/mainListing.comments.length)*10)/10).toFixed(1);

    return (
        <section className="comments-section">
            <h3 className="comments-section__header">
             {averageRating} out of 5 stars
                ({
                    mainListing.comments.length === 1 ?
                    `${mainListing.comments.length} Review`
                    : `${mainListing.comments.length} Reviews`
                })
            </h3>
            <div className="comments-section__container">
                <form className="comments-section__form" onSubmit={handleCommentSubmit}>
                    <div className="comments-section__form-content">
                        <label className='form__label'>Rating</label>
                        <Rating rating={rating} setRating={setRating}/>
                        {
                            error && !rating ? 
                            <p className='error-text'><img src={errorIcon} alt='error icon'/> You must leave a rating</p> 
                            : ''
                        }
                        {/* <label className="comments-section__label" htmlFor="person">name</label>
                        <input
                            className={error && !input.name ? "comments-section__input--name error" : "comments-section__input--name"}
                            type ="text" 
                            name="name" 
                            onChange={handleInputChange}
                            placeholder="Write name here"
                        /> */}
                        <div className={error & !input.name ? 'form__element-container--comment error' : 'form__element-container--comment'}>
                            <label className='form__label' htmlFor='name'>Name</label>
                            <input 
                                className='form__input'
                                name='name' 
                                id='name'
                                placeholder="Write name here"
                                onChange={handleInputChange}
                            />
                        </div>
                        {
                            error && !input.name ? 
                            <p className='error-text'><img src={errorIcon} alt='error icon'/> Your name is required</p> 
                            : ''
                        }
                        
                        {/* <label className="comments-section__label" htmlFor="comment">review</label>
                        <textarea 
                            className={error && !input.comment ? "comments-section__text-area error" : "comments-section__text-area"}
                            name="comment" 
                            onChange={handleInputChange}
                            placeholder="Leave review here"
                        >
                        </textarea>
                        <input 
                            className={error && !input.name ? "comments-section__input error" : "comments-section__input"}
                            type ="text" 
                            name="comment" 
                            onChange={handleInputChange}
                            placeholder="Leave review here"
                        /> */}
                        <div className={error & !input.comment ? 'form__element-container--comment error' : 'form__element-container--comment'}>
                            <label className='form__label' htmlFor='name'>Review</label>
                            <input 
                                className='form__input'
                                name='comment' 
                                id='comment'
                                placeholder="Leave review here"
                                onChange={handleInputChange}
                            />
                        </div>
                        {
                            error && !input.comment ? 
                            <p className='error-text'><img src={errorIcon} alt='error icon'/> Text is required in the review field</p> 
                            : ''
                        }
                    </div>
                    <div className="comments-section__button-container">
                        {/* <button className="comments-section__button--cancel" type='reset' onClick={()=>{handleCancelComment(); setInput({})}}>Cancel</button> */}
                        {/* <button className="comments-section__button--cancel" type='reset'>Cancel</button> */}
                        <button type='submit' className="comments-section__button">Submit</button>
                    </div>

                    {/* <button className='button' type='submit'>Submit</button> */}
                </form>
            </div>
            {comments.map(comment =>
            <Comment
                key={comment.commentID}
                comment={comment}
                handleDeleteComment={handleDeleteComment}
                rating={comment.rating}
            />
            )}
        </section>
    ) 
    
}

export default CommentSection;

