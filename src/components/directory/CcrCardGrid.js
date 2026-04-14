// src/components/directory/CcrCardGrid.js
import PropTypes from 'prop-types';
import CcrCard from './CcrCard';
import styles from './CcrCardGrid.module.css';

export default function CcrCardGrid({ listings, currentUser, locale = 'en' }) {
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
      {listings.map((listing) => (
        <CcrCard key={listing.id || listing.slug} listing={listing} currentUser={currentUser} locale={locale} />
      ))}
    </div>
  );
}

CcrCardGrid.propTypes = {
  listings: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};
