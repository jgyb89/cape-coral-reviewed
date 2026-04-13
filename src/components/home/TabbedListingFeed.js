"use client";

import React, { useState } from "react";
import Link from "next/link";
import CcrCard from "@/components/directory/CcrCard";

export default function TabbedListingFeed({
  initialListings = [],
  currentUser,
  dict = {},
  locale = "en",
}) {
  const tabs = [
    { id: "Newest", label: dict.newest || "Newest" },
    { id: "Top Rated", label: dict.topRated || "Top Rated" },
    { id: "Hottest", label: dict.hottest || "Hottest" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // For now, we use the same listings for all tabs.
  const displayListings = initialListings.slice(0, 9);

  return (
    <div style={{ width: "100%" }}>
      {/* Tabs and View All Button Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #eee",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "32px",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 0",
                fontSize: "1.1rem",
                fontWeight: "600",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeTab === tab.id ? "#d32323" : "#666",
                borderBottom:
                  activeTab === tab.id
                    ? "3px solid #d32323"
                    : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href={`/${locale}/directory`}
          style={{
            backgroundColor: "#d32323",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          {dict.viewAll || "View All"}
        </Link>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {displayListings.map((listing) => (
          <CcrCard
            key={listing.databaseId}
            listing={listing}
            currentUser={currentUser}
            locale={locale}
          />
        ))}
        {displayListings.length === 0 && (
          <p
            style={{
              textAlign: "center",
              gridColumn: "1 / -1",
              padding: "40px",
              color: "#666",
            }}
          >
            No listings found for this category.
          </p>
        )}
      </div>
    </div>
  );
}
