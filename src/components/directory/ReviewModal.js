// src/components/directory/ReviewModal.js
"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { submitUserReview, updateUserReview } from "@/lib/actions";
import styles from "./ReviewModal.module.css";

export default function ReviewModal({ listingId, listingSlug, isOpen, onClose, currentUser, review = null }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!review;

  useEffect(() => {
    if (isEditMode && isOpen && review) {
      setRating(review.reviewFields?.starRating || 0);
      const cleanContent = review.content ? review.content.replaceAll(/<[^>]*>?/gm, "") : "";
      setContent(cleanContent);
    } else if (!isOpen && !isEditMode) {
      setRating(0);
      setContent("");
    }
  }, [review, isOpen, isEditMode]);

  if (!isOpen) return null;

  const MAX_CHAR_COUNT = 2000;

  // Check if user has already reviewed this listing using updated ACF structure
  const alreadyReviewedListing = currentUser?.ccrreviews?.nodes?.some(
    r => r.reviewFields?.relatedListing?.nodes?.[0]?.databaseId === Number.parseInt(listingId, 10)
  );

  const hasReviewed = !isEditMode && alreadyReviewedListing;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasReviewed) {
      setError("You have already submitted a review for this business.");
      return;
    }

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    if (content.length < 10) {
      setError("Your review must be at least 10 characters long.");
      return;
    }

    setIsUpdating(true);
    setError(null);

    let result;
    if (isEditMode) {
      result = await updateUserReview(review.id, { rating, content });
    } else {
      const formData = {
        listingId,
        listingSlug,
        rating,
        content,
        title: `${currentUser?.name || "User"}'s Review`
      };
      result = await submitUserReview(formData);
    }

    if (result.success) {
      onClose();
    } else {
      setError(result.message || result.error);
    }
    
    setIsUpdating(false);
  };

  const handleStarClick = (val) => setRating(val);
  const handleStarHover = (val) => setHoverRating(val);

  // Extract nested ternary for better readability
  let submitButtonText;
  if (isUpdating) {
    submitButtonText = isEditMode ? "Updating..." : "Submitting...";
  } else {
    submitButtonText = isEditMode ? "Update Your Review" : "Submit Your Review";
  }

  return (
    <div className={styles['review-modal-overlay']}>
      <button 
        className={styles['review-modal-overlay__btn']}
        onClick={onClose}
        aria-label="Close modal"
        type="button"
      />
      <dialog 
        className={styles['review-modal']} 
        open
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <button className={styles['review-modal__close']} onClick={onClose} aria-label="Close modal" type="button">
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 id="review-modal-title" className={styles['review-modal__title']}>
          {isEditMode ? "Edit Your Review" : "Leave a Review"}
        </h2>

        {hasReviewed ? (
          <div className={styles['review-modal__error']}>
            You have already reviewed this listing. You can only post one review per business.
          </div>
        ) : (
          <form className={styles['review-modal__form']} onSubmit={handleSubmit}>
            <div className={styles['review-modal__rating-container']}>
              <span className={styles['review-modal__rating-label']}>Your Rating</span>
              <div className={styles['review-modal__stars']}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`${styles['review-modal__star-btn']} ${
                      (hoverRating || rating) >= val ? styles['review-modal__star--active'] : ""
                    }`}
                    onMouseEnter={() => handleStarHover(val)}
                    onMouseLeave={() => handleStarHover(0)}
                    onClick={() => handleStarClick(val)}
                    aria-label={`Rate ${val} stars`}
                  >
                    <span 
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: (hoverRating || rating) >= val ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles['review-modal__form-group']}>
              <label className={styles['review-modal__label']} htmlFor="review-content">Your Review</label>
              <textarea
                id="review-content"
                className={styles['review-modal__textarea']}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CHAR_COUNT}
                placeholder="Share your experience with this business..."
                disabled={isUpdating}
              />
              <div className={`${styles['review-modal__count']} ${content.length >= MAX_CHAR_COUNT ? styles['review-modal__count--error'] : ""}`}>
                {content.length}/{MAX_CHAR_COUNT}
              </div>
            </div>

            {error && <div className={styles['review-modal__error']}>{error}</div>}

            <button
              type="submit"
              className={styles['review-modal__submit']}
              disabled={isUpdating || content.length < 10 || rating === 0}
            >
              {submitButtonText}
            </button>
          </form>
        )}
      </dialog>
    </div>
  );
}

ReviewModal.propTypes = {
  listingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  listingSlug: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    ccrreviews: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  review: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    reviewFields: PropTypes.shape({
      starRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};
