'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteUserReview } from '@/lib/actions';
import ReviewModal from '../directory/ReviewModal';
import './MyReviews.css';

export default function MyReviews({ reviews: initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [editingReview, setEditingReview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Custom Delete Modal State
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete || isDeleting) return;

    setIsDeleting(true);
    
    // Optimistic UI update
    const previousReviews = [...reviews];
    const reviewId = reviewToDelete.id;
    setReviews(reviews.filter((review) => review.id !== reviewId));

    const result = await deleteUserReview(reviewId);

    if (result.success) {
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    } else {
      alert(result.error || 'Failed to delete review.');
      setReviews(previousReviews);
    }
    
    setIsDeleting(false);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingReview(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="my-reviews">
        <div className="my-reviews__empty">
          <p className="my-reviews__text">You haven't left any reviews yet.</p>
          <Link href="/directory" className="my-reviews__link">
            Explore the Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reviews">
      <ul className="my-reviews__list">
        {reviews.map((review) => {
          const listing = review.reviewFields?.relatedListing?.nodes?.[0];
          const categorySlug = listing?.ccrDirectoryTypes?.nodes[0]?.slug || 'uncategorized';
          const listingUrl = listing ? `/directory/${categorySlug}/${listing.slug}` : '#';
          const formattedDate = review.date ? new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : '';

          const starRating = parseInt(review.reviewFields?.starRating, 10) || 0;

          return (
            <li key={review.id} className="user-review">
              <div className="user-review__header">
                <div className="user-review__info">
                  {listing && (
                    <p className="user-review__listing">
                      Review for: <Link href={listingUrl} className="user-review__listing-link">{listing.title}</Link>
                    </p>
                  )}
                  {formattedDate && <span className="user-review__date">{formattedDate}</span>}
                </div>
                <div className="user-review__stars" aria-label={`${starRating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <span
                      key={val}
                      className="material-symbols-outlined user-review__star"
                      style={{ 
                        fontVariationSettings: starRating >= val ? "'FILL' 1" : "'FILL' 0",
                        color: starRating >= val ? "var(--color-secondary)" : "#ccc"
                      }}
                    >
                      {starRating >= val ? "star" : "star_outline"}
                    </span>
                  ))}
                </div>
              </div>

              <div 
                className="user-review__content" 
                dangerouslySetInnerHTML={{ __html: review.content }} 
              />

              <div className="user-review__actions">
                <button
                  onClick={() => handleEdit(review)}
                  className="user-review__edit-btn"
                  disabled={isDeleting}
                >
                  <span className="material-symbols-outlined">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(review)}
                  className="user-review__delete-btn"
                  disabled={isDeleting}
                >
                  <span className="material-symbols-outlined">delete</span>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Edit Review Modal */}
      <ReviewModal
        review={editingReview}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="my-reviews__modal-overlay" onClick={handleCancelDelete}>
          <div className="my-reviews__modal" onClick={(e) => e.stopPropagation()}>
            <div className="my-reviews__modal-icon">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h3 className="my-reviews__modal-title">Delete Review?</h3>
            <p className="my-reviews__modal-text">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="my-reviews__modal-actions">
              <button 
                className="my-reviews__modal-btn my-reviews__modal-btn--cancel" 
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="my-reviews__modal-btn my-reviews__modal-btn--delete" 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
