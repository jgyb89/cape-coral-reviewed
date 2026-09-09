"use client";

import React from 'react';
import PropTypes from 'prop-types';
import CcrCard from './CcrCard';
import AdUnit from "@/components/ads/AdUnit";
import ResponsiveGridAd from "@/components/ads/ResponsiveGridAd";
import { useDeviceType } from "@/hooks/useDeviceType";
import styles from './CcrCardGrid.module.css';

export default function CcrCardGrid({ listings, currentUser, locale = 'en' }) {
  const deviceType = useDeviceType();

  if (!listings || listings.length === 0) {
    return (
      <div className={styles['ccr-card-grid--empty']} style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--color-bg)', borderRadius: '12px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ccc', marginBottom: '1rem' }}>
          search_off
        </span>
        <p style={{ color: '#666', fontFamily: 'var(--font-heading)' }}>No listings found.</p>
      </div>
    );
  }

  return (
    <div className={styles['ccr-card-grid']}>
      {listings.map((listing, index) => (
        <React.Fragment key={listing.databaseId || listing.id || listing.slug}>
          <CcrCard listing={listing} currentUser={currentUser} locale={locale} />
          <ResponsiveGridAd index={index} deviceType={deviceType} />
        </React.Fragment>
      ))}

      {/* Desktop Ad: Placed at the end (12th slot) */}
      {deviceType === 'desktop' && (
        <AdUnit type="in-feed" isGridCard={true} />
      )}
    </div>
  );
}

CcrCardGrid.propTypes = {
  listings: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  locale: PropTypes.string,
};
