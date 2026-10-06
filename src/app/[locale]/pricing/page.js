import React from 'react';
import styles from './page.module.css';
import PricingPackages from '@/components/pricing/PricingPackages';

export const metadata = {
  title: 'Business Pricing Packages - Cape Coral Reviewed',
  description: 'Pricing and packages for Cape Coral businesses to get noticed.',
};

export default function PricingPage() {
  return (
    <main className={styles["pricing-page__main"]}>
      <PricingPackages />
    </main>
  );
}
