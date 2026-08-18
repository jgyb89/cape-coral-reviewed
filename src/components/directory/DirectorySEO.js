"use client";

import React, { useRef } from 'react';
import useBreezeAnimation from '@/hooks/useBreezeAnimation';
import AnimatedLinesSvg from '@/components/ui/AnimatedLinesSvg';
import styles from './DirectorySEO.module.css';

export default function DirectorySEO({ directoryType }) {
  const sectionRef = useRef(null);

  useBreezeAnimation(sectionRef);

  let seoData = null;

  switch (directoryType) {
    case 'food-drink':
      seoData = {
        title: "The Best Restaurants in Cape Coral, Florida",
        text: "Looking for the best restaurants in Cape Coral, Florida? Whether you're craving waterfront seafood dining at Tarpon Point, hidden Italian gems along Del Prado Boulevard, or the perfect Sunday brunch spot near Cape Harbour, our local dining guide has you covered. Cape Coral's culinary scene is a vibrant mix of fresh Gulf seafood, authentic international cuisine, and laid-back sports bars. As Southwest Florida continues to grow, so does our incredible selection of local eateries. Use Cape Coral Reviewed to discover top-rated spots for a romantic date night, family-friendly dining, or a quick bite after a day out on the Caloosahatchee River. Browse our comprehensive list of locally-owned cafes, bakeries, and fine dining establishments. Read authentic reviews from fellow Cape Coral residents to find out who serves the best fish tacos, the most refreshing craft cocktails, and the friendliest service in town. Skip the national chains and support the local chefs and business owners who make our community's food scene so unique!"
      };
      break;
    case 'home-local-services':
      seoData = {
        title: "Trusted Home & Local Services in Cape Coral",
        text: "Finding a reliable contractor in Cape Coral doesn't have to be a guessing game. Whether you need a trusted roofer to prepare for Southwest Florida's hurricane season, an expert pool maintenance company, or emergency AC repair in the dead of summer, Cape Coral Reviewed connects you with top-rated local professionals. Our Home & Local Services directory is built to help homeowners navigate the unique challenges of living in a canal-front city. Discover verified local plumbers, electricians, landscapers, and general contractors who understand the specific needs of Cape Coral properties. Don't rely on anonymous online searches when hiring someone to work on your biggest investment. Read reviews from your neighbors, compare services, and find fully licensed and insured experts right here in Lee County. By choosing locally vetted service providers, you ensure fast response times, community accountability, and high-quality workmanship. Explore our listings to find the right professional for your next home improvement project."
      };
      break;
    case 'retail-shopping':
      seoData = {
        title: "Explore Retail & Shopping in Cape Coral",
        text: "While big-box stores have their place, the true character of Cape Coral, Florida, is found in its vibrant community of locally-owned boutiques, specialty shops, and independent retailers. Whether you are hunting for unique coastal home decor, fashionable boutique clothing, handmade gifts, or specialized sporting goods for a weekend on the water, our guide connects you with the best storefronts in the city. Our platform is designed to make shopping local easier and more rewarding. By browsing our comprehensive retail directory, you can uncover hidden gems tucked away in local strip malls or down bustling main streets like Cape Coral Parkway. Read authentic reviews from fellow shoppers to find out who offers the best customer service, the most unique inventory, and the fairest prices. When you choose to shop locally, you are keeping money right here in the Southwest Florida economy and supporting the entrepreneurs who make our community unique. Skip the generic online retailers and start exploring the incredible Retail & Shopping options Cape Coral has to offer."
      };
      break;
    case 'health-wellness':
      seoData = {
        title: "Cape Coral Health & Wellness Professionals",
        text: "Prioritizing your well-being is easy with Cape Coral's growing network of health and wellness professionals. From state-of-the-art dental clinics and trusted pediatricians to relaxing day spas and specialized fitness centers, Cape Coral Reviewed helps you find the care you deserve. Navigating your family's healthcare or finding the perfect self-care retreat can be overwhelming, but our locally curated directory takes the stress out of the search. Explore top-rated chiropractors, physical therapists, boutique gyms, and beauty salons located right here in Cape Coral. Read real experiences from local residents to help you choose the right provider for your specific needs, whether you're looking for an intensive personal trainer, a holistic wellness center, or a highly recommended family doctor. Investing in your health means finding professionals you can trust. Browse our Health & Wellness listings to discover the highest-rated experts dedicated to keeping the Cape Coral community healthy, active, and thriving."
      };
      break;
    default:
      return null;
  }

  if (!seoData) return null;

  return (
    <section ref={sectionRef} className={styles.section}>
      <AnimatedLinesSvg className={styles.svgLines} />
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h2 className={`${styles.seoHeading} breeze-text`}>{seoData.title}</h2>
          <p className={`${styles.seoText} breeze-text`}>{seoData.text}</p>
        </div>
      </div>
    </section>
  );
}
