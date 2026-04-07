"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import "./SearchModal.css";

/**
 * SearchModal Component
 * A predictive search modal for the Cape Coral Directory.
 */
export default function SearchModal({ isOpen, onClose }) {
  // State management as requested
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({ listings: [], categories: [] });

  // Handle Escape key press to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // GraphQL Search Function
  const performSearch = useCallback(async (queryText) => {
    if (!queryText.trim()) {
      setSearchResults({ listings: [], categories: [] });
      return;
    }

    setIsLoading(true);

    const query = `
      query SearchQuery($searchTerm: String!) {
        ccrlistings(where: {search: $searchTerm}) {
          nodes {
            title
            slug
          }
        }
        ccrlistingcategories(where: {search: $searchTerm}) {
          nodes {
            name
            slug
          }
        }
      }
    `;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { searchTerm: queryText },
        }),
      });

      const json = await response.json();

      if (json.data) {
        setSearchResults({
          listings: json.data.ccrlistings?.nodes || [],
          categories: json.data.ccrlistingcategories?.nodes || [],
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced API Call (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        performSearch(searchTerm);
      } else {
        setSearchResults({ listings: [], categories: [] });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  if (!isOpen) return null;

  return (
    <div className={`search-modal ${isOpen ? "search-modal--open" : ""}`}>
      <div 
        className="search-modal__overlay" 
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
        role="button"
        tabIndex="-1"
        aria-label="Close modal"
      ></div>
      
      <div className="search-modal__container">
        <button className="search-modal__close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="search-modal__title">Search</h2>

        {/* Top Section: Directory Types */}
        <div className="search-modal__directory-types">
          <Link href="/directory/food-drink" className="search-modal__category-tab" onClick={onClose}>
            <span className="material-symbols-outlined search-modal__category-icon">local_bar</span>
            <span className="search-modal__category-text">Food & Drink</span>
          </Link>
          <Link href="/directory/health-wellness" className="search-modal__category-tab" onClick={onClose}>
            <span className="material-symbols-outlined search-modal__category-icon">directions_run</span>
            <span className="search-modal__category-text">Health & Wellness</span>
          </Link>
          <Link href="/directory/home-local-services" className="search-modal__category-tab" onClick={onClose}>
            <span className="material-symbols-outlined search-modal__category-icon">home</span>
            <span className="search-modal__category-text">Home & Local Services</span>
          </Link>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="search-modal__search-section">
          <div className="search-modal__input-wrapper">
            <input
              type="text"
              className="search-modal__input"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <button className="search-modal__submit-btn" onClick={() => performSearch(searchTerm)}>
            <span className="material-symbols-outlined">search</span>
            Search Listing
          </button>
        </div>

        {/* Bottom Section: Results Display */}
        <div className="search-modal__results">
          {isLoading ? (
            <div className="search-modal__loading">Searching...</div>
          ) : (
            <div className="search-modal__results-list">
              {/* Categories Results */}
              {searchResults.categories.map((cat) => (
                <div key={`cat-${cat.slug}`} className="search-modal__result-item">
                  <Link href={`/directory/${cat.slug}`} className="search-modal__result-link" onClick={onClose}>
                    <span className="search-modal__result-type">Category</span>
                    <span className="search-modal__result-title">{cat.name}</span>
                  </Link>
                </div>
              ))}

              {/* Listings Results */}
              {searchResults.listings.map((listing) => (
                <div key={`listing-${listing.slug}`} className="search-modal__result-item">
                  <Link href={`/directory/all/${listing.slug}`} className="search-modal__result-link" onClick={onClose}>
                    <span className="search-modal__result-type">Listing</span>
                    <span className="search-modal__result-title">{listing.title}</span>
                  </Link>
                </div>
              ))}

              {searchTerm && !isLoading && searchResults.listings.length === 0 && searchResults.categories.length === 0 && (
                <div className="search-modal__no-results">No results found for "{searchTerm}"</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
