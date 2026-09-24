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
  return <main className={styles["inline-style-1"]}>
      <div className={styles["inline-style-2"]}>
        <span className={`material-symbols-outlined ${styles["inline-style-3"]}`}>check_circle</span>
        <h1 className={styles["inline-style-4"]}>Submission Successful!</h1>
        <p className={styles["inline-style-5"]}>
          Your business listing has been securely transmitted. It typically takes a few moments for our servers to process your media, optimize your images, and publish the listing to the global directory.
        </p>

        <div className={styles["inline-style-6"]}>
          <div className={styles["inline-style-7"]} />
        </div>

        {progress === 100 ? <div className={styles["inline-style-8"]}>
            <Link href={`/dashboard`} className={styles["inline-style-9"]}>
              Go to Dashboard
            </Link>
            <Link href={``} className={styles["inline-style-10"]}>
              Back to Home
            </Link>
          </div> : <p className={styles["inline-style-11"]}>Processing your listing...</p>}
      </div>
    </main>;
}