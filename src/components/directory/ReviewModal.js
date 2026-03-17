// src/components/directory/ReviewModal.js
"use client";

import { useState, useEffect } from "react";
import { submitUserReview, updateUserReview } from "@/lib/actions";
import "./ReviewModal.css";

export default function ReviewModal({ listingId, listingSlug, isOpen, onClose, currentUser, review = null }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!review;

  useEffect(() => {
    if (isEditMode && isOpen && review) {
      setRating(review.reviewFields?.starRating || 0);
      const cleanContent = review.content ? review.content.replace(/<[^>]*>?/gm, "") : "";
      setContent(cleanContent);
    } else if (!isOpen && !isEditMode) {
      setRating(0);
      setContent("");
    }
  }, [review, isOpen, isEditMode]);

  if (!isOpen) return null;

  const MAX_CHAR_COUNT = 2000;

  // Check if user has already reviewed this listing using updated ACF structure
  const hasAlreadyReviewed = currentUser?.ccrreviews?.nodes?.some(
    review => review.reviewFields?.relatedListing?.nodes?.[0]?.databaseId === parseInt(listingId, 10)
  );

  const hasReviewed = !isEditMode && hasAlreadyReviewed;

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
  const handleStarHover = (val) => setHoverHoverRating(val);

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <button className="review-modal__close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="review-modal__title">
          {isEditMode ? "Edit Your Review" : "Leave a Review"}
        </h2>

        {hasReviewed ? (
          <div className="review-modal__error">
            You have already reviewed this listing. You can only post one review per business.
          </div>
        ) : (
          <form className="review-modal__form" onSubmit={handleSubmit}>
            <div className="review-modal__rating-container">
              <span className="review-modal__rating-label">Your Rating</span>
              <div className="review-modal__stars">
                {[1, 2, 3, 4, 5].map((val) => (
                  <span
                    key={val}
                    className={`material-symbols-outlined review-modal__star ${
                      (hoverRating || rating) >= val ? "review-modal__star--active" : ""
                    }`}
                    onMouseEnter={() => handleStarHover(val)}
                    onMouseLeave={() => handleStarHover(0)}
                    onClick={() => handleStarClick(val)}
                    style={{ fontVariationSettings: (hoverRating || rating) >= val ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>

            <div className="review-modal__form-group">
              <label className="review-modal__label" htmlFor="review-content">Your Review</label>
              <textarea
                id="review-content"
                className="review-modal__textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CHAR_COUNT}
                placeholder="Share your experience with this business..."
                disabled={isUpdating}
              />
              <div className={`review-modal__count ${content.length >= MAX_CHAR_COUNT ? "review-modal__count--error" : ""}`}>
                {content.length}/{MAX_CHAR_COUNT}
              </div>
            </div>

            {error && <div className="review-modal__error">{error}</div>}

            <button
              type="submit"
              className="review-modal__submit"
              disabled={isUpdating || content.length < 10 || rating === 0}
            >
              {isUpdating ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Your Review" : "Submit Your Review")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
