// src/components/directory/CcrCard.js
"use client";

import { useState } from "react";
import PropTypes from "prop-types";
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
  const [toastMessage, setToastMessage] = useState("");

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
    ? (reviewNodes.reduce((acc, curr) => acc + (Number.parseFloat(curr.reviewFields?.starRating) || 0), 0) / reviewCount).toFixed(1)
    : "0.0";

  return (
    <div className="ccr-card" style={{ position: 'relative', zIndex: toastMessage ? 50 : 1 }}>
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

          <div style={{ position: 'relative', display: 'inline-block' }}>
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
                setToastMessage(newFavoriteState ? "Added to favorite" : "Removed from favorite");
                setTimeout(() => setToastMessage(""), 3000);

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
            {toastMessage && (
              <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', backgroundColor: '#000', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap', zIndex: 50 }}>
                {toastMessage}
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: '5px', borderStyle: 'solid', borderColor: '#000 transparent transparent transparent' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CcrCard.propTypes = {
  listing: PropTypes.shape({
    databaseId: PropTypes.number,
    title: PropTypes.string,
    slug: PropTypes.string,
    featuredImage: PropTypes.shape({
      node: PropTypes.shape({
        sourceUrl: PropTypes.string,
        altText: PropTypes.string,
      }),
    }),
    listingdata: PropTypes.object,
    directoryTypes: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          slug: PropTypes.string,
        })
      ),
    }),
    reviews: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          reviewFields: PropTypes.shape({
            starRating: PropTypes.string,
          }),
        })
      ),
    }),
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    userData: PropTypes.shape({
      favoriteListings: PropTypes.shape({
        nodes: PropTypes.arrayOf(
          PropTypes.shape({
            databaseId: PropTypes.number,
          })
        ),
      }),
    }),
  }),
};
