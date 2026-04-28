"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PropTypes from "prop-types";
import CcrCardGrid from "./CcrCardGrid";
import DirectoryFilters from "./DirectoryFilters";
import styles from "./DirectoryFilterManager.module.css";
import { checkIfOpenNow } from '@/lib/timeUtils';

const getListingRating = (listing) => {
  const reviews = listing.reviews?.nodes || [];
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce(
    (acc, curr) => acc + (Number.parseFloat(curr.reviewFields?.starRating) || 0),
    0
  );
  return sum / reviews.length;
};

export default function DirectoryFilterManager({ listings, currentUser, dict = {}, locale = "en" }) {
  const searchParams = useSearchParams();
  const t = dict?.directory || {};

  // Current Filters from URL
  const categoryFilter = searchParams.get('category') || '';
  const ratingFilter = Number.parseInt(searchParams.get('rating')) || 0;
  const openNowFilter = searchParams.get('open') === 'true';
  const sortByFilter = searchParams.get('sort') || 'newest';

  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];

    // Filter by In-Page Category
    if (categoryFilter) {
      result = result.filter((listing) => 
        listing.directoryTypes?.nodes?.some(node => node.name.toLowerCase().includes(categoryFilter.toLowerCase()))
      );
    }

    // Filter by Rating
    if (ratingFilter > 0) {
      result = result.filter((listing) => getListingRating(listing) >= ratingFilter);
    }

    // Filter by Open Now
    if (openNowFilter) {
      result = result.filter((listing) => checkIfOpenNow(listing.listingdata));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortByFilter) {
        case "az":
          return a.title.localeCompare(b.title);
        case "highest_rated":
          return getListingRating(b) - getListingRating(a);
        case "newest":
          return new Date(b.date) - new Date(a.date);
        default:
          return 0;
      }
    });

    return result;
  }, [listings, categoryFilter, ratingFilter, openNowFilter, sortByFilter]);

  return (
    <div className={styles['directory-filter-manager']}>
      {/* The Revamped Filter Bar */}
      <DirectoryFilters />

      <div className={styles['results-count']}>
        {filteredAndSortedListings.length}{" "}
        {t.listingsFound || "listings found"}
      </div>

      <CcrCardGrid listings={filteredAndSortedListings} currentUser={currentUser} locale={locale} />
    </div>
  );
}

DirectoryFilterManager.propTypes = {
  listings: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  dict: PropTypes.object,
  locale: PropTypes.string,
};

DirectoryFilterManager.propTypes = {
  listings: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  dict: PropTypes.object,
  locale: PropTypes.string,
};
