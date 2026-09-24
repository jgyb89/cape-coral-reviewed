import styles from "./page.module.css";
import React from 'react';
import EventWizard from '@/components/events/EventWizard';
import { getViewer } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
export default async function SubmitEventPage() {
  // 1. Explicitly check for the auth cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) {
    redirect(`/login`);
  }

  // 2. Fetch the viewer data
  const viewer = await getViewer();
  if (!viewer) {
    redirect(`/login`);
  }
  return <main className={styles["inline-style-1"]}>
      <h1 className={styles["inline-style-2"]}>
        Submit a New Event
      </h1>
      <EventWizard />
    </main>;
}