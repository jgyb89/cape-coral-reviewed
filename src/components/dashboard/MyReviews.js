// src/components/dashboard/MyReviews.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteUserReview } from '@/lib/actions';

export default function MyReviews({ reviews: initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setDeletingId(reviewId);
    const result = await deleteUserReview(reviewId);

    if (result.success) {
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } else {
      alert(result.error || 'Failed to delete review.');
    }
    setDeletingId(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="my-reviews__empty">
        <p className="my-reviews__text">You haven't left any reviews yet.</p>
        <Link href="/directory" className="my-reviews__link">
          Explore the Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="my-reviews">
      <ul className="my-reviews__list">
        {reviews.map((review) => {
          const listing = review.relatedListing?.node;
          const categorySlug = listing?.ccrdirectorytypes?.nodes[0]?.slug || 'uncategorized';
          const listingUrl = listing ? `/directory/${categorySlug}/${listing.slug}` : '#';

          return (
            <li key={review.id} className="user-review">
              <div className="user-review__header">
                <h3 className="user-review__title">{review.title}</h3>
                <div className="user-review__stars" aria-label={`${review.starRating} out of 5 stars`}>
                  {'★'.repeat(review.starRating)}{'☆'.repeat(5 - review.starRating)}
                </div>
              </div>

              {listing && (
                <p className="user-review__listing">
                  Review for: <Link href={listingUrl} className="user-review__listing-link">{listing.title}</Link>
                </p>
              )}

              <div 
                className="user-review__content" 
                dangerouslySetInnerHTML={{ __html: review.content }} 
              />

              <div className="user-review__actions">
                <button
                  onClick={() => handleDelete(review.id)}
                  className="user-review__delete-btn"
                  disabled={deletingId === review.id}
                >
                  {deletingId === review.id ? 'Deleting...' : 'Delete Review'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
