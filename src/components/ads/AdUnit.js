'use client';

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation';
import styles from "./AdUnit.module.css";
import PropTypes from "prop-types";

// Track if the app has finished its initial SSR load.
// If a user navigates to a new page after 2 seconds, it's considered a client-side navigation.
let isAppInitialLoad = true;
if (typeof window !== 'undefined') {
  setTimeout(() => {
    isAppInitialLoad = false;
  }, 2000);
}

export default function AdUnit({ type = "horizontal", isGridCard = false, isPlain = false, isSidebarWidget = false }) {
  const adRef = useRef(null);
  const pathname = usePathname();
  const [isFilled, setIsFilled] = useState(false);

  // 1. Safe Ad Injection tied to Route Changes
  useEffect(() => {
    // Reset state on route change so we don't carry over "filled" state from previous pages
    setIsFilled(false);

    let timeoutId;
    
    const pushAd = () => {
      if (adRef.current && !adRef.current.getAttribute('data-ad-status')) {
        try {
          if (typeof window !== 'undefined') {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (err) {
          console.warn("AdSense error:", err);
        }
      }
    };

    if (isAppInitialLoad) {
      // First page load: push immediately so AdSense picks it up during hydration
      pushAd();
    } else {
      // Client-side route transitions: Delay by 250ms to allow Next.js to update <title>
      timeoutId = setTimeout(pushAd, 250);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname]);

  // 2. Observer for CSS class toggling
  useEffect(() => {
    if (!adRef.current) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-ad-status') {
          const status = adRef.current.getAttribute('data-ad-status');
          if (status === 'filled') {
            setIsFilled(true);
          } else if (status === 'unfilled') {
            setIsFilled(false);
          }
        }
      });
    });
    
    observer.observe(adRef.current, { attributes: true });
    return () => observer.disconnect();
  }, [pathname]);

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
    isFilled && !isSidebarWidget ? styles['wrapper--filled'] : "",
    isGridCard ? styles['wrapper--gridCard'] : "",
    isPlain ? styles['wrapper--plain'] : "",
    isFilled && isSidebarWidget ? styles['wrapper--sidebarWidget'] : ""
  ].filter(Boolean).join(" ");

  return (
    <div key={pathname} className={wrapperClasses}>
      {isFilled && !isPlain && <span className={styles.label}>{type === 'in-feed' ? 'Sponsored' : 'Advertisement'}</span>}
      {isFilled && isPlain && <span className={styles.label} style={{ marginBottom: '8px', color: '#888' }}>Advertisement</span>}
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
  isPlain: PropTypes.bool,
  isSidebarWidget: PropTypes.bool,
};
