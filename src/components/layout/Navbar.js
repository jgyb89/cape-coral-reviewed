"use client";
import { useState } from "react";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import SearchModal from "@/components/layout/SearchModal";
import "./Navbar.css";
import capeCoralLogo from "../../../public/cape-coral-reviewed-logo.svg";
import Image from "next/image";
import {
  Utensils,
  HeartPulse,
  Home,
  Coffee,
  Pizza,
  Beer,
  Wine,
  IceCream,
  ChefHat,
  Stethoscope,
  Dumbbell,
  Flower,
  Smile,
  Pill,
  Hammer,
  Wrench,
  Brush,
  Zap,
  Leaf,
} from "lucide-react";

const categories = [
  {
    title: "Food & Drink",
    slug: "food-drink",
    icon: <Utensils size={20} />,
    subs: [
      { name: "Restaurants", slug: "restaurants", icon: <ChefHat size={16} /> },
      { name: "Coffee & Tea", slug: "coffee-tea", icon: <Coffee size={16} /> },
      {
        name: "Bars & Nightlife",
        slug: "bars-nightlife",
        icon: <Beer size={16} />,
      },
      { name: "Pizza", slug: "pizza", icon: <Pizza size={16} /> },
      { name: "Bakeries", slug: "bakeries", icon: <IceCream size={16} /> },
      { name: "Wine Bars", slug: "wine-bars", icon: <Wine size={16} /> },
      { name: "Breweries", slug: "breweries", icon: <Beer size={16} /> },
      { name: "Juice Bars", slug: "juice-bars", icon: <Leaf size={16} /> },
      {
        name: "Breakfast & Brunch",
        slug: "breakfast-brunch",
        icon: <Coffee size={16} />,
      },
      { name: "Seafood", slug: "seafood", icon: <ChefHat size={16} /> },
    ],
  },
  {
    title: "Health & Wellness",
    slug: "health-wellness",
    icon: <HeartPulse size={20} />,
    subs: [
      { name: "Doctors", slug: "doctors", icon: <Stethoscope size={16} /> },
      { name: "Gyms", slug: "gyms", icon: <Dumbbell size={16} /> },
      { name: "Spas", slug: "spas", icon: <Flower size={16} /> },
      { name: "Dentists", slug: "dentists", icon: <Smile size={16} /> },
      { name: "Pharmacies", slug: "pharmacies", icon: <Pill size={16} /> },
      { name: "Yoga", slug: "yoga", icon: <Dumbbell size={16} /> },
      { name: "Massage", slug: "massage", icon: <Flower size={16} /> },
      {
        name: "Physical Therapy",
        slug: "physical-therapy",
        icon: <HeartPulse size={16} />,
      },
      {
        name: "Acupuncture",
        slug: "acupuncture",
        icon: <HeartPulse size={16} />,
      },
      { name: "Eye Care", slug: "eye-care", icon: <Smile size={16} /> },
    ],
  },
  {
    title: "Home & Local Services",
    slug: "home-local-services",
    icon: <Home size={20} />,
    subs: [
      { name: "Contractors", slug: "contractors", icon: <Hammer size={16} /> },
      { name: "Plumbers", slug: "plumbers", icon: <Wrench size={16} /> },
      { name: "Electricians", slug: "electricians", icon: <Zap size={16} /> },
      { name: "Landscaping", slug: "landscaping", icon: <Leaf size={16} /> },
      { name: "Cleaning", slug: "cleaning", icon: <Brush size={16} /> },
      { name: "HVAC", slug: "hvac", icon: <Zap size={16} /> },
      { name: "Roofing", slug: "roofing", icon: <Hammer size={16} /> },
      { name: "Painters", slug: "painters", icon: <Brush size={16} /> },
      { name: "Locksmiths", slug: "locksmiths", icon: <Wrench size={16} /> },
      { name: "Pest Control", slug: "pest-control", icon: <Zap size={16} /> },
    ],
  },
];

export default function Navbar({ currentUser }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isListingsOpen, setIsListingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [mobileLevel, setMobileLevel] = useState(1);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // 'listings' or 'account'
  const [activeCategory, setActiveCategory] = useState(null);

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    // Wait for slide animation to finish before resetting panels
    setTimeout(() => {
      setMobileLevel(1);
      setActiveSubMenu(null);
      setActiveCategory(null);
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
          >
            <span className="material-symbols-outlined nav-link__icon">
              search
            </span>{" "}
            Search
          </button>

          <div
            className="nav-link nav-link--all-listings"
            onMouseEnter={() => setIsListingsOpen(true)}
            onMouseLeave={() => setIsListingsOpen(false)}
          >
            <div className="nav-link__trigger">
              All Listings{" "}
              <span className="material-symbols-outlined nav-link__icon">
                expand_more
              </span>
            </div>
            
            {isListingsOpen && (
              <div className="mega-menu">
                <div className="mega-menu-grid">
                  {categories.map((cat) => (
                    <div key={cat.slug} className="mega-menu-column">
                      <h4 className="mega-menu-title">
                        {cat.icon} {cat.title}
                      </h4>
                      <div className="mega-menu-subs">
                        {cat.subs.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/directory/${cat.slug}/${sub.slug}`}
                            className="mega-menu-sub-link"
                            onClick={() => setIsListingsOpen(false)}
                          >
                            {sub.icon} {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mega-menu-footer">
                  <Link 
                    href="/directory" 
                    className="mega-menu-all-link" 
                    onClick={() => setIsListingsOpen(false)}
                  >
                    View All Directory
                  </Link>
                </div>
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
                <div className="nav-link__trigger">
                  My Account{" "}
                  <span className="material-symbols-outlined nav-link__icon">
                    expand_more
                  </span>
                </div>
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
                className="nav-link nav-login-btn"
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
                  >
                    <span>
                      <span className="material-symbols-outlined flyout-icon--search">
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
                    href="/blog"
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
                <span className="material-symbols-outlined flyout-back-icon">
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
                    {categories.map((cat) => (
                      <li key={cat.slug} className="flyout-item">
                        <button
                          className="flyout-action"
                          onClick={() => {
                            setMobileLevel(3);
                            setActiveCategory(cat);
                          }}
                        >
                          <span className="flyout-category-btn">
                            {cat.icon} {cat.title}
                          </span>
                          <span className="material-symbols-outlined flyout-icon">
                            chevron_right
                          </span>
                        </button>
                      </li>
                    ))}
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

            {/* LEVEL 3: Categories */}
            <section className="flyout-panel panel-3">
              <button className="flyout-back" onClick={() => setMobileLevel(2)}>
                <span className="material-symbols-outlined flyout-back-icon">
                  chevron_left
                </span>{" "}
                Back
              </button>

              {activeCategory && (
                <>
                  <h3 className="flyout-panel-title">{activeCategory.title}</h3>
                  <ul className="flyout-list">
                    {activeCategory.subs.map((sub) => (
                      <li key={sub.slug} className="flyout-item">
                        <Link
                          href={`/directory/${activeCategory.slug}/${sub.slug}`}
                          className="flyout-link"
                          onClick={closeMobileMenu}
                        >
                          <span className="flyout-category-btn">
                            {sub.icon} {sub.name}
                          </span>
                        </Link>
                      </li>
                    ))}
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
        <div className="logout-modal">
          <div className="logout-modal__dialog">
            <p className="logout-modal__text">
              Are you sure you want to log out?
            </p>
            <div className="logout-modal__actions">
              <a
                href="/logout"
                className="logout-modal__button logout-modal__button--confirm"
              >
                Yes, Log Out
              </a>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="logout-modal__button logout-modal__button--cancel"
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
