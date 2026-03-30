"use client";

import { useState } from 'react';
import { toggleFavoriteListing } from '@/lib/actions';

export default function FavoriteButton({ listingId, initialIsFavorite = false, currentUser }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggle = async () => {
    if (!currentUser) {
      setToastMessage("Please log in to favorite.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const newState = !isFavorite;
    setIsFavorite(newState); // Optimistic instant update

    // Trigger Toast
    setToastMessage(newState ? "Added to favorites!" : "Removed from favorites");
    setTimeout(() => setToastMessage(null), 3000);

    try {
      // In a real scenario, you'd calculate the new favorites array here
      // For now, using the logic from your actions.js or similar
      // await toggleFavoriteListing(currentUser.databaseId, updatedArray);
    } catch (error) {
      setIsFavorite(!newState); // Revert if the server fails
      setToastMessage("Error saving favorite.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button className="listing-action-btn" onClick={handleToggle}>
        <span 
          className="material-symbols-outlined" 
          style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
        >
          favorite
        </span>
        <span className="listing-action-btn__text">Favorite</span>
      </button>

      {toastMessage && (
        <div style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', whiteSpace: 'nowrap', zIndex: 50, pointerEvents: 'none' }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
