/* src/components/blog/BlogView.js */
"use client";

import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import AdUnit from "@/components/ads/AdUnit";
import Pagination from "@/components/common/Pagination";
import PropTypes from 'prop-types';
import styles from "./Blog.module.css";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

export default function BlogView({ posts, dict = {}, locale = "en" }) {
  const t = dict?.blog?.tabs || {};
  
  const TABS = [
    { id: 'all', label: t.all || 'All Posts' },
    { id: 'local-reviews', label: t.localReviews || 'Local Reviews' },
    { id: 'news-events', label: t.newsEvents || 'News & Events' }
  ];

  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 11;
  const [deviceType, setDeviceType] = useState('desktop');
  
  // Call our new custom hook!
  const {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    handleScroll,
    scrollLeft,
    scrollRight
  } = useHorizontalScroll();

  // Reset pagination when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Track window resize to coordinate grid injections
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

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.categorySlugs?.includes(activeTab);
  });

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={styles['blog-view']}>
      <div className={styles['blog-tabs-wrapper']}>
        {showLeftArrow && (
          <button className={`${styles['scroll-arrow']} ${styles['scroll-arrow-left']}`} onClick={scrollLeft}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
        )}

        <nav 
          className={styles['blog-tabs']} 
          aria-label="Blog categories"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles['blog-tabs__item']} ${activeTab === tab.id ? styles['blog-tabs__item--active'] : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {showRightArrow && (
          <button className={`${styles['scroll-arrow']} ${styles['scroll-arrow-right']}`} onClick={scrollRight}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
      </div>

      {filteredPosts.length > 0 ? (
        <>
          <div className={styles['blog-grid']}>
            {paginatedPosts.map((post, index) => (
              <React.Fragment key={post.id || post.slug}>
                <BlogCard post={post} locale={locale} />
                
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
          
          <Pagination 
            totalItems={filteredPosts.length} 
            itemsPerPage={ITEMS_PER_PAGE} 
            currentPageProp={currentPage} 
            onPageChange={setCurrentPage} 
          />
        </>
      ) : (
        <p>{t.noPosts || 'No posts found in this category.'}</p>
      )}
    </div>
  );
}

BlogView.propTypes = {
  posts: PropTypes.array.isRequired,
  dict: PropTypes.object,
  locale: PropTypes.string,
};
