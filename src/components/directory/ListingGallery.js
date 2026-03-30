"use client";

import { useState } from "react";
import Image from "next/image";
import "./ListingGallery.css";

export default function ListingGallery({ featuredImage, galleryImages = [] }) {
  const images = [featuredImage, ...galleryImages].filter(Boolean);
  
  // Fallback if no images
  const displayImages = images.length > 0 ? images : ["/placeholder-image.jpg"];
  const [activeImage, setActiveImage] = useState(displayImages[0]);

  return (
    <div className="listing-gallery">
      <div className="listing-gallery__main">
        <Image
          src={activeImage}
          alt="Listing gallery image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {displayImages.length > 1 && (
        <div className="listing-gallery__thumbnails">
          {displayImages.map((img, index) => (
            <button
              key={index}
              className={`listing-gallery__thumbnail ${
                activeImage === img ? "listing-gallery__thumbnail--active" : ""
              }`}
              onClick={() => setActiveImage(img)}
              type="button"
            >
              <Image
                src={img}
                alt={`Gallery thumbnail ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
