"use client";

import { useState } from "react";
import { deleteUserListing } from "@/lib/actions";

export default function DeleteListingButton({ listingId }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const result = await deleteUserListing(listingId);
        if (result.success) {
          // Revalidation handled by Server Action
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        alert(`An error occurred: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="delete-listing-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#dc2626',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s ease',
        fontSize: '0.9rem'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
      onFocus={(e) => e.target.style.backgroundColor = '#b91c1c'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
      onBlur={(e) => e.target.style.backgroundColor = '#dc2626'}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span>
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
