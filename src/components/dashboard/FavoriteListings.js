// src/components/dashboard/FavoriteListings.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { removeFavoriteListing } from '@/lib/actions';

export default function FavoriteListings({ favorites: initialFavorites = [] }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [removingId, setRemovingId] = useState(null);

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorite-listings__empty">
        <p className="favorite-listings__text">You haven't saved any favorite listings yet.</p>
        <Link href="/directory" className="favorite-listings__link">
          Browse Directory
        </Link>
      </div>
    );
  }

  const handleRemove = async (id, databaseId) => {
    setRemovingId(id);
    const result = await removeFavoriteListing(databaseId);

    if (result.success) {
      setFavorites(favorites.filter((listing) => listing.id !== id));
    } else {
      alert(result.error || 'Failed to remove listing from favorites.');
    }
    setRemovingId(null);
  };

  return (
    <div className="favorite-listings">
      <div className="favorite-listings__grid">
        {favorites.map((listing) => {
          const categorySlug = listing.directoryTypes?.nodes[0]?.slug || 'uncategorized';
          const imageUrl = listing.featuredImage?.node?.sourceUrl || '/placeholder-listing.jpg';

          return (
            <article key={listing.id} className="favorite-card">
              <div className="favorite-card__image-container">
                <Image
                  src={imageUrl}
                  alt={listing.title}
                  fill
                  className="favorite-card__image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="favorite-card__content">
                <h3 className="favorite-card__title">{listing.title}</h3>
                <div className="favorite-card__actions">
                  <Link 
                    href={`/directory/${categorySlug}/${listing.slug}`}
                    className="favorite-card__view-link"
                  >
                    View Listing
                  </Link>
                  <button
                    onClick={() => handleRemove(listing.id, listing.databaseId)}
                    className="favorite-card__remove-btn"
                    disabled={removingId === listing.id}
                    aria-label={`Remove ${listing.title} from favorites`}
                  >
                    {removingId === listing.id ? 'Removing...' : '🗑️ Remove'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
