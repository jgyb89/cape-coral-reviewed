// src/components/directory/CcrCard.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./CcrCard.css";
import { toggleFavoriteListing } from '@/lib/actions';

export default function CcrCard({ listing, currentUser }) {
  // Initialize state based on whether the listing ID exists in currentUser's favorites
  const initialFavoriteState = currentUser?.userData?.favoriteListings?.nodes?.some(
    node => node.databaseId === listing.databaseId
  ) || false;

  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!listing) return null;

  const { title, slug, featuredImage } = listing;
  const listingdata = listing.listingdata || {};

  // Extract category slug or fallback using the updated ACF taxonomy name
  const categorySlug =
    listing?.directoryTypes?.nodes?.[0]?.slug || "uncategorized";
  const listingUrl = `/directory/${categorySlug}/${slug}`;

  // Image handling
  const imageUrl = featuredImage?.node?.sourceUrl || "/placeholder-image.jpg";
  const imageAlt = featuredImage?.node?.altText || title;

  // Rating calculation from the new ACF structure
  const reviewNodes = listing.reviews?.nodes || [];
  const reviewCount = reviewNodes.length;
  const averageRating = reviewCount > 0 
    ? (reviewNodes.reduce((acc, curr) => acc + (parseFloat(curr.reviewFields?.starRating) || 0), 0) / reviewCount).toFixed(1)
    : "0.0";

  return (
    <div className="ccr-card">
      <div className="ccr-card__image-container">
        <div className="ccr-card__badge">Featured</div>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="ccr-card__avatar">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "44px", color: "#ccc" }}
          >
            storefront
          </span>
        </div>
      </div>

      <div className="ccr-card__content">
        <Link href={listingUrl} className="ccr-card__header-link">
          <h3 className="ccr-card__title">{title}</h3>
        </Link>

        <div className="ccr-card__rating">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px", color: "var(--color-secondary)" }}
          >
            star
          </span>
          <span style={{ fontWeight: "600" }}>{averageRating}</span>
          <span style={{ color: "#666", fontSize: "0.8rem" }}>
            ({reviewCount} reviews)
          </span>
        </div>

        <div className="ccr-card__footer">
          <div className="ccr-card__footer-item">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              location_on
            </span>
            {listingdata.addressCity || "Cape Coral"}, FL
          </div>

          <button
            className="ccr-card__favorite"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={isUpdating}
            style={{ opacity: isUpdating ? 0.6 : 1, position: 'relative', zIndex: 10 }}
            onClick={async (e) => {
              e.preventDefault();
              
              if (!listing.databaseId) {
                alert("Listing data is incomplete.");
                return;
              }
              
              if (!currentUser) {
                alert("Please log in to save favorites.");
                return;
              }
              
              setIsUpdating(true);
              
              // Optimistic UI update
              const newFavoriteState = !isFavorite;
              setIsFavorite(newFavoriteState);

              // Calculate new array
              const currentFavIds = currentUser.userData?.favoriteListings?.nodes?.map(node => node.databaseId).filter(Boolean) || [];
              const listingId = listing.databaseId;
              
              let updatedArray;
              if (newFavoriteState) {
                updatedArray = [...currentFavIds, listingId];
              } else {
                updatedArray = currentFavIds.filter(id => id !== listingId);
              }

              // Fire Server Action
              const result = await toggleFavoriteListing(currentUser.id, updatedArray);
              
              // Revert UI if server fails
              if (!result.success) {
                setIsFavorite(!newFavoriteState);
                console.error(result.message);
              }
              
              setIsUpdating(false);
            }}
          >
            <span 
              className="material-symbols-outlined"
              style={{ 
                color: isFavorite ? 'var(--color-primary, red)' : 'inherit',
                fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0"
              }}
            >
              {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
