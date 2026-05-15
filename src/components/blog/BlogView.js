/* src/components/blog/BlogView.js */
"use client";


import { useState } from "react";
import BlogCard from "./BlogCard";
import styles from "./Blog.module.css";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";


export default function BlogView({ posts, dict = {}, locale = "en" }) {
  const t = dict?.blog?.tabs || {};
  
  const TABS = [
    { id: 'all', label: t.all || 'All Posts' },
    { id: 'business', label: t.business || 'Business' },
    { id: 'featured-business', label: t.featured || 'Featured Business' },
    { id: 'food-and-drink', label: t.food || 'Food & Drink' },
    { id: 'health-wellness', label: t.health || 'Health & Wellness' },
    { id: 'home-local-services', label: t.home || 'Home & Local Services' },
    { id: 'lawn-care', label: t.lawnCare || 'Lawn Care' },
    { id: 'news', label: t.news || 'News' },
    { id: 'reviews', label: t.reviews || 'Reviews' }
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
          {filteredPosts.map((post) => (
            <BlogCard key={post.id || post.slug} post={post} locale={locale} />
          ))}
        </div>
      ) : (
        <p>{t.noPosts || 'No posts found in this category.'}</p>
      )}
    </div>
  );
}
