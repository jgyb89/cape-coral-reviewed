// src/components/directory/CcrCard.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./CcrCard.css";
import { toggleFavoriteListing } from '@/lib/actions';

export default function CcrCard({ listing, currentUser }) {
  // Initialize state based on whether the listing ID exists in currentUser's favorites
  // Field name from WPGraphQL is 'favoritelistings' (no underscore)
  const initialFavoriteState = currentUser?.favoritelistings?.nodes?.some(
    node => node.databaseId === listing.databaseId
  ) || false;

  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!listing) return null;

  const { title, slug, featuredImage } = listing;

  // Extract category slug or fallback
  const categorySlug =
    listing?.ccrdirectorytypes?.nodes?.[0]?.slug || "uncategorized";
  const listingUrl = `/directory/${categorySlug}/${slug}`;

  // Image handling
  const imageUrl = featuredImage?.node?.sourceUrl || "/placeholder-image.jpg";
  const imageAlt = featuredImage?.node?.altText || title;

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
        {/* Clickable Area Restricted to Header Link */}
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
          <span style={{ fontWeight: "600" }}>4.5</span>
          <span style={{ color: "#666", fontSize: "0.8rem" }}>
            (12 reviews)
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
            Cape Coral, FL
          </div>

          <button
            className="ccr-card__favorite"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={isUpdating}
            style={{ opacity: isUpdating ? 0.6 : 1, position: 'relative', zIndex: 10 }}
            onClick={async (e) => {
              e.preventDefault();
              console.log('Heart clicked! Listing ID is:', listing.databaseId); 

              if (!listing.databaseId) {
                alert("Cache still hasn't cleared! databaseId is missing.");
                return;
              }

              console.log("Heart clicked! Current User Data:", currentUser);
              
              if (!currentUser) {
                alert("Please log in to save favorites.");
                return;
              }
              
              setIsUpdating(true);
              
              // Optimistic UI update
              const newFavoriteState = !isFavorite;
              setIsFavorite(newFavoriteState);

              // Calculate new array
              // Use 'favoritelistings' property from getViewer
              const currentFavIds = currentUser.favoritelistings?.nodes?.map(node => node.databaseId).filter(Boolean) || [];
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
                color: isFavorite ? 'var(--color-primary)' : '#666',
                fontVariationSettings: isFavorite ? '"FILL" 1' : '"FILL" 0'
              }}
            >
              favorite
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
