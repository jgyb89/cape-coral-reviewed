/* src/components/blog/BlogView.js */
"use client";

import { useState } from "react";
import BlogCard from "./BlogCard";
import "./Blog.css";

const TABS = [
  'All Posts',
  'Featured Businesses',
  'News & Reviews',
  'Food & Drink',
  'Home & Local Services',
  'Health & Wellness'
];

export default function BlogView({ posts }) {
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
            key={tab}
            className={`blog-tabs__item ${activeTab === tab ? "blog-tabs__item--active" : ""}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="blog-grid">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
