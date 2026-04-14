"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import LoginModal from "@/components/auth/LoginModal";
import SearchModal from "@/components/layout/SearchModal";
import styles from "./Navbar.module.css";
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

export default function Navbar({ currentUser, dict, locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isListingsOpen, setIsListingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [mobileLevel, setMobileLevel] = useState(1);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // 'listings' or 'account'
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "es" : "en";
    const pathParts = pathname.split("/");
    pathParts[1] = newLocale;
    router.push(pathParts.join("/"));
  };

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
    if (!currentUser) return `/${locale}/register-business`;
    const userRoles =
      currentUser.roles?.nodes?.map((node) => node.name.toLowerCase()) || [];
    if (userRoles.includes("business") || userRoles.includes("administrator")) {
      return `/${locale}/submit-listing`;
    }
    return `/${locale}/user-to-business`;
  };

  const submitHref = getSubmitHref();

  const userRoles = currentUser?.roles?.nodes?.map((node) => node.name.toLowerCase()) || [];
  const isBusinessOrAdmin = userRoles.includes("business") || userRoles.includes("administrator");

  const t = dict?.nav || {};

  return (
    <>
      <nav className={styles['main-nav']}>
        <Link href={`/${locale}`} className={styles['nav-brand']}>
          <Image
            src={capeCoralLogo}
            alt="Cape Coral Reviewed Logo"
            className={styles['nav-logo']}
            priority // Recommended for logos/above-the-fold content
          />
        </Link>

        <div className={styles['mobile-actions']}>
          <button
            className={styles['mobile-search-btn']}
            onClick={() => setIsSearchModalOpen(true)}
            aria-label="Open Search"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          <button
            className={styles['mobile-menu-btn']}
            onClick={() =>
              isMobileOpen ? closeMobileMenu() : setIsMobileOpen(true)
            }
          >
            <span className="material-symbols-outlined">
              {isMobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        <div className={`${styles['nav-links']} ${isMobileOpen ? styles['mobile-open'] : ""}`}>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className={styles['nav-link']}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.2rem", marginTop: "-2px" }}
            >
              search
            </span>{" "}
            {t.search || "Search"}
          </button>

          <div
            className={`${styles['nav-link']} ${styles['nav-link--all-listings']}`}
            onMouseEnter={() => setIsListingsOpen(true)}
            onMouseLeave={() => setIsListingsOpen(false)}
          >
            <div className={styles['nav-link__trigger']}>
              {t.allListings || "All Listings"}{" "}
              <span className={`material-symbols-outlined ${styles['nav-link__icon']}`}>
                expand_more
              </span>
            </div>
            
            {isListingsOpen && (
              <div className={styles['mega-menu']}>
                <div className={styles['mega-menu-grid']}>
                  {categories.map((cat) => (
                    <div key={cat.slug} className={styles['mega-menu-column']}>
                      <h4 className={styles['mega-menu-title']}>
                        {cat.icon} {cat.title}
                      </h4>
                      <div className={styles['mega-menu-subs']}>
                        {cat.subs.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/${locale}/directory/${cat.slug}/${sub.slug}`}
                            className={styles['mega-menu-sub-link']}
                            onClick={() => setIsListingsOpen(false)}
                          >
                            {sub.icon} {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles['mega-menu-footer']}>
                  <Link 
                    href={`/${locale}/directory`} 
                    className={styles['mega-menu-all-link']} 
                    onClick={() => setIsListingsOpen(false)}
                  >
                    {t.viewAllDirectory || "View All Directory"}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href={`/${locale}/blog`} className={styles['nav-link']}>
            {t.news || "News & Reviews"}
          </Link>

          <div className={styles['locale-toggle-container']}>
            <button 
              className={`${styles['locale-btn']} ${locale === 'en' ? styles['active'] : ''}`}
              onClick={toggleLocale}
            >
              {locale === 'en' ? 'ES' : 'EN'}
            </button>
          </div>

          {currentUser ? (
            // LOGGED IN STATE
            <>
              <div
                className={styles['nav-link']}
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <div className={styles['nav-link__trigger']}>
                  {t.myAccount || "My Account"}{" "}
                  <span className={`material-symbols-outlined ${styles['nav-link__icon']}`}>
                    expand_more
                  </span>
                </div>
                {isAccountOpen && (
                  <div className={styles['nav-dropdown']}>
                    <Link href={`/${locale}/dashboard`}>{t.profile || "Profile"}</Link>
                    <Link href={`/${locale}/dashboard/favorites`}>{t.favorites || "Favorites"}</Link>
                    <Link href={`/${locale}/dashboard/reviews`}>{t.myReviews || "My Reviews"}</Link>
                    {isBusinessOrAdmin && (
                      <Link href={`/${locale}/dashboard/listings`}>{t.myListings || "My Listings"}</Link>
                    )}
                    <button onClick={() => setIsLogoutModalOpen(true)}>
                      {t.signOut || "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
              <div className={styles['business-signup']}>
                <Link href={submitHref}>{t.submitBusiness || "Submit your Business"}</Link>
              </div>
            </>
          ) : (
            // LOGGED OUT STATE
            <>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={`${styles['nav-link']} ${styles['nav-login-btn']}`}
              >
                {t.login || "Log in"}
              </button>
              <div className={styles['sign-up-button']}>
                <Link href={`/${locale}/register`}>{t.joinCommunity || "Join Community"}</Link>
              </div>
              <div className={styles['business-signup']}>
                <Link href={submitHref}>{t.submitBusiness || "Submit your Business"}</Link>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* MOBILE FLYOUT MENU */}
      <div className={styles['mobile-flyout']}>
        <div
          className={`${styles['flyout-overlay']} ${isMobileOpen ? styles['open'] : ""}`}
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
          className={`${styles['flyout-drawer']} ${isMobileOpen ? styles['open'] : ""}`}
          data-level={mobileLevel}
        >
          <div className={styles['flyout-header']}>
            <Link href={`/${locale}`} className={styles['flyout-brand']} onClick={closeMobileMenu}>
              Cape Coral Directory
            </Link>
            <button className={styles['flyout-close']} onClick={closeMobileMenu}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className={styles['flyout-panels']}>
            {/* LEVEL 1: Main Menu */}
            <section className={`${styles['flyout-panel']} ${styles['panel-1']}`}>
              <ul className={styles['flyout-list']}>
                <li className={styles['flyout-item']}>
                  <button
                    className={`${styles['flyout-link']} ${styles['flyout-link--search']}`}
                    onClick={() => {
                      closeMobileMenu();
                      setIsSearchModalOpen(true);
                    }}
                  >
                    <span>
                      <span className={`material-symbols-outlined ${styles['flyout-icon--search']}`}>
                        search
                      </span>
                      {t.search || "Search"}
                    </span>
                  </button>
                </li>
                <li className={styles['flyout-item']}>
                  <button
                    className={styles['flyout-action']}
                    onClick={() => {
                      setMobileLevel(2);
                      setActiveSubMenu("listings");
                    }}
                  >
                    {t.allListings || "All Listings"}{" "}
                    <span className={`material-symbols-outlined ${styles['flyout-icon']}`}>
                      chevron_right
                    </span>
                  </button>
                </li>
                <li className={styles['flyout-item']}>
                  <Link
                    href={`/${locale}/blog`}
                    className={styles['flyout-link']}
                    onClick={closeMobileMenu}
                  >
                    {t.news || "News & Reviews"}
                  </Link>
                </li>

                {currentUser ? (
                  <li className={styles['flyout-item']}>
                    <button
                      className={styles['flyout-action']}
                      onClick={() => {
                        setMobileLevel(2);
                        setActiveSubMenu("account");
                      }}
                    >
                      {t.myAccount || "My Account"}{" "}
                      <span className={`material-symbols-outlined ${styles['flyout-icon']}`}>
                        chevron_right
                      </span>
                    </button>
                  </li>
                ) : (
                  <li className={styles['flyout-item']}>
                    <button
                      className={styles['flyout-link']}
                      onClick={() => {
                        closeMobileMenu();
                        setIsLoginModalOpen(true);
                      }}
                    >
                      {t.login || "Log in"}
                    </button>
                  </li>
                )}

                <li className={styles['flyout-item']}>
                  <button
                    className={styles['flyout-link']}
                    onClick={toggleLocale}
                  >
                    Language: {locale.toUpperCase() === 'EN' ? 'Spanish (ES)' : 'English (EN)'}
                  </button>
                </li>
              </ul>

              {/* Bottom CTAs */}
              <div className={styles['flyout-cta-wrap']}>
                {!currentUser && (
                  <div className={styles['sign-up-button']}>
                    <Link href={`/${locale}/register`} onClick={closeMobileMenu}>
                      {t.joinCommunity || "Join Community"}
                    </Link>
                  </div>
                )}
                <div className={styles['business-signup']}>
                  <Link href={submitHref} onClick={closeMobileMenu}>
                    {t.submitBusiness || "Submit your Business"}
                  </Link>
                </div>
              </div>
            </section>

            {/* LEVEL 2: Sub Menus */}
            <section className={`${styles['flyout-panel']} ${styles['panel-2']}`}>
              <button className={styles['flyout-back']} onClick={() => setMobileLevel(1)}>
                <span className={`material-symbols-outlined ${styles['flyout-back-icon']}`}>
                  chevron_left
                </span>{" "}
                Back
              </button>

              {activeSubMenu === "listings" && (
                <>
                  <h3 className={styles['flyout-panel-title']}>Categories</h3>
                  <ul className={styles['flyout-list']}>
                    <li className={styles['flyout-item']}>
                      <Link
                        href={`/${locale}/directory`}
                        className={styles['flyout-link']}
                        onClick={closeMobileMenu}
                      >
                        {t.viewAllDirectory || "View All Directory"}
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.slug} className={styles['flyout-item']}>
                        <button
                          className={styles['flyout-action']}
                          onClick={() => {
                            setMobileLevel(3);
                            setActiveCategory(cat);
                          }}
                        >
                          <span className={styles['flyout-category-btn']}>
                            {cat.icon} {cat.title}
                          </span>
                          <span className={`material-symbols-outlined ${styles['flyout-icon']}`}>
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
                  <h3 className={styles['flyout-panel-title']}>Dashboard</h3>
                  <ul className={styles['flyout-list']}>
                    <li className={styles['flyout-item']}>
                      <Link
                        href={`/${locale}/dashboard`}
                        className={styles['flyout-link']}
                        onClick={closeMobileMenu}
                      >
                        {t.profile || "Profile Settings"}
                      </Link>
                    </li>
                    <li className={styles['flyout-item']}>
                      <Link
                        href={`/${locale}/dashboard/favorites`}
                        className={styles['flyout-link']}
                        onClick={closeMobileMenu}
                      >
                        {t.favorites || "Favorite Listings"}
                      </Link>
                    </li>
                    <li className={styles['flyout-item']}>
                      <Link
                        href={`/${locale}/dashboard/reviews`}
                        className={styles['flyout-link']}
                        onClick={closeMobileMenu}
                      >
                        {t.myReviews || "My Reviews"}
                      </Link>
                    </li>
                    {isBusinessOrAdmin && (
                      <li className={styles['flyout-item']}>
                        <Link
                          href={`/${locale}/dashboard/listings`}
                          className={styles['flyout-link']}
                          onClick={closeMobileMenu}
                        >
                          {t.myListings || "My Listings"}
                        </Link>
                      </li>
                    )}
                    <li className={styles['flyout-item']}>
                      <button
                        className={styles['flyout-link']}
                        onClick={() => {
                          closeMobileMenu();
                          setIsLogoutModalOpen(true);
                        }}
                      >
                        {t.signOut || "Sign Out"}
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </section>

            {/* LEVEL 3: Categories */}
            <section className={`${styles['flyout-panel']} ${styles['panel-3']}`}>
              <button className={styles['flyout-back']} onClick={() => setMobileLevel(2)}>
                <span className={`material-symbols-outlined ${styles['flyout-back-icon']}`}>
                  chevron_left
                </span>{" "}
                Back
              </button>

              {activeCategory && (
                <>
                  <h3 className={styles['flyout-panel-title']}>{activeCategory.title}</h3>
                  <ul className={styles['flyout-list']}>
                    {activeCategory.subs.map((sub) => (
                      <li key={sub.slug} className={styles['flyout-item']}>
                        <Link
                          href={`/${locale}/directory/${activeCategory.slug}/${sub.slug}`}
                          className={styles['flyout-link']}
                          onClick={closeMobileMenu}
                        >
                          <span className={styles['flyout-category-btn']}>
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
        dict={dict}
        locale={locale}
      />

      {/* Existing Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        dict={dict}
        locale={locale}
      />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className={styles['logout-modal']}>
          <div className={styles['logout-modal__dialog']}>
            <p className={styles['logout-modal__text']}>
              Are you sure you want to log out?
            </p>
            <div className={styles['logout-modal__actions']}>
              <a
                href={`/${locale}/logout`}
                className={`${styles['logout-modal__button']} ${styles['logout-modal__button--confirm']}`}
              >
                Yes, Log Out
              </a>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className={`${styles['logout-modal__button']} ${styles['logout-modal__button--cancel']}`}
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
