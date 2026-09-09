"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation';
import styles from "./AdUnit.module.css";
import PropTypes from "prop-types";

export default function AdUnit({ type = "horizontal", isGridCard = false }) {
  const adRef = useRef(null);
  const pathname = usePathname();
  const [isFilled, setIsFilled] = useState(false);

  // 1. Safe Ad Injection tied to Route Changes
  useEffect(() => {
    if (adRef.current && !adRef.current.getAttribute('data-ad-status')) {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.warn("AdSense error:", err);
      }
    }
  }, [pathname]);

  // 2. Observer for CSS class toggling
  useEffect(() => {
    if (!adRef.current) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-ad-status') {
          const status = adRef.current.getAttribute('data-ad-status');
          if (status === 'filled') setIsFilled(true);
        }
      });
    });
    
    observer.observe(adRef.current, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const getAdConfig = () => {
    switch (type) {
      case "vertical":
        return { "data-ad-slot": "6929580824", "data-ad-format": "auto" };
      case "in-feed":
        return { "data-ad-slot": "2265401331", "data-ad-format": "fluid", "data-ad-layout-key": "-67+dx+w-g4+ep" };
      case "in-article":
        return { "data-ad-slot": "7381996648", "data-ad-format": "fluid", "data-ad-layout": "in-article" };
      case "horizontal":
      default:
        return { "data-ad-slot": "6396218035", "data-ad-format": "auto" };
    }
  };

  const wrapperClasses = [
    styles.wrapper,
    isFilled ? styles['wrapper--filled'] : "",
    isGridCard ? styles['wrapper--gridCard'] : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={wrapperClasses}>
      {isFilled && <span className={styles.label}>{type === 'in-feed' ? 'Sponsored' : 'Advertisement'}</span>}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9224507908532843"
        data-full-width-responsive="true"
        {...getAdConfig()}
      />
    </div>
  );
}

AdUnit.propTypes = {
  type: PropTypes.oneOf(["horizontal", "vertical", "in-feed", "in-article"]),
  isGridCard: PropTypes.bool,
};
