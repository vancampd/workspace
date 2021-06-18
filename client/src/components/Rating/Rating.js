import './Rating.scss';
import star from '../../assets/images/star.svg';
import emptyStar from '../../assets/images/empty-star.svg';

function Rating({rating, setRating, classAddition}) {


    return (
        <div>
            {
                rating >= 1 ? 
                <img className={`star ${classAddition || ''}`} src={star} alt='star' onClick={()=>{setRating(1)}}/> 
                : <img className={`star ${classAddition || ''}`} src={emptyStar} alt='empty star' onClick={()=>{setRating(1)}}/>
            }
            {
                rating >= 2 ? 
                <img className={`star ${classAddition || ''}`} src={star} alt='star' onClick={()=>{setRating(2)}}/> 
                : <img className={`star ${classAddition || ''}`} src={emptyStar} alt='empty star' onClick={()=>{setRating(2)}}/>
            }
            {
                rating >= 3 ? 
                <img className={`star ${classAddition || ''}`} src={star} alt='star' onClick={()=>{setRating(3)}}/> 
                : <img className={`star ${classAddition || ''}`} src={emptyStar} alt='empty star' onClick={()=>{setRating(3)}}/>
            }
            {
                rating >= 4 ? 
                <img className={`star ${classAddition || ''}`} src={star} alt='star' onClick={()=>{setRating(4)}}/> 
                : <img className={`star ${classAddition || ''}`} src={emptyStar} alt='empty star' onClick={()=>{setRating(4)}}/>
            }
            {
                rating === 5 ? 
                <img className={`star ${classAddition || ''}`} src={star} alt='star' onClick={()=>{setRating(5)}}/> 
                : <img className={`star ${classAddition || ''}`} src={emptyStar} alt='empty star' onClick={()=>{setRating(5)}}/>
            }
        </div>
    )
}

export default Rating
