import './Comment.scss';
import Rating from '../Rating';

const Comment = ({comment, handleDeleteComment, rating}) => {

            return (
            <section className="comment"  key={comment.commentID}>
                {/* <div className="comment__image"></div> */}
                <div className="comment__content">
                    <div className="comment__header-container">
                        <h3 className="comment__header">{comment.name}</h3>
                        <span className="comment__date">{dynamicDate(comment)}</span>
                    </div>
                    <p className="comment__comment">{comment.comment}</p>
                    <div className='comment__button-div'>
                        <Rating rating={rating} setRating={()=>{}} classAddition='comment-star'/>
                        <button className="comment__delete-button" onClick={(e)=> handleDeleteComment(e, comment.commentID)}>delete</button>
                    </div>
                </div>
            </section>
                )
}


export default Comment;

// Calculates comment date as "" minutes, hours, days, months, or years ago
function dynamicDate (comment) {
    const currentDate = new Date();

        let commentDate = new Date(comment.date);

        let commentDay = commentDate.getDate()
        let commentMonth = commentDate.getMonth();
        let commentYear = commentDate.getFullYear();

        // The dynamic times are the amount of time since the comment was posted (current time - comment time)
        let dynamicDay = currentDate.getDate() - commentDay;
        let dynamicMonth = currentDate.getMonth() - commentMonth;
        let dynamicYear = currentDate.getFullYear() - commentYear;
        let dynamicHours = currentDate.getHours() - commentDate.getHours();
        let dynamicMinutes = currentDate.getMinutes() - commentDate.getMinutes();

        // If the comment was left in a different year than the current year
        if (dynamicYear > 0) {
            // if the comment was posted in the previous year, check how many months ago
            if (dynamicYear === 1) {
                // If dynamic month is negative, that means it was posted later in the respective calendar year than the current month.
                // So it is less than one year ago.
                // Ex: it is currently May 2021 (currentMonth = 05). 
                // If a comment was posted in september 2020 (commentMonth = 09), the dynamic month would be -4 (05 - 09).
                // -4 + 12 = 8. The comment was posted 8 months ago 
                if (dynamicMonth < 0){
                    commentDate = `${dynamicMonth + 12} months ago`;
                } else {
                    commentDate = `1 year ago`;
                }
            } else {
                commentDate = `${dynamicYear} years ago`;
            }
        // else, if it is the same year (dynamicYear === 0)
        } else{
            if (dynamicMonth === 0) {
                // If the comment was posted the same day as the current day
                if (dynamicDay === 0) {
                    if (dynamicHours === 0) {
                        if (dynamicMinutes < 0){
                            commentDate = `${dynamicMinutes + 60} minutes ago`
                        } else {
                            commentDate = `${dynamicMinutes} minutes ago`
                        }
                    }else if ( dynamicHours === 1) {
                        if (dynamicMinutes < 0){
                            commentDate = `${dynamicMinutes + 60} minutes ago`
                        } else {
                            commentDate = `${dynamicHours} hours ago`;
                        }
                    } else {
                        if (dynamicMinutes < 0) {
                            commentDate = `${dynamicHours - 1} hours ago`;
                        } else {
                            commentDate = `${dynamicHours} hours ago`;
                        }
                    }
                } else {
                    commentDate = `${dynamicDay} days ago`;
                }
            } else {
                commentDate = `${dynamicMonth} months ago`;
            }
        }

        return commentDate;

}