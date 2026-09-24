import styles from "./page.module.css";
import React from 'react';
import ListingWizard from '@/components/directory-builder/ListingWizard';
import { getViewer } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
export default async function SubmitListingPage() {
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
  const userRoles = viewer.roles?.nodes?.map(role => role.name.toLowerCase()) || [];
  if (!userRoles.includes('business') && !userRoles.includes('administrator')) {
    redirect('/user-to-business');
  }
  return <main className={styles["inline-style-1"]}>
      <h1 className={styles["inline-style-2"]}>
        Submit Your Business
      </h1>
      <ListingWizard />
    </main>;
}