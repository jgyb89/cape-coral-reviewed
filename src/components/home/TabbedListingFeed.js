"use client";

import React, { useState } from "react";
import Link from "next/link";
import CcrCard from "@/components/directory/CcrCard";

export default function TabbedListingFeed({
  initialListings = [],
  currentUser,
}) {
  const [activeTab, setActiveTab] = useState("Newest");

  // For now, we use the same listings for all tabs.
  // Real logic for sorting will be connected later.
  const displayListings = initialListings.slice(0, 9);

  const tabs = ["Newest", "Top Rated", "Hottest"];

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
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 0",
                fontSize: "1.1rem",
                fontWeight: "600",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeTab === tab ? "#d32323" : "#666",
                borderBottom:
                  activeTab === tab
                    ? "3px solid #d32323"
                    : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <Link
          href="/directory"
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
          View All
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
