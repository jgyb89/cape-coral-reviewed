/* src/components/blog/BlogView.js */
"use client";


import React, { useState } from "react";
import BlogCard from "./BlogCard";
import AdUnit from "@/components/ads/AdUnit";
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
  
  // Call our new custom hook!
  const {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    handleScroll,
    scrollLeft,
    scrollRight
  } = useHorizontalScroll();


  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.categorySlugs?.includes(activeTab);
  });


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
        <div className={styles['blog-grid']}>
          {filteredPosts.map((post, index) => (
            <React.Fragment key={post.id || post.slug}>
              <BlogCard post={post} locale={locale} />
              
              {/* Inject In-Feed Ad safely after the 11th item without removing data */}
              {index === 10 && (
                <div style={{ gridColumn: '1 / -1', width: '100%' }}>
                  <AdUnit type="in-feed" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
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
