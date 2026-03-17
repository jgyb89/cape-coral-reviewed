"use client";
import { useState } from "react";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import "./Navbar.css";
import capeCoralLogo from "../../../public/cape-coral-reviewed-logo.svg";
import Image from "next/image";

export default function Navbar({ currentUser }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isListingsOpen, setIsListingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <>
      <nav className="main-nav">
        <Link href="/" className="nav-brand">
          <Image
            src={capeCoralLogo}
            alt="Cape Coral Reviewed Logo"
            className="nav-logo"
            priority // Recommended for logos/above-the-fold content
          />
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span className="material-symbols-outlined">
            {isMobileOpen ? "close" : "menu"}
          </span>
        </button>

        <div className={`nav-links ${isMobileOpen ? "mobile-open" : ""}`}>
          <Link href="/search" className="nav-link">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.2rem" }}
            >
              search
            </span>{" "}
            Search
          </Link>

          <div
            className="nav-link"
            onMouseEnter={() => setIsListingsOpen(true)}
            onMouseLeave={() => setIsListingsOpen(false)}
          >
            All Listings{" "}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.2rem" }}
            >
              expand_more
            </span>
            {isListingsOpen && (
              <div className="nav-dropdown">
                <Link href="/directory">View All Directory</Link>
                {/* Future categories will go here */}
              </div>
            )}
          </div>

          <Link href="/news" className="nav-link">
            News & Reviews
          </Link>

          {currentUser ? (
            // LOGGED IN STATE
            <>
              <div
                className="nav-link"
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                My Account{" "}
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1.2rem" }}
                >
                  expand_more
                </span>
                {isAccountOpen && (
                  <div className="nav-dropdown">
                    <Link href="/dashboard">Profile</Link>
                    <Link href="/dashboard/favorites">Favorites</Link>
                    <Link href="/dashboard/reviews">My Reviews</Link>
                    <button onClick={() => setIsLogoutModalOpen(true)}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <div className="business-signup">
                <Link href="/submit-listing">Submit your Business</Link>
              </div>
            </>
          ) : (
            // LOGGED OUT STATE
            <>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="nav-link"
                style={{ background: "none", border: "none", fontSize: "1rem" }}
              >
                Log in
              </button>
              <div className="sign-up-button">
                <Link href="/register">Join Community</Link>
              </div>
              <div className="business-signup">
                <Link href="/submit-listing">Submit your Business</Link>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Existing Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2.5rem",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                color: "#333",
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
                fontWeight: 500,
              }}
            >
              Are you sure you want to log out?
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <a
                href="/logout"
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "6px",
                  backgroundColor: "#d3302f",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Yes, Log Out
              </a>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#bdbdbd",
                  color: "#333",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
