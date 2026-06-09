"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/components/events/EventCard";
import LoginModal from "@/components/auth/LoginModal";
import { getLocalizedUrl } from "@/lib/constants";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EventsClient.css";

const parseSafeDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  return new Date(dateStr.replace(" ", "T"));
};

export default function EventsClient({ events, currentUser, locale }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  const router = useRouter();

  const handleCreateClick = () => {
    if (currentUser) {
      router.push(getLocalizedUrl("/events/create", locale));
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const processedEvents = useMemo(() => {
    let sorted = [...events];
    
    if (sortBy === "upcoming") {
      const now = new Date();
      sorted = sorted.filter(e => {
        const eventDate = parseSafeDate(e.eventDetails?.startDateTime || e.date);
        return eventDate >= now;
      });
      sorted.sort((a, b) => {
        const dateA = parseSafeDate(a.eventDetails?.startDateTime || a.date);
        const dateB = parseSafeDate(b.eventDetails?.startDateTime || b.date);
        return dateA.getTime() - dateB.getTime();
      });
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => parseSafeDate(b.date).getTime() - parseSafeDate(a.date).getTime());
    } else if (sortBy === "popular") {
      sorted.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    }
    return sorted;
  }, [events, sortBy]);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: "4rem 2rem", backgroundColor: "#f8f9fa", textAlign: "center", borderBottom: "1px solid #eaeaea" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>Cape Coral Events</h1>
        <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
          Discover what&apos;s happening around town or share your own upcoming event with the community.
        </p>
        <button
          onClick={handleCreateClick}
          style={{
            backgroundColor: "#e94f37",
            color: "#fff",
            border: "none",
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            borderRadius: "100px",
            cursor: "pointer",
            transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
        >
          Create New Event
        </button>
      </section>

      {/* Main Layout */}
      <div style={{ maxWidth: "1600px", margin: "3rem auto", padding: "0 2vw" }}>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          {/* Left Column (Feed & Controls) */}
          <div style={{ flex: "2 1 60%", minWidth: "300px" }}>
            
            {/* Control Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", backgroundColor: "#fdfdfd", padding: "1rem", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setViewMode("grid")}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0.5rem", borderRadius: "8px", border: "none", cursor: "pointer",
                    backgroundColor: viewMode === "grid" ? "#e2e8f0" : "transparent",
                    color: viewMode === "grid" ? "#111" : "#666",
                    transition: "all 0.2s"
                  }}
                  title="Grid View"
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0.5rem", borderRadius: "8px", border: "none", cursor: "pointer",
                    backgroundColor: viewMode === "list" ? "#e2e8f0" : "transparent",
                    color: viewMode === "list" ? "#111" : "#666",
                    transition: "all 0.2s"
                  }}
                  title="List View"
                >
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <label htmlFor="sort-select" style={{ fontWeight: "600", color: "#444" }}>Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #eaeaea",
                    backgroundColor: "#fff", color: "#111", fontSize: "1rem", fontWeight: "500",
                    cursor: "pointer", outline: "none"
                  }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Popular</option>
                </select>
              </div>

            </div>

            {/* Event List/Grid */}
            {processedEvents.length > 0 ? (
              <div style={
                viewMode === "grid" 
                  ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }
                  : { display: "flex", flexDirection: "column", gap: "1.5rem" }
              }>
                {processedEvents.map((event) => (
                  <EventCard key={event.databaseId} event={event} locale={locale} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#666", backgroundColor: "#fdfdfd", border: "1px dashed #eaeaea", borderRadius: "12px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "#ccc", marginBottom: "1rem" }}>event_busy</span>
                <h2>No events found.</h2>
                <p>Check back later or submit a new event!</p>
              </div>
            )}
          </div>

          {/* Right Column (Calendar) */}
          <div style={{ flex: "1 1 30%", minWidth: "300px", position: "sticky", top: "2rem" }}>
            <div style={{ backgroundColor: "#fdfdfd", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid #eaeaea" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem", color: "#111" }}>Calendar</h3>
              <div className="custom-calendar-container">
                <Calendar 
                  onChange={setCalendarDate} 
                  value={calendarDate}
                  className="ccr-premium-calendar"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
