// components/directory/ReviewList.js
"use client";

import { useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'isomorphic-dompurify';

export default function ReviewList({ reviews }) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [expandedReviews, setExpandedReviews] = useState({});

  const nodes = reviews?.nodes || [];

  if (!nodes || nodes.length === 0) {
    return (
      <div className="review-list review-list--empty">
        <p>No reviews yet. Be the first to leave one!</p>
      </div>
    );
  }

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const toggleExpand = (index) => {
    setExpandedReviews(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const WORD_LIMIT = 250;

  const truncateContent = (content, index) => {
    const words = content.split(' ');
    if (words.length <= WORD_LIMIT || expandedReviews[index]) {
      return content;
    }
    return words.slice(0, WORD_LIMIT).join(' ') + '...';
  };

  return (
    <section className="review-list">
      <h3 className="review-list__header">User Reviews ({nodes.length})</h3>
      
      <div className="review-list__container">
        {nodes.slice(0, visibleCount).map((review, index) => {
          // Sanitize the review content
          const cleanReviewContent = DOMPurify.sanitize(review.content || '', {
            ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'strong', 'em'],
            ALLOWED_ATTR: []
          });

          // Ensure star rating falls within 1-5, reading from ACF reviewFields
          const rating = Number.parseFloat(review.reviewFields?.starRating) || 0;
          const activeStars = '★'.repeat(Math.round(rating));
          const inactiveStars = '☆'.repeat(5 - Math.round(rating));
          
          const isLongReview = (review.content || '').split(' ').length > WORD_LIMIT;

          return (
            <article key={review.id || index} className="review-list__item">
              <header className="review-list__item-header">
                <div className="review-list__author-meta">
                  <div className="review-list__avatar">
                    <span className="material-symbols-outlined">account_circle</span>
                  </div>
                  <div className="review-list__author-info">
                    <h4 className="review-list__author-name">{review.author?.node?.name || review.title || 'Anonymous'}</h4>
                    <time className="review-list__date">
                      {review.date ? new Date(review.date).toLocaleDateString() : 'Recently'}
                    </time>
                  </div>
                </div>
                
                <div className="review-list__stars" aria-label={`Rated ${rating} out of 5 stars`}>
                  <span className="review-list__stars--active">{activeStars}</span>
                  <span className="review-list__stars--inactive">{inactiveStars}</span>
                </div>
              </header>

              <div className="review-list__body">
                <div 
                  className="review-list__content"
                  dangerouslySetInnerHTML={{ __html: truncateContent(cleanReviewContent, index) }} 
                />
                {isLongReview && (
                  <button 
                    className="review-list__read-more" 
                    onClick={() => toggleExpand(index)}
                  >
                    {expandedReviews[index] ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {visibleCount < nodes.length && (
        <div className="review-list__pagination">
          <button className="review-list__load-more" onClick={handleShowMore}>
            Load More Reviews
          </button>
        </div>
      )}
    </section>
  );
}

ReviewList.propTypes = {
  reviews: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object),
  }),
};
