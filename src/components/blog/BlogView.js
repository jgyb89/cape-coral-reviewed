/* src/components/blog/BlogView.js */
"use client";

import { useState } from "react";
import BlogCard from "./BlogCard";
import styles from "./Blog.module.css";

export default function BlogView({ posts, dict = {}, locale = "en" }) {
  const t = dict?.blog?.tabs || {};
  
  const TABS = [
    { id: 'all', label: t.all || 'All Posts' },
    { id: 'featured-business', label: t.featured || 'Featured Business' },
    { id: 'news-reviews', label: t.news || 'News & Reviews' },
    { id: 'food-drink', label: t.food || 'Food & Drink' },
    { id: 'home-local-services', label: t.home || 'Home & Local Services' },
    { id: 'health-wellness', label: t.health || 'Health & Wellness' }
  ];

  const [activeTab, setActiveTab] = useState('all');

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.categorySlugs?.includes(activeTab);
  });

  return (
    <div className={styles['blog-view']}>
      <nav className={styles['blog-tabs']} aria-label="Blog categories">
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

      <div className={styles['blog-grid']}>
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
