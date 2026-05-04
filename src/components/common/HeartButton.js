'use client';

import { useState } from 'react';
import styles from './HeartButton.module.css';

export default function HeartButton({ initialLiked = false, onToggle }) {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    e.stopPropagation(); // Prevent triggering parent card clicks

    const newState = !isLiked;
    setIsLiked(newState);

    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button 
      type="button" 
      className={`${styles['heart-btn']} ${isLiked ? styles.active : ''}`}
      onClick={handleClick}
      aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={`material-symbols-outlined ${styles['heart-icon']}`}>
        favorite
      </span>
    </button>
  );
}
