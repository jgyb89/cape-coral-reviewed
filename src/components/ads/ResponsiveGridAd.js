"use client";

import React from "react";
import PropTypes from "prop-types";
import AdUnit from "./AdUnit";

export default function ResponsiveGridAd({ index, deviceType }) {
  // Mobile Ads: After 3rd item (index 2) and 9th item (index 8)
  if (deviceType === 'mobile' && (index === 2 || index === 8)) {
    return <AdUnit type="in-feed" isGridCard={true} />;
  }

  // Tablet Ads: After 2nd item (index 1) and 8th item (index 7) spanning both columns
  if (deviceType === 'tablet' && (index === 1 || index === 7)) {
    return (
      <div style={{ gridColumn: '1 / -1', width: '100%' }}>
        <AdUnit type="horizontal" />
      </div>
    );
  }

  return null;
}

ResponsiveGridAd.propTypes = {
  index: PropTypes.number.isRequired,
  deviceType: PropTypes.oneOf(['mobile', 'tablet', 'desktop']).isRequired,
};
