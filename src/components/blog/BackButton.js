"use client";

import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';

export default function BackButton({ label = "Go Back", fallback }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      if (fallback) {
        const isExternal = !document.referrer.includes(window.location.host);
        // If they came from an external site and haven't built up history in this tab
        if (isExternal && window.history.length <= 2) {
          router.push(fallback);
        } else {
          router.back();
        }
      } else {
        router.back();
      }
    }
  };

  return (
    <div className="blog-post__back-wrapper">
      <button onClick={handleBack} className="listing-action-btn">
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="listing-action-btn__text">{label}</span>
      </button>
    </div>
  );
}

BackButton.propTypes = {
  label: PropTypes.string,
};
