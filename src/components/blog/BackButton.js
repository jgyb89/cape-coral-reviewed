"use client";

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="blog-post__back-wrapper">
      <button onClick={() => router.back()} className="blog-post__back-button">
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="listing-action-btn__text">Go Back</span>
      </button>
    </div>
  );
}
