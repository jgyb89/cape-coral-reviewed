"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./AdUnit.module.css";
import PropTypes from "prop-types";

const AdUnit = ({ type = "horizontal" }) => {
  const adRef = useRef(null);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  useEffect(() => {
    if (!adRef.current) return;
    
    // Observe the <ins> tag for AdSense injecting 'data-ad-status'
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-ad-status') {
          const status = adRef.current.getAttribute('data-ad-status');
          if (status === 'filled') {
            setIsFilled(true);
          }
        }
      });
    });

    observer.observe(adRef.current, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const renderAd = () => {
    const commonProps = {
      className: "adsbygoogle",
      style: { display: "block" },
      "data-ad-client": "ca-pub-9224507908532843",
      ref: adRef,
    };

    switch (type) {
      case "horizontal":
        return (
          <ins
            {...commonProps}
            data-ad-slot="6396218035"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        );
      case "vertical":
        return (
          <ins
            {...commonProps}
            data-ad-slot="6929580824"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        );
      case "in-feed":
        return (
          <ins
            {...commonProps}
            data-ad-slot="2265401331"
            data-ad-format="fluid"
            data-ad-layout-key="-67+dx+w-g4+ep"
          />
        );
      case "in-article":
        return (
          <ins
            {...commonProps}
            data-ad-slot="7381996648"
            data-ad-format="fluid"
            data-ad-layout="in-article"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.wrapper} ${isFilled ? styles["wrapper--filled"] : ""}`}>
      {isFilled && <span className={styles.label}>Advertisement</span>}
      {renderAd()}
    </div>
  );
};

AdUnit.propTypes = {
  type: PropTypes.oneOf(["horizontal", "vertical", "in-feed", "in-article"]),
};

export default AdUnit;
