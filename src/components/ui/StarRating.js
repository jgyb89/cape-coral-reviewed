import React from 'react';

export default function StarRating({ rating }) {
  const numRating = Number.parseFloat(rating) || 0;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="star-rating" style={{ display: 'inline-flex', color: '#f59e0b', fontSize: '1.1rem' }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
      {hasHalfStar && <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="material-symbols-outlined">star</span>
      ))}
    </div>
  );
}
