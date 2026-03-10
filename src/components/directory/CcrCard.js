// src/components/directory/CcrCard.js
import Image from "next/image";
import Link from "next/link";
import "./CcrCard.css";

export default function CcrCard({ listing }) {
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
            aria-label="Add to favorites"
            onClick={(e) => {
              e.preventDefault();
              // Favorite logic here
            }}
          >
            <span className="material-symbols-outlined">favorite_border</span>
          </button>
        </div>
      </div>
    </div>
  );
}
