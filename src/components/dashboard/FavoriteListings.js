// src/components/dashboard/FavoriteListings.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { removeFavoriteListing } from '@/lib/actions';

export default function FavoriteListings({ favorites: initialFavorites = [] }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [isRemoving, setIsRemoving] = useState(null);
  const [listingToDelete, setListingToDelete] = useState(null);

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

  const handleRemove = async (databaseId) => {
    setIsRemoving(databaseId);
    const result = await removeFavoriteListing(databaseId);

    if (result.success) {
      setFavorites(favorites.filter((listing) => listing.databaseId !== databaseId));
    } else {
      alert(result.error || 'Failed to remove listing from favorites.');
    }
    setIsRemoving(null);
  };

  return (
    <div className="favorite-listings">
      <div className="favorite-listings__grid">
        {favorites.map((listing) => {
          const categorySlug = listing.directoryTypes?.nodes[0]?.slug || 'uncategorized';
          const imageUrl = listing.featuredImage?.node?.sourceUrl || '/placeholder-listing.jpg';
          const listingUrl = `/directory/${categorySlug}/${listing.slug}`;

          return (
            <article key={listing.databaseId} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', border: '1px solid #eaeaea', marginBottom: '1rem' }}>
              
              {/* Top Row: Image and Info */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: '120px', height: '80px', position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
                  <Image
                    src={imageUrl}
                    alt={listing.title}
                    fill
                    sizes="120px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>{listing.title}</h4>
                  <Link href={listingUrl} style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
                    View Listing
                  </Link>
                </div>
              </div>

              {/* Divider */}
              <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '1rem 0' }} />

              {/* Bottom Row: Actions */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setListingToDelete(listing)}
                  disabled={isRemoving === listing.databaseId}
                  style={{ backgroundColor: '#fff0f0', color: '#e04a3d', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, fontSize: '0.9rem', opacity: isRemoving === listing.databaseId ? 0.5 : 1 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span>
                  {isRemoving === listing.databaseId ? 'Removing...' : 'Delete'}
                </button>
              </div>

            </article>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {listingToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#e04a3d', marginBottom: '1rem' }}>warning</span>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#333' }}>Remove Favorite?</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Are you sure you want to remove <strong>{listingToDelete.title}</strong> from your favorites?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setListingToDelete(null)}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 600, color: '#333' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRemove(listingToDelete.databaseId);
                  setListingToDelete(null);
                }}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#e04a3d', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
