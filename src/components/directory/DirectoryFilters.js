'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './DirectoryFilters.module.css';
import 'material-symbols/outlined.css';

// Comprehensive list for powerful predictive search
const ALL_CATEGORIES = [
  // Food & Drink
  { name: 'Restaurants', slug: 'restaurants-en', parentSlug: 'food-drink' },
  { name: 'Pizza', slug: 'pizza-en', parentSlug: 'food-drink' },
  { name: 'Seafood', slug: 'seafood-en', parentSlug: 'food-drink' },
  { name: 'American (New & Traditional)', slug: 'american-food-en', parentSlug: 'food-drink' },
  { name: 'Mexican & Latin', slug: 'mexican-latin-en', parentSlug: 'food-drink' },
  { name: 'Cuban', slug: 'cuban-food-en', parentSlug: 'food-drink' },
  { name: 'Asian & Chinese', slug: 'asian-chinese-en', parentSlug: 'food-drink' },
  { name: 'Breakfast & Brunch', slug: 'breakfast-brunch-en', parentSlug: 'food-drink' },
  { name: 'Sandwiches & Subs', slug: 'sandwiches-subs-en', parentSlug: 'food-drink' },
  { name: 'Steakhouse', slug: 'steakhouse-en', parentSlug: 'food-drink' },
  { name: 'Bars & Nightlife', slug: 'bars-nightlife-en', parentSlug: 'food-drink' },
  { name: 'Breweries', slug: 'breweries-en', parentSlug: 'food-drink' },
  { name: 'Sports Bars', slug: 'sports-bars-en', parentSlug: 'food-drink' },
  { name: 'Pubs & Grills', slug: 'pubs-grills-en', parentSlug: 'food-drink' },
  { name: 'Wine & Cocktail Bars', slug: 'wine-cocktail-bars-en', parentSlug: 'food-drink' },
  { name: 'Cafes & Bakeries', slug: 'cafes-bakeries-en', parentSlug: 'food-drink' },
  { name: 'Coffee & Tea', slug: 'coffee-tea-en', parentSlug: 'food-drink' },
  { name: 'Boba & Juice', slug: 'boba-juice-en', parentSlug: 'food-drink' },
  { name: 'Bakeries & Desserts', slug: 'bakeries-desserts-en', parentSlug: 'food-drink' },

  // Health & Wellness
  { name: 'Medical & Dental', slug: 'medical-dental-en', parentSlug: 'health-wellness' },
  { name: 'Dentists & Orthodontics', slug: 'dentists-orthodontics-en', parentSlug: 'health-wellness' },
  { name: 'Primary Care & Doctors', slug: 'primary-care-doctors-en', parentSlug: 'health-wellness' },
  { name: 'Urgent Care', slug: 'urgent-care-en', parentSlug: 'health-wellness' },
  { name: 'Optometrists', slug: 'optometrists-en', parentSlug: 'health-wellness' },
  { name: 'Beauty & Spas', slug: 'beauty-spas-en', parentSlug: 'health-wellness' },
  { name: 'Hair Salons', slug: 'hair-salons-en', parentSlug: 'health-wellness' },
  { name: 'Nail Salons', slug: 'nail-salons-en', parentSlug: 'health-wellness' },
  { name: 'Massage Therapy', slug: 'massage-therapy-en', parentSlug: 'health-wellness' },
  { name: 'Med Spas & Weight Loss', slug: 'med-spas-weight-loss-en', parentSlug: 'health-wellness' },
  { name: 'Fitness & Sports', slug: 'fitness-sports-en', parentSlug: 'health-wellness' },
  { name: 'Gyms & Health Clubs', slug: 'gyms-health-clubs-en', parentSlug: 'health-wellness' },
  { name: 'Yoga & Pilates', slug: 'yoga-pilates-en', parentSlug: 'health-wellness' },
  { name: 'Swim Schools', slug: 'swim-schools-recreation-en', parentSlug: 'health-wellness' },
  { name: 'Chiropractors', slug: 'chiropractors-en', parentSlug: 'health-wellness' },
  { name: 'Physical Therapy', slug: 'physical-therapy-en', parentSlug: 'health-wellness' },
  { name: 'Mental Health Services', slug: 'mental-health-services-en', parentSlug: 'health-wellness' },

  // Home & Local Services
  { name: 'Contractors & Repair', slug: 'contractors-repair-en', parentSlug: 'home-local-services' },
  { name: 'Plumbers', slug: 'plumbers-en', parentSlug: 'home-local-services' },
  { name: 'Electricians', slug: 'electricians-en', parentSlug: 'home-local-services' },
  { name: 'HVAC & AC Repair', slug: 'hvac-ac-repair-en', parentSlug: 'home-local-services' },
  { name: 'Roofing Contractors', slug: 'roofing-contractors-en', parentSlug: 'home-local-services' },
  { name: 'Handyman Services', slug: 'handyman-services-en', parentSlug: 'home-local-services' },
  { name: 'Home & Property', slug: 'home-property-en', parentSlug: 'home-local-services' },
  { name: 'Cleaning & Pressure Washing', slug: 'cleaning-pressure-washing-en', parentSlug: 'home-local-services' },
  { name: 'Pool Services', slug: 'pool-services-en', parentSlug: 'home-local-services' },
  { name: 'Landscaping & Lawn Care', slug: 'landscaping-lawn-care-en', parentSlug: 'home-local-services' },
  { name: 'Hurricane Shutters & Windows', slug: 'shutters-windows-en', parentSlug: 'home-local-services' },
  { name: 'Marine & Boat Services', slug: 'marine-boat-services-en', parentSlug: 'home-local-services' },
  { name: 'Real Estate', slug: 'real-estate-en', parentSlug: 'home-local-services' },
  { name: 'Realtors & Agencies', slug: 'realtors-agencies-en', parentSlug: 'home-local-services' },
  { name: 'Apartments & Property Mgmt', slug: 'apartments-property-mgmt-en', parentSlug: 'home-local-services' },
  { name: 'Auto Repair & Mechanics', slug: 'auto-repair-mechanics-en', parentSlug: 'home-local-services' },
  { name: 'Car Wash & Detailing', slug: 'car-wash-detailing-en', parentSlug: 'home-local-services' },
  { name: 'Pet Services', slug: 'pet-services-en', parentSlug: 'home-local-services' },
  { name: 'Veterinarians', slug: 'veterinarians-en', parentSlug: 'home-local-services' },
  { name: 'Pet Grooming & Boarding', slug: 'pet-grooming-boarding-en', parentSlug: 'home-local-services' }
];

const QUICK_PILLS = ['Restaurants', 'Bars & Nightlife', 'Cafes & Bakeries', 'Medical & Dental', 'Contractors & Repair', 'Beauty & Spas', 'Real Estate', 'Auto & Transport'];

export default function DirectoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [catInput, setCatInput] = useState('');
  const [isCatFocused, setIsCatFocused] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentOpenNow = searchParams.get('open') === 'true';
  const currentSort = searchParams.get('sort') || 'newest';

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    setCatInput('');
    setIsMobileModalOpen(false);
  };

  const handleCategorySelect = (catName) => {
    updateFilter('category', catName);
    setIsCatFocused(false);
    setCatInput('');
    setIsMobileModalOpen(false);
  };

  // Predictive search across the massive array
  const filteredCategories = ALL_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(catInput.toLowerCase())
  );

  const renderPills = (isMobile = false) => (
    <div className={isMobile ? styles['category-pills-mobile'] : styles['category-pills-desktop']}>
      <button 
        className={`${styles['category-pill']} ${!currentCategory ? styles['category-pill--active'] : ''}`}
        onClick={() => updateFilter('category', '')}
      >
        All
      </button>
      {QUICK_PILLS.map(pill => (
        <button 
          key={pill}
          className={`${styles['category-pill']} ${currentCategory === pill ? styles['category-pill--active'] : ''}`}
          onClick={() => updateFilter('category', currentCategory === pill ? '' : pill)}
        >
          {pill}
        </button>
      ))}
    </div>
  );

  const renderFilters = (isMobile = false) => (
    <>
      <div className={styles['autocomplete-wrapper']} style={isMobile ? { width: '100%' } : {}}>
        <div className={styles['filter-group']}>
          <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>search</span>
          <input 
            type="text" 
            placeholder="Search categories..." 
            className={styles['filter-input']}
            value={catInput}
            onChange={(e) => { setCatInput(e.target.value); setIsCatFocused(true); }}
            onFocus={() => setIsCatFocused(true)}
            onBlur={() => setTimeout(() => setIsCatFocused(false), 200)}
            style={isMobile ? { width: '100%' } : { width: '220px' }}
          />
        </div>
        {isCatFocused && catInput && filteredCategories.length > 0 && (
          <ul className={styles['autocomplete-list']} style={isMobile ? { width: '100%' } : {}}>
            {filteredCategories.map(cat => (
              <li 
                key={cat.slug} 
                className={styles['autocomplete-item']}
                onMouseDown={(e) => { e.preventDefault(); handleCategorySelect(cat.name); }}
              >
                {/* Bold the matching part for visual feedback */}
                <span style={{ fontWeight: 600 }}>{cat.name.slice(0, catInput.length)}</span>
                <span>{cat.name.slice(catInput.length)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles['filter-group']}>
        <label className={styles['filter-label']}>Rating</label>
        <select 
          className={styles['filter-select']} 
          value={currentRating} 
          onChange={(e) => updateFilter('rating', e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          <option value="3">⭐⭐⭐ 3 Stars</option>
        </select>
      </div>

      <div className={styles['filter-group']}>
        <label className={styles['filter-label']}>Open Now</label>
        <label className={styles['toggle-switch']}>
          <input 
            type="checkbox" 
            checked={currentOpenNow} 
            onChange={(e) => updateFilter('open', e.target.checked ? 'true' : '')} 
          />
          <span className={styles['slider']}></span>
        </label>
      </div>
    </>
  );

  return (
    <>
      {/* DESKTOP PILLS (Hidden on Mobile) */}
      {renderPills(false)}

      <div className={styles['filter-bar']}>
        {/* DESKTOP LEFT: Filters */}
        <div className={styles['desktop-filters']}>
          {renderFilters(false)}
        </div>

        {/* MOBILE LEFT: Filter Button (Hidden on Desktop) */}
        <div className={styles['mobile-controls']}>
          <button className={styles['btn-filter-mobile']} onClick={() => setIsMobileModalOpen(true)}>
            <span className="material-symbols-outlined">tune</span> Filters
          </button>
        </div>

        {/* RIGHT CONTROLS: Sort & Clear (Moved OUT of mobile-controls so it shows on Desktop!) */}
        <div className={styles['right-controls']}>
          <select 
            className={styles['filter-select']} 
            value={currentSort} 
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="az">A - Z</option>
          </select>
          <button className={`${styles['btn-clear']} ${styles['desktop-only']}`} onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {/* MOBILE MODAL */}
      {isMobileModalOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <div className={styles['modal-header']}>
              <h3 style={{ margin: 0 }}>Filters</h3>
              <button onClick={() => setIsMobileModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* MOBILE PILLS (Wrapped naturally) */}
            <div>
              <label className={styles['filter-label']} style={{ display: 'block', marginBottom: '0.5rem' }}>Quick Categories</label>
              {renderPills(true)}
            </div>

            {renderFilters(true)}
            
            <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <button 
                onClick={clearFilters} 
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear All Filters
              </button>
              <button 
                onClick={() => setIsMobileModalOpen(false)} 
                style={{ background: '#e04c4c', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}