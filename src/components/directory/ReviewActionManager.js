// src/components/directory/ReviewActionManager.js
"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import LoginModal from "@/components/auth/LoginModal";
import ReviewModal from "./ReviewModal";

export default function ReviewActionManager({ currentUser, listingId, listingSlug, dict = {}, locale = "en" }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleWriteReviewClick = () => {
    if (currentUser) {
      setIsReviewModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const t = dict?.listing || {};

  return (
    <>
      <button 
        className="listing-primary-btn" 
        onClick={handleWriteReviewClick}
      >
        <span className="material-symbols-outlined">rate_review</span>
        {t.writeReview || "Write a Review"}
      </button>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        dict={dict}
        locale={locale}
      />

      <ReviewModal 
        listingId={listingId}
        listingSlug={listingSlug}
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        currentUser={currentUser}
      />
    </>
  );
}

ReviewActionManager.propTypes = {
  currentUser: PropTypes.object,
  listingId: PropTypes.number,
  listingSlug: PropTypes.string,
  dict: PropTypes.object,
  locale: PropTypes.string,
};
