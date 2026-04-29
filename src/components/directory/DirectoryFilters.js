'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './DirectoryFilters.module.css';
import 'material-symbols/outlined.css';

// Comprehensive list for powerful predictive search
const ALL_CATEGORIES = [
  // User Requested Categories (from CSV data)
  { name: 'Alternative & Therapy', slug: 'alternative-therapy-en' },
  { name: 'Chiropractors', slug: 'chiropractors-en' },
  { name: 'Mental Health Services', slug: 'mental-health-services-en' },
  { name: 'Physical Therapy', slug: 'physical-therapy-en' },
  { name: 'Auto Repair & Mechanics', slug: 'auto-repair-mechanics-en' },
  { name: 'Car Wash & Detailing', slug: 'car-wash-detailing-en' },
  { name: 'Bars & Nightlife', slug: 'bars-nightlife-en' },
  { name: 'Breweries', slug: 'breweries-en' },
  { name: 'Pubs & Grills', slug: 'pubs-grills-en' },
  { name: 'Beauty & Spas', slug: 'beauty-spas-en' },
  { name: 'Hair Salons', slug: 'hair-salons-en' },
  { name: 'Massage Therapy', slug: 'massage-therapy-en' },
  { name: 'Cafes & Bakeries', slug: 'cafes-bakeries-en' },
  { name: 'Contractors & Repair', slug: 'contractors-repair-en' },
  { name: 'HVAC & AC Repair', slug: 'hvac-ac-repair-en' },
  { name: 'Plumbers', slug: 'plumbers-en' },
  { name: 'Landscaping & Lawn Care', slug: 'landscaping-lawn-care-en' },
  { name: 'Pool Services', slug: 'pool-services-en' },
  { name: 'Dentists & Orthodontics', slug: 'dentists-orthodontics-en' },
  { name: 'Primary Care & Doctors', slug: 'primary-care-doctors-en' },
  { name: 'Pet Grooming', slug: 'pet-grooming-en' },
  { name: 'Veterinarians', slug: 'veterinarians-en' },
  { name: 'Real Estate', slug: 'real-estate-en' },

  // Remaining categories from existing list
  { name: 'Restaurants', slug: 'restaurants-en' },
  { name: 'Pizza', slug: 'pizza-en' },
  { name: 'Seafood', slug: 'seafood-en' },
  { name: 'American Food', slug: 'american-food-en' },
  { name: 'Mexican & Latin', slug: 'mexican-latin-en' },
  { name: 'Cuban', slug: 'cuban-food-en' },
  { name: 'Asian & Chinese', slug: 'asian-chinese-en' },
  { name: 'Breakfast & Brunch', slug: 'breakfast-brunch-en' },
  { name: 'Sandwiches & Subs', slug: 'sandwiches-subs-en' },
  { name: 'Steakhouse', slug: 'steakhouse-en' },
  { name: 'Sports Bars', slug: 'sports-bars-en' },
  { name: 'Wine & Cocktail Bars', slug: 'wine-cocktail-bars-en' },
  { name: 'Coffee & Tea', slug: 'coffee-tea-en' },
  { name: 'Boba & Juice', slug: 'boba-juice-en' },
  { name: 'Bakeries & Desserts', slug: 'bakeries-desserts-en' },
  { name: 'Medical & Dental', slug: 'medical-dental-en' },
  { name: 'Urgent Care', slug: 'urgent-care-en' },
  { name: 'Optometrists', slug: 'optometrists-en' },
  { name: 'Nail Salons', slug: 'nail-salons-en' },
  { name: 'Med Spas & Weight Loss', slug: 'med-spas-weight-loss-en' },
  { name: 'Fitness & Sports', slug: 'fitness-sports-en' },
  { name: 'Gyms & Health Clubs', slug: 'gyms-health-clubs-en' },
  { name: 'Yoga & Pilates', slug: 'yoga-pilates-en' },
  { name: 'Swim Schools', slug: 'swim-schools-recreation-en' },
  { name: 'Electricians', slug: 'electricians-en' },
  { name: 'Roofing Contractors', slug: 'roofing-contractors-en' },
  { name: 'Handyman Services', slug: 'handyman-services-en' },
  { name: 'Home & Property', slug: 'home-property-en' },
  { name: 'Cleaning & Pressure Washing', slug: 'cleaning-pressure-washing-en' },
  { name: 'Hurricane Shutters & Windows', slug: 'shutters-windows-en' },
  { name: 'Marine & Boat Services', slug: 'marine-boat-services-en' },
  { name: 'Realtors & Agencies', slug: 'realtors-agencies-en' },
  { name: 'Apartments & Property Mgmt', slug: 'apartments-property-mgmt-en' },
  { name: 'Pet Services', slug: 'pet-services-en' },
  { name: 'Pet Grooming & Boarding', slug: 'pet-grooming-boarding-en' }
];

const QUICK_PILLS = [
  { label: 'Restaurants', slug: 'restaurants-en' },
  { label: 'Bars & Nightlife', slug: 'bars-nightlife-en' },
  { label: 'Cafes & Bakeries', slug: 'cafes-bakeries-en' },
  { label: 'Medical & Dental', slug: 'medical-dental-en' },
  { label: 'Contractors & Repair', slug: 'contractors-repair-en' },
  { label: 'Beauty & Spas', slug: 'beauty-spas-en' },
  { label: 'Real Estate', slug: 'real-estate-en' },
  { label: 'Auto & Transport', slug: 'auto-repair-mechanics-en' }
];

export default function DirectoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [catInput, setCatInput] = useState('');
  const [isCatFocused, setIsCatFocused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const pillContainerRef = useRef(null);

  const currentCategorySlug = searchParams.get('category') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentOpenNow = searchParams.get('open') === 'true';
  const currentSort = searchParams.get('sort') || 'newest';

  const handleScroll = () => {
    if (pillContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = pillContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < (scrollWidth - clientWidth - 1));
    }
  };

  useEffect(() => {
    // Initial check
    handleScroll();
    
    // Check on resize
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scrollPills = (direction) => {
    if (pillContainerRef.current) {
      const scrollAmount = 300; // The distance to scroll in pixels
      pillContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const handleCategorySelect = (slug) => {
    updateFilter('category', slug);
    setIsCatFocused(false);
    setCatInput('');
    setIsMobileModalOpen(false);
  };

  // Predictive search across the massive array
  const filteredCategories = ALL_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(catInput.toLowerCase())
  );

  const renderPills = (isMobile = false) => {
    const pillsContent = (
      <>
        <button 
          className={`${styles['category-pill']} ${!currentCategorySlug ? styles['category-pill--active'] : ''}`}
          onClick={() => updateFilter('category', '')}
        >
          All
        </button>
        {QUICK_PILLS.map(pill => (
          <button 
            key={pill.slug}
            className={`${styles['category-pill']} ${currentCategorySlug === pill.slug ? styles['category-pill--active'] : ''}`}
            onClick={() => updateFilter('category', currentCategorySlug === pill.slug ? '' : pill.slug)}
          >
            {pill.label}
          </button>
        ))}
      </>
    );

    if (isMobile) {
      return (
        <div className={styles['category-pills-mobile']}>
          {pillsContent}
        </div>
      );
    }

    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: 'calc(100% - 32px)', margin: '0 auto 1.5rem' }}>
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scrollPills('left')}
            aria-label="Scroll left"
            className={`${styles['scroll-arrow']} ${styles['scroll-arrow-left']}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
        )}

        <div 
          ref={pillContainerRef}
          onScroll={handleScroll}
          className={styles['category-pills-desktop']}
          style={{ scrollBehavior: 'smooth', marginBottom: 0 }}
        >
          {pillsContent}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scrollPills('right')}
            aria-label="Scroll right"
            className={`${styles['scroll-arrow']} ${styles['scroll-arrow-right']}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        )}
      </div>
    );
  };

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
                onMouseDown={(e) => { e.preventDefault(); handleCategorySelect(cat.slug); }}
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