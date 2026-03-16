"use client";

import { useState, useEffect } from "react";
import { updateUserReview } from "@/lib/actions";
import "../directory/ReviewModal.css"; // Reuse the same CSS for consistency or create a new one if preferred

export default function EditReviewModal({ review, isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (review) {
      // Reading from the new ACF reviewFields wrapper
      setRating(review.reviewFields?.starRating || 0);
      // Strip HTML if necessary
      const cleanContent = review.content ? review.content.replace(/<[^>]*>?/gm, '') : "";
      setContent(cleanContent);
    }
  }, [review, isOpen]);

  if (!isOpen || !review) return null;

  const MAX_CHAR_COUNT = 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const formData = {
      rating,
      content,
    };

    const result = await updateUserReview(review.id, formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Failed to update review.");
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

        <h2 className="review-modal__title">Edit Your Review</h2>

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
            <label className="review-modal__label" htmlFor="edit-review-content">Your Review</label>
            <textarea
              id="edit-review-content"
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
            {isUpdating ? "Updating..." : "Update Your Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
