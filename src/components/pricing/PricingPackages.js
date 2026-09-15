"use client";

import React, { useState, useEffect } from "react";
import styles from "./PricingPackages.module.css";
import {
  Megaphone,
  Mail,
  Share2,
  Star,
  BookOpen,
  Users,
  Video,
  Camera,
  CalendarDays,
  Newspaper,
} from "lucide-react";

export default function PricingPackages() {
  const [openModal, setOpenModal] = useState(null);

  const handleClose = () => setOpenModal(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    
    if (openModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openModal]);


  return (
    <div className={styles.wrapper}>
      {/* Animated section */}
      <section className={styles.pricingSection}>
        {/* Wave Background */}
        <div className={styles.ocean}>
          <div className={styles.wave}></div>
          <div className={styles.wave}></div>
        </div>

        <div className={styles.container}>
          <div className={styles.header}>
            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: "2.5rem",
                color: "#ffffff",
              }}
            >
              Business Pricing Packages
            </h2>
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#ffffff",
                margin: 0,
              }}
            >
              Helping Cape Coral Businesses Get Noticed.
            </p>
          </div>

          <div className={styles.gridWrapper}>
            <div className={styles.grid}>
              {/* Card 1: Local Starter */}
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <h3>Local Starter</h3>
                  <p className={styles.description}>
                    Perfect for small businesses looking for an affordable
                    introduction to the Cape Coral Reviewed audience.
                  </p>
                  <div className={styles.priceSection}>
                    <div className={styles.priceValue}>
                      $99{" "}
                      <span
                        style={{
                          fontSize: "1.2rem",
                        }}
                      >
                        Flat Fee
                      </span>
                    </div>
                  </div>
                  <div className={styles.includesHeader}>Includes:</div>
                  <ul className={styles.featuresList}>
                    <li>Brief on-location filming session</li>
                    <li>Article Highlight</li>
                    <li>Website feature on Cape Coral Reviewed</li>
                    <li>One edited short-form reel</li>
                    <li>
                      Social media promotion across selected CCR platforms
                    </li>
                    <li>Newsletter feature</li>
                    <li>Business Directory Listing</li>
                  </ul>
                  <button
                    className={styles.moreDetailsBtn}
                    onClick={() => setOpenModal("starter")}
                  >
                    More Details
                  </button>
                </div>
              </div>

              {/* Card 2: Local Growth */}
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <h3>Local Growth</h3>
                  <p className={styles.description}>
                    Designed for businesses ready to tell a more complete story
                    and build stronger local visibility.
                  </p>
                  <div className={styles.priceSection}>
                    <div className={styles.priceValue}>
                      $250{" "}
                      <span
                        style={{
                          fontSize: "1.2rem",
                        }}
                      >
                        Flat Fee
                      </span>
                    </div>
                  </div>
                  <div className={styles.includesHeader}>
                    Includes everything in Local Starter, plus:
                  </div>
                  <ul className={styles.featuresList}>
                    <li>Extended on-location filming session</li>
                    <li>Premium Business Article</li>
                    <li>Long-form YouTube video</li>
                    <li>Additional social media highlights</li>
                    <li>Premium Business Directory Listing</li>
                    <li>CCR Featured Business badge</li>
                  </ul>
                  <button
                    className={styles.moreDetailsBtn}
                    onClick={() => setOpenModal("growth")}
                  >
                    More Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services Section (White Background) */}
      <section className={styles.additionalSectionWrapper}>
        <div className={styles.container}>
          <div className={styles.additionalServices}>
            <h2>Additional Services</h2>
            <p className={styles.subText}>
              Individual services available to fit your business&apos;s needs.
            </p>
            <div className={styles.twoColumnServices}>
              {/* Left Column: Monthly Visibility */}
              <div className={styles.serviceColumn}>
                <div className={styles.serviceColumnHeader}>
                  <h3>Monthly Visibility</h3>
                  <span className={styles.servicePrice}>$99 / Month</span>
                </div>
                <ul className={styles.blurbList}>
                  <li>
                    <Megaphone size={20} className={styles.blurbIcon} />
                    <span>
                      One monthly business update or promotional feature
                    </span>
                  </li>
                  <li>
                    <Mail size={20} className={styles.blurbIcon} />
                    <span>Monthly newsletter mention</span>
                  </li>
                  <li>
                    <Share2 size={20} className={styles.blurbIcon} />
                    <span>
                      Selected reshares of business news, events, specials, or
                      announcements
                    </span>
                  </li>
                  <li>
                    <Star size={20} className={styles.blurbIcon} />
                    <span>
                      Priority placement within the CCR Business Directory
                    </span>
                  </li>
                  <li>
                    <BookOpen size={20} className={styles.blurbIcon} />
                    <span>
                      Consideration for relevant guides, roundups, and seasonal
                      content
                    </span>
                  </li>
                  <li>
                    <Users size={20} className={styles.blurbIcon} />
                    <span>
                      Priority notification of sponsorships, collaborations, and
                      networking opportunities
                    </span>
                  </li>
                </ul>
              </div>

              {/* Right Column: A La Carte Services */}
              <div className={styles.serviceColumn}>
                <div className={styles.serviceColumnHeader}>
                  <h3>More Services</h3>
                  <span className={styles.servicePrice}>Starting Prices</span>
                </div>
                <ul className={styles.blurbList}>
                  <li>
                    <Video size={20} className={styles.blurbIcon} />
                    <div>
                      <strong>Additional edited short-form reel</strong>
                      <div className={styles.blurbPrice}>$175</div>
                    </div>
                  </li>
                  <li>
                    <Camera size={20} className={styles.blurbIcon} />
                    <div>
                      <strong>Additional Content Session + Edited Reel</strong>
                      <div className={styles.blurbPrice}>Starting at $250</div>
                    </div>
                  </li>
                  <li>
                    <CalendarDays size={20} className={styles.blurbIcon} />
                    <div>
                      <strong>Event coverage and recap reel</strong>
                      <div className={styles.blurbPrice}>Starting at $175</div>
                    </div>
                  </li>
                  <li>
                    <Newspaper size={20} className={styles.blurbIcon} />
                    <div>
                      <strong>Additional Article & Newsletter Spotlight</strong>
                      <div className={styles.blurbPrice}>Starting at $125</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.footerNote}>
            Your Business. Your Community. Your Spotlight.
          </div>
        </div>
      </section>

      {/* Modals */}
      {openModal === "starter" && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Local Starter Includes:</h3>
              <button className={styles.modalClose} onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <ul className={styles.breakdownList}>
                <li>
                  <strong>Article Highlight</strong> — An editorial feature
                  highlighting your business, products, and services customers
                  can expect.
                </li>
                <li>
                  <strong>Website Feature</strong> — A featured placement on
                  Cape Coral Reviewed designed to give the business additional
                  visibility.
                </li>
                <li>
                  <strong>Newsletter Feature</strong> — The business will be
                  included in our newsletter, with the opportunity to provide
                  its own wording or call to action.
                </li>
                <li>
                  <strong>Business Directory Listing</strong> — A listing in the
                  Cape Coral Reviewed business directory to help locals discover
                  the business.
                </li>
                <li>
                  <strong>Social Media Promotion</strong> — Business-focused
                  content shared across selected Cape Coral Reviewed social
                  platforms.
                </li>
                <li>
                  <strong>Short-Form Reel</strong> — One edited short-form video
                  highlighting the business, posted across selected social
                  platforms.
                </li>
                <li>
                  <strong>On-Location Filming</strong> — A brief filming session
                  at the business to capture content for the included
                  promotional materials.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {openModal === "monthly" && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Monthly Visibility Includes:</h3>
              <button className={styles.modalClose} onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <ul className={styles.breakdownList}>
                <li>One monthly business update or promotional feature</li>
                <li>Monthly newsletter mention</li>
                <li>
                  Selected reshares of business news, events, specials, or
                  announcements
                </li>
                <li>Priority placement within the CCR Business Directory</li>
                <li>
                  Consideration for relevant guides, roundups, and seasonal
                  content
                </li>
                <li>
                  Priority notification of sponsorships, collaborations, and
                  networking opportunities
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {openModal === "growth" && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Local Growth includes everything in Local Starter, plus:</h3>
              <button className={styles.modalClose} onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <ul className={styles.breakdownList}>
                <li>
                  <strong>Extended On-Location Filming</strong> — A longer
                  filming session designed to capture additional content and
                  give the business a more comprehensive feature.
                </li>
                <li>
                  <strong>Premium Business Article</strong> — A more in-depth
                  feature highlighting the business, its story, the experience,
                  or what makes it unique.
                </li>
                <li>
                  <strong>Long-Form YouTube Business Spotlight</strong> — A
                  complete video review or business spotlight published on
                  YouTube.
                </li>
                <li>
                  <strong>Additional Social Media Highlights</strong> —
                  Additional business-focused content shared across Facebook,
                  Instagram & TikTok.
                </li>
                <li>
                  <strong>Premium Directory Listing</strong> — An enhanced
                  placement in the Cape Coral Reviewed business directory
                  designed to provide increased visibility.
                </li>
                <li>
                  <strong>Featured Business Badge</strong> — A badge recognizing
                  the business as a featured Cape Coral Reviewed business.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
