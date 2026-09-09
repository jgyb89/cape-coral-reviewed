"use client";

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CcrCard from './CcrCard';
import AdUnit from "@/components/ads/AdUnit";
import styles from './CcrCardGrid.module.css';

export default function CcrCardGrid({ listings, currentUser, locale = 'en' }) {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDeviceType('mobile');
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          
          {/* Mobile Ads: After 3rd item (index 2) and 9th item (index 8) */}
          {deviceType === 'mobile' && (index === 2 || index === 8) && (
            <AdUnit type="in-feed" isGridCard={true} />
          )}

          {/* Tablet Ads: After 2nd item (index 1) and 8th item (index 7) spanning both columns */}
          {deviceType === 'tablet' && (index === 1 || index === 7) && (
            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
              <AdUnit type="horizontal" />
            </div>
          )}
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
