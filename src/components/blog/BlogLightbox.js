"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import styles from "./BlogLightbox.module.css";

export default function BlogLightbox({ children }) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Click delegation to handle clicks on any image within the article
  const handleClick = (e) => {
    const target = e.target;
    // Find closest <img> or image wrapper
    const img =
      target.tagName === "IMG"
        ? target
        : target.closest?.(".blog-post__image-container")?.querySelector("img") ||
          target.closest?.("figure")?.querySelector("img");

    if (!img) return;

    // Ignore ad banners, comment avatars, or icon images
    if (
      img.closest(".adsbygoogle") ||
      img.closest("[data-ad-status]") ||
      img.closest(".blog-comments") ||
      img.classList.contains("icon")
    ) {
      return;
    }

    if (!containerRef.current) return;

    // Query all valid article content and featured images
    const allImgs = Array.from(
      containerRef.current.querySelectorAll("img")
    ).filter((el) => {
      return (
        el.src &&
        !el.closest(".adsbygoogle") &&
        !el.closest("[data-ad-status]") &&
        !el.closest(".blog-comments") &&
        !el.classList.contains("icon")
      );
    });

    const srcList = allImgs
      .map((el) => el.currentSrc || el.src)
      .filter((src, idx, arr) => arr.indexOf(src) === idx);

    const clickedSrc = img.currentSrc || img.src;
    let idx = srcList.indexOf(clickedSrc);
    if (idx === -1) {
      idx = 0;
      srcList.unshift(clickedSrc);
    }

    setImages(srcList);
    setCurrentIndex(idx);
    setIsOpen(true);
  };

  const goToNext = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setCurrentIndex((prev) => (prev + 1) % images.length);
    },
    [images.length]
  );

  const goToPrev = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    },
    [images.length]
  );

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, goToNext, goToPrev, closeLightbox]);

  return (
    <div ref={containerRef} onClick={handleClick}>
      {children}

      {isOpen && images.length > 0 && (
        <div
          className={styles["lightbox-overlay"]}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          tabIndex={-1}
        >
          <button
            type="button"
            className={styles["lightbox-close"]}
            onClick={closeLightbox}
            aria-label="Close image"
          >
            &times;
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles["lightbox-arrow"]} ${styles["lightbox-arrow--left"]}`}
                onClick={goToPrev}
                aria-label="Previous image"
              >
                &#10094;
              </button>

              <button
                type="button"
                className={`${styles["lightbox-arrow"]} ${styles["lightbox-arrow--right"]}`}
                onClick={goToNext}
                aria-label="Next image"
              >
                &#10095;
              </button>
            </>
          )}

          <div className={styles["lightbox-content"]}>
            <Image
              src={images[currentIndex]}
              alt={`Full screen blog image ${currentIndex + 1}`}
              fill
              style={{ objectFit: "contain" }}
              priority
              unoptimized
              sizes="95vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}

BlogLightbox.propTypes = {
  children: PropTypes.node.isRequired,
};
