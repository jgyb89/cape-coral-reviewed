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
      <header className="profile-settings__header">
        <h1 className="profile-settings__title">Profile Settings</h1>
        <p className="profile-settings__subtitle">
          Update your personal information and manage how your email is displayed on the directory.
        </p>
      </header>
      
      <div className="profile-settings__content">
        <ProfileForm viewer={viewer} />
      </div>
    </div>
  );
}
