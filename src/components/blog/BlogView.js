/* src/components/blog/BlogView.js */
"use client";

import { useState } from "react";
import BlogCard from "./BlogCard";
import "./Blog.css";

export default function BlogView({ posts, dict = {}, locale = "en" }) {
  const t = dict?.blog?.tabs || {};
  
  const TABS = [
    { id: 'All Posts', label: t.all || 'All Posts' },
    { id: 'Featured Businesses', label: t.featured || 'Featured Businesses' },
    { id: 'News & Reviews', label: t.news || 'News & Reviews' },
    { id: 'Food & Drink', label: t.food || 'Food & Drink' },
    { id: 'Home & Local Services', label: t.home || 'Home & Local Services' },
    { id: 'Health & Wellness', label: t.health || 'Health & Wellness' }
  ];

  const [activeTab, setActiveTab] = useState('All Posts');

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'All Posts') return true;
    return post.categories.includes(activeTab);
  });

  return (
    <div className="blog-view">
      <nav className="blog-tabs" aria-label="Blog categories">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`blog-tabs__item ${activeTab === tab.id ? "blog-tabs__item--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="blog-grid">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
