// src/components/directory/CcrCard.js
import Image from 'next/image';
import Link from 'next/link';
import './CcrCard.css';

export default function CcrCard({ listing }) {
  if (!listing) return null;

  const { title, slug, featuredImage } = listing;
  
  // Extract category slug or fallback
  const categorySlug = listing?.ccrdirectorytypes?.nodes?.[0]?.slug || 'uncategorized';
  const listingUrl = `/directory/${categorySlug}/${slug}`;

  // Image handling
  const imageUrl = featuredImage?.node?.sourceUrl || '/placeholder-image.jpg'; // Ensure a fallback exists in public folder
  const imageAlt = featuredImage?.node?.altText || title;

  return (
    <div className="ccr-card">
      <div className="ccr-card__image-container">
        <Image 
          src={imageUrl} 
          alt={imageAlt} 
          fill 
          style={{ objectFit: 'cover' }} 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <Link href={listingUrl} className="ccr-card__header">
        <h3 className="ccr-card__title">{title}</h3>
      </Link>

      <div className="ccr-card__meta">
        <div className="ccr-card__rating">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>
            star
          </span>
          <span style={{ marginLeft: '4px', fontWeight: '600' }}>4.5</span>
        </div>
        
        <button className="ccr-card__favorite-toggle" aria-label="Add to favorites">
          <span className="material-symbols-outlined">
            favorite_border
          </span>
        </button>
      </div>
    </div>
  );
}
