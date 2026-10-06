'use client';

import styles from "./page.module.css";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
export default function SubmissionSuccessPage() {
  const params = useParams();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        return old + 2; // Fills to 100% over ~5 seconds
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return <main className={styles["success-page__main"]}>
      <div className={styles["success-page__container"]}>
        <span className={`material-symbols-outlined ${styles["success-page__icon"]}`}>check_circle</span>
        <h1 className={styles["success-page__title"]}>Submission Successful!</h1>
        <p className={styles["success-page__message"]}>
          Your business listing has been securely transmitted. It typically takes a few moments for our servers to process your media, optimize your images, and publish the listing to the global directory.
        </p>

        <div className={styles["success-page__progress-bar-container"]}>
          <div className={styles["success-page__progress-bar-fill"]} />
        </div>

        {progress === 100 ? <div className={styles["success-page__actions"]}>
            <Link href={`/dashboard`} className={styles["success-page__dashboard-link"]}>
              Go to Dashboard
            </Link>
            <Link href={``} className={styles["success-page__home-link"]}>
              Back to Home
            </Link>
          </div> : <p className={styles["success-page__loading-text"]}>Processing your listing...</p>}
      </div>
    </main>;
}