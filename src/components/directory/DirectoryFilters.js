'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ALL_CATEGORIES } from '@/lib/constants';
import styles from './DirectoryFilters.module.css';
import 'material-symbols/outlined.css';

const QUICK_PILLS = [
  { label: 'Restaurants', slug: 'restaurants-en' },
  { label: 'Bars & Nightlife', slug: 'bars-nightlife-en' },
  { label: 'Cafes & Bakeries', slug: 'cafes-bakeries-en' },
  { label: 'Medical & Dental', slug: 'medical-dental-en' },
  { label: 'Contractors & Repair', slug: 'contractors-repair-en' },
  { label: 'Beauty & Spas', slug: 'beauty-spas-en' },
  { label: 'Real Estate', slug: 'real-estate-en' },
  { label: 'Auto & Transport', slug: 'auto-transport-en' }
];

const getCategoryRoute = (slug) => {
  const category = ALL_CATEGORIES.find(c => c.slug === slug);
  if (!category) return '/directory';

  // If it has a direct directoryType, use it
  if (category.directoryType) {
    return `/directory/${category.directoryType}/${category.slug}`;
  }

  // If it's a child, find the parent's directoryType
  if (category.parentSlug) {
    const parent = ALL_CATEGORIES.find(p => p.slug === category.parentSlug);
    if (parent && parent.directoryType) {
      return `/directory/${parent.directoryType}/${category.slug}`;
    }
  }

  return `/directory`; // Fallback
};

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
    const route = getCategoryRoute(slug);
    const locale = pathname.split('/')[1] || 'en';
    router.push(`/${locale}${route}`);
    setIsCatFocused(false);
    setCatInput('');
    setIsMobileModalOpen(false);
  };

  // Predictive search across the massive array
  const filteredCategories = ALL_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(catInput.toLowerCase())
  );

  const handleCategoryClick = (slug) => {
    const locale = pathname.split('/')[1] || 'en';
    if (!slug || pathname.includes(slug)) {
      router.push(`/${locale}/directory`);
    } else {
      const route = getCategoryRoute(slug);
      router.push(`/${locale}${route}`);
    }
    setIsMobileModalOpen(false);
  };

  const renderPills = (isMobile = false) => {
    const pillsContent = (
      <>
        <button 
          className={`${styles['category-pill']} ${pathname.endsWith('/directory') ? styles['category-pill--active'] : ''}`}
          onClick={() => handleCategoryClick('')}
        >
          All
        </button>
        {QUICK_PILLS.map(pill => (
          <button 
            key={pill.slug}
            className={`${styles['category-pill']} ${pathname.includes(pill.slug) ? styles['category-pill--active'] : ''}`}
            onClick={() => handleCategoryClick(pill.slug)}
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

      <div className={styles['filter-group']} style={{ display: 'none' }}>
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

      {/* DESKTOP PILLS (Hidden on Mobile) */}
      {renderPills(false)}

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
            
            {renderFilters(true)}

            {/* MOBILE PILLS (Wrapped naturally) */}
            <div style={{ marginTop: '0.5rem' }}>
              <label className={styles['filter-label']} style={{ display: 'block', marginBottom: '0.5rem' }}>Quick Categories</label>
              {renderPills(true)}
            </div>
            
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