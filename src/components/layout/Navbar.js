"use client";
import { useState } from "react";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import SearchModal from "@/components/layout/SearchModal";
import "./Navbar.css";
import capeCoralLogo from "../../../public/cape-coral-reviewed-logo.svg";
import Image from "next/image";

export default function Navbar({ currentUser }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isListingsOpen, setIsListingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [mobileLevel, setMobileLevel] = useState(1);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // 'listings' or 'account'

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    // Wait for slide animation to finish before resetting panels
    setTimeout(() => {
      setMobileLevel(1);
      setActiveSubMenu(null);
    }, 300);
  };

  const getSubmitHref = () => {
    if (!currentUser) return "/register-business";
    const userRoles =
      currentUser.roles?.nodes?.map((node) => node.name.toLowerCase()) || [];
    if (userRoles.includes("business") || userRoles.includes("administrator")) {
      return "/submit-listing";
    }
    return "/user-to-business";
  };

  const submitHref = getSubmitHref();

  const userRoles = currentUser?.roles?.nodes?.map((node) => node.name.toLowerCase()) || [];
  const isBusinessOrAdmin = userRoles.includes("business") || userRoles.includes("administrator");

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
          onClick={() =>
            isMobileOpen ? closeMobileMenu() : setIsMobileOpen(true)
          }
        >
          <span className="material-symbols-outlined">
            {isMobileOpen ? "close" : "menu"}
          </span>
        </button>

        <div className={`nav-links ${isMobileOpen ? "mobile-open" : ""}`}>
          <button 
            onClick={() => setIsSearchModalOpen(true)} 
            className="nav-link nav-link--search"
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.2rem" }}
            >
              search
            </span>{" "}
            Search
          </button>

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

          <Link href="/blog" className="nav-link">
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
                    {isBusinessOrAdmin && (
                      <Link href="/dashboard/listings">My Listings</Link>
                    )}
                    <button onClick={() => setIsLogoutModalOpen(true)}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <div className="business-signup">
                <Link href={submitHref}>Submit your Business</Link>
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
                <Link href={submitHref}>Submit your Business</Link>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* MOBILE FLYOUT MENU */}
      <div className="mobile-flyout">
        <div
          className={`flyout-overlay ${isMobileOpen ? "open" : ""}`}
          onClick={closeMobileMenu}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              closeMobileMenu();
            }
          }}
          role="button"
          tabIndex={isMobileOpen ? 0 : -1}
          aria-label="Close menu"
        />

        <aside
          className={`flyout-drawer ${isMobileOpen ? "open" : ""}`}
          data-level={mobileLevel}
        >
          <div className="flyout-header">
            <Link href="/" className="flyout-brand" onClick={closeMobileMenu}>
              Cape Coral Directory
            </Link>
            <button className="flyout-close" onClick={closeMobileMenu}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flyout-panels">
            {/* LEVEL 1: Main Menu */}
            <section className="flyout-panel panel-1">
              <ul className="flyout-list">
                <li className="flyout-item">
                  <button
                    className="flyout-link flyout-link--search"
                    onClick={() => {
                      closeMobileMenu();
                      setIsSearchModalOpen(true);
                    }}
                    style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
                  >
                    <span>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "1.2rem",
                          verticalAlign: "middle",
                          marginRight: "8px",
                        }}
                      >
                        search
                      </span>
                      Search
                    </span>
                  </button>
                </li>
                <li className="flyout-item">
                  <button
                    className="flyout-action"
                    onClick={() => {
                      setMobileLevel(2);
                      setActiveSubMenu("listings");
                    }}
                  >
                    All Listings{" "}
                    <span className="material-symbols-outlined flyout-icon">
                      chevron_right
                    </span>
                  </button>
                </li>
                <li className="flyout-item">
                  <Link
                    href="/news"
                    className="flyout-link"
                    onClick={closeMobileMenu}
                  >
                    News & Reviews
                  </Link>
                </li>

                {currentUser ? (
                  <li className="flyout-item">
                    <button
                      className="flyout-action"
                      onClick={() => {
                        setMobileLevel(2);
                        setActiveSubMenu("account");
                      }}
                    >
                      My Account{" "}
                      <span className="material-symbols-outlined flyout-icon">
                        chevron_right
                      </span>
                    </button>
                  </li>
                ) : (
                  <li className="flyout-item">
                    <button
                      className="flyout-link"
                      onClick={() => {
                        closeMobileMenu();
                        setIsLoginModalOpen(true);
                      }}
                    >
                      Log in
                    </button>
                  </li>
                )}
              </ul>

              {/* Bottom CTAs */}
              <div className="flyout-cta-wrap">
                {!currentUser && (
                  <div className="sign-up-button">
                    <Link href="/register" onClick={closeMobileMenu}>
                      Join Community
                    </Link>
                  </div>
                )}
                <div className="business-signup">
                  <Link href={submitHref} onClick={closeMobileMenu}>
                    Submit your Business
                  </Link>
                </div>
              </div>
            </section>

            {/* LEVEL 2: Sub Menus */}
            <section className="flyout-panel panel-2">
              <button className="flyout-back" onClick={() => setMobileLevel(1)}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1.2rem" }}
                >
                  chevron_left
                </span>{" "}
                Back
              </button>

              {activeSubMenu === "listings" && (
                <>
                  <h3 className="flyout-panel-title">Categories</h3>
                  <ul className="flyout-list">
                    <li className="flyout-item">
                      <Link
                        href="/directory"
                        className="flyout-link"
                        onClick={closeMobileMenu}
                      >
                        View All Directory
                      </Link>
                    </li>
                    {/* Future categories map here */}
                  </ul>
                </>
              )}

              {activeSubMenu === "account" && (
                <>
                  <h3 className="flyout-panel-title">Dashboard</h3>
                  <ul className="flyout-list">
                    <li className="flyout-item">
                      <Link
                        href="/dashboard"
                        className="flyout-link"
                        onClick={closeMobileMenu}
                      >
                        Profile Settings
                      </Link>
                    </li>
                    <li className="flyout-item">
                      <Link
                        href="/dashboard/favorites"
                        className="flyout-link"
                        onClick={closeMobileMenu}
                      >
                        Favorite Listings
                      </Link>
                    </li>
                    <li className="flyout-item">
                      <Link
                        href="/dashboard/reviews"
                        className="flyout-link"
                        onClick={closeMobileMenu}
                      >
                        My Reviews
                      </Link>
                    </li>
                    {isBusinessOrAdmin && (
                      <li className="flyout-item">
                        <Link
                          href="/dashboard/listings"
                          className="flyout-link"
                          onClick={closeMobileMenu}
                        >
                          My Listings
                        </Link>
                      </li>
                    )}
                    <li className="flyout-item">
                      <button
                        className="flyout-link"
                        onClick={() => {
                          closeMobileMenu();
                          setIsLogoutModalOpen(true);
                        }}
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </section>
          </div>
        </aside>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />

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
