"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { toggleFavoriteListing } from "@/lib/actions";

export default function FavoriteButton({ listingId, currentUser }) {
  // Determine initial state by checking currentUser's favorites
  const initialIsFavorite =
    currentUser?.userData?.favoriteListings?.nodes?.some(
      (node) => node.databaseId === listingId
    ) || false;

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleToggleFavorite = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please log in to save favorites.");
      return;
    }

    if (!listingId) {
      console.error("Listing ID is missing");
      return;
    }

    setIsUpdating(true);

    // Optimistic UI update
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    setToastMessage(newFavoriteState ? "Added to favorite" : "Removed from favorite");
    setTimeout(() => setToastMessage(""), 3000);

    // Calculate the updated array of favorite IDs
    const currentFavIds =
      currentUser.userData?.favoriteListings?.nodes
        ?.map((node) => node.databaseId)
        .filter(Boolean) || [];

    let updatedArray;
    if (newFavoriteState) {
      // Add if not already present
      updatedArray = currentFavIds.includes(listingId)
        ? currentFavIds
        : [...currentFavIds, listingId];
    } else {
      // Remove if present
      updatedArray = currentFavIds.filter((id) => id !== listingId);
    }

    try {
      const result = await toggleFavoriteListing(currentUser.id, updatedArray);

      if (!result.success) {
        // Revert UI if the server action fails
        setIsFavorite(!newFavoriteState);
        console.error(result.message || "Failed to update favorites");
      }
    } catch (error) {
      setIsFavorite(!newFavoriteState);
      console.error("Error toggling favorite:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const activeStyle = isFavorite
    ? {
        backgroundColor: "var(--color-primary, #e04a3d)",
        color: "#ffffff",
        borderColor: "var(--color-primary, #e04a3d)",
      }
    : {};

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn-secondary"
        onClick={handleToggleFavorite}
        disabled={isUpdating}
        style={{
          ...activeStyle,
          opacity: isUpdating ? 0.7 : 1,
          cursor: isUpdating ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {isFavorite ? "favorite" : "favorite_border"}
        </span>
        {isFavorite ? "Favorited" : "Favorite"}
      </button>
      {toastMessage && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', backgroundColor: '#000', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap', zIndex: 50 }}>
          {toastMessage}
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: '5px', borderStyle: 'solid', borderColor: '#000 transparent transparent transparent' }} />
        </div>
      )}
    </div>
  );
}

FavoriteButton.propTypes = {
  listingId: PropTypes.number.isRequired,
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
