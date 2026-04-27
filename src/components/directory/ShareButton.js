"use client";

import React, { useState } from "react";

/**
 * A mobile-optimized share button that triggers the native OS share sheet
 * or falls back to copying the link to the clipboard.
 */
export default function ShareButton({ title, text }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        // Silently catch AbortError if user cancels the share sheet
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  return (
    <button className="listing-action-btn" onClick={handleShare}>
      <span className="material-symbols-outlined">
        {isCopied ? "check" : "share"}
      </span>
      <span className="listing-action-btn__text">
        {isCopied ? "Link Copied!" : "Share"}
      </span>
    </button>
  );
}
