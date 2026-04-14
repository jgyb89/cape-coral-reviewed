// src/app/dashboard/page.js
import { getViewer } from '@/lib/auth';
import ProfileForm from '@/components/dashboard/ProfileForm';

export const metadata = {
  title: 'Profile Settings | Dashboard',
};

export default async function DashboardPage() {
  const viewer = await getViewer();

  // Handle cases where viewer might be null (though layout should catch it)
  if (!viewer) {
    return (
      <div className="profile-settings">
        <h1 className="profile-settings__title">Profile Settings</h1>
        <p className="profile-settings__error">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="profile-settings">
      <header style={{ marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>Profile Settings</h1>
        <p style={{ margin: 0 }}>
          Update your personal information and manage how your email is displayed on the directory.
        </p>
      </header>
      
      <div className="profile-settings__content">
        <ProfileForm viewer={viewer} />
      </div>
    </div>
  );
}
