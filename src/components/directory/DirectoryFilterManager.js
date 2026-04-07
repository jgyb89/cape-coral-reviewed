import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import CcrCardGrid from "./CcrCardGrid";
import "./DirectoryFilterManager.css";

const getListingRating = (listing) => {
  const reviews = listing.reviews?.nodes || [];
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce(
    (acc, curr) => acc + (parseFloat(curr.reviewFields?.starRating) || 0),
    0
  );
  return sum / reviews.length;
};

export default function DirectoryFilterManager({ listings, currentUser }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePrice, setActivePrice] = useState("All");
  const [sortBy, setSortBy] = useState("A-Z");

  // Extract unique categories from listings
  const categories = useMemo(() => {
    const allCats = listings.flatMap((listing) =>
      listing.directoryTypes?.nodes?.map((node) => node.name) || []
    );
    return ["All", ...new Set(allCats)].sort();
  }, [listings]);

  const priceRanges = ["All", "$", "$$", "$$$", "$$$$"];

  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((listing) =>
        listing.directoryTypes?.nodes?.some(
          (node) => node.name === activeCategory
        )
      );
    }

    // Filter by price
    if (activePrice !== "All") {
      result = result.filter(
        (listing) => listing.listingdata?.priceRange === activePrice
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Z-A":
          return b.title.localeCompare(a.title);
        case "Highest Rated":
          return getListingRating(b) - getListingRating(a);
        case "Newest":
          return new Date(b.date) - new Date(a.date);
        default:
          return 0;
      }
    });

    return result;
  }, [listings, activeCategory, activePrice, sortBy]);

  const handleClearFilters = () => {
    setActiveCategory("All");
    setActivePrice("All");
    setSortBy("A-Z");
  };

  return (
    <div className="directory-filter-manager">
      <div className="directory-controls">
        <div className="control-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="price-filter">Price</label>
          <select
            id="price-filter"
            value={activePrice}
            onChange={(e) => setActivePrice(e.target.value)}
          >
            {priceRanges.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-by">Sort By</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="Highest Rated">Highest Rated</option>
            <option value="Newest">Newest</option>
          </select>
        </div>

        {(activeCategory !== "All" || activePrice !== "All" || sortBy !== "A-Z") && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="results-count">
        {filteredAndSortedListings.length}{" "}
        {filteredAndSortedListings.length === 1 ? "listing" : "listings"} found
      </div>

      <CcrCardGrid listings={filteredAndSortedListings} currentUser={currentUser} />
    </div>
  );
}

DirectoryFilterManager.propTypes = {
  listings: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};
