// components/directory/ReviewList.js
import DOMPurify from 'isomorphic-dompurify';

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list review-list--empty">
        <p>No reviews yet. Be the first to leave one!</p>
      </div>
    );
  }

  return (
    <section className="review-list">
      <h3 className="review-list__header">User Reviews ({reviews.length})</h3>
      
      <div className="review-list__container">
        {reviews.map((review, index) => {
          // Sanitize the review content to prevent XSS from user submissions
          const cleanReviewContent = DOMPurify.sanitize(review.content || '', {
            ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'strong', 'em'],
            ALLOWED_ATTR: []
          });

          // Ensure star rating falls within 1-5
          const rating = review.starRating || 0;
          const activeStars = '★'.repeat(Math.round(rating));
          const inactiveStars = '☆'.repeat(5 - Math.round(rating));

          return (
            <article key={index} className="review-list__item">
              <header className="review-list__item-header">
                {/* Fallback to 'Anonymous' if no title is provided */}
                <h4 className="review-list__author">{review.title || 'Anonymous'}</h4>
                
                <div className="review-list__stars" aria-label={`Rated ${rating} out of 5 stars`}>
                  <span className="review-list__stars--active">{activeStars}</span>
                  <span className="review-list__stars--inactive">{inactiveStars}</span>
                </div>
              </header>

              <div 
                className="review-list__body"
                dangerouslySetInnerHTML={{ __html: cleanReviewContent }} 
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
