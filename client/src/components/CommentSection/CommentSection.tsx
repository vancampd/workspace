import "./CommentSection.scss";
import Comment from "../Comment";
import Rating from "../Rating";
import errorIcon from "../../assets/images/error-12px.svg";
import { useForm, useWatch } from "react-hook-form";
import { useCreateCommentMutation } from "../../hooks/mutations/useCommentMutations";

type CommentFormValues = {
  comment: string;
  rating: number;
};

function CommentSection({
  mainListing,
  onCommentCreated,
  handleDeleteComment,
  signedIn,
  profileName,
}: any) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CommentFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });
  const createCommentMutation = useCreateCommentMutation();
  const rating = useWatch({
    control,
    name: "rating",
  });
  const comments = [...mainListing.comments].sort((commentA, commentB) => {
    return commentB.date - commentA.date;
  });
  const totalRatings = mainListing.comments.reduce(
    (total, comment) => total + comment.rating,
    0,
  );
  const averageRating = (
    Math.round((totalRatings / mainListing.comments.length) * 10) / 10
  ).toFixed(1);

  const handleCancelComment = () => {
    reset();
    createCommentMutation.reset();
  };

  const handleValidCommentSubmit = ({ comment, rating }: CommentFormValues) => {
    createCommentMutation.mutate(
      {
        listingId: mainListing.id,
        comment: {
          listingID: mainListing.id,
          name: profileName,
          comment,
          rating,
        },
      },
      {
        onSuccess: (updatedListing) => {
          onCommentCreated(updatedListing);
          reset();
        },
      }
    );
  };

  const handleRatingChange = (nextRating) => {
    setValue("rating", nextRating, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="comments-section">
      <h3 className="comments-section__header">
        {mainListing.comments.length > 0 && `${averageRating} out of 5 stars`}(
        {mainListing.comments.length === 1
          ? `${mainListing.comments.length} Review`
          : `${mainListing.comments.length} Reviews`}
        )
      </h3>
      {signedIn ? (
        <div className="comments-section__container">
          <form
            className="comments-section__form"
            onSubmit={handleSubmit(handleValidCommentSubmit)}
          >
            <div className="comments-section__form-content">
              <label className="form__label">Rating</label>
              <Rating rating={rating} setRating={handleRatingChange} />
              <input
                type="hidden"
                {...register("rating", {
                  validate: (value) =>
                    Number(value) > 0 || "You must leave a rating",
                })}
              />
              {errors.rating ? (
                <p className="error-text">
                  <img src={errorIcon} alt="error icon" /> {errors.rating.message}
                </p>
              ) : (
                ""
              )}
              <div
                className={
                  errors.comment
                    ? "form__element-container--comment error"
                    : "form__element-container--comment"
                }
              >
                <label className="form__label" htmlFor="comment">
                  Review
                </label>
                <input
                  className="form__input"
                  id="comment"
                  placeholder="Leave review here"
                  {...register("comment", {
                    required: "Text is required in the review field",
                  })}
                />
              </div>
              {errors.comment ? (
                <p className="error-text">
                  <img src={errorIcon} alt="error icon" />{" "}
                  {errors.comment.message}
                </p>
              ) : (
                ""
              )}
              {createCommentMutation.isError ? (
                <p className="error-text">
                  <img src={errorIcon} alt="error icon" /> Unable to submit your
                  review. Please try again.
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="comments-section__button-container">
              <button
                className="comments-section__button--cancel"
                type="reset"
                onClick={handleCancelComment}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="comments-section__button"
                disabled={createCommentMutation.isPending}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        ""
      )}
      {comments.map((comment) => (
        <Comment
          key={comment.commentID}
          comment={comment}
          handleDeleteComment={handleDeleteComment}
          rating={comment.rating}
          profileName={profileName}
        />
      ))}
    </section>
  );
}

export default CommentSection;
