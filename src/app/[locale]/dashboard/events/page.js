import React from 'react';
import styles from './page.module.css';
import MyEvents from '@/components/dashboard/MyEvents';

export default async function MyEventsPage({ params }) {
  const { locale } = await params;
  return (
    <div className={styles["dashboard-events__main"]}>
      <MyEvents locale={locale} />
    </div>
  );
}
