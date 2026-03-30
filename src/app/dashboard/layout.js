// src/app/dashboard/layout.js
import Link from 'next/link';
import { getViewer } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PropTypes from 'prop-types';
import Sidebar from '@/components/dashboard/Sidebar';
import './Dashboard.css';

export default async function DashboardLayout({ children }) {
  const viewer = await getViewer();

  // Redundancy check if middleware is bypassed
  if (!viewer) {
    redirect('/login');
  }

  const userRoles = viewer.roles.nodes.map((role) => role.name.toLowerCase());

  return (
    <div className="dashboard-layout">
      <Sidebar userRoles={userRoles} />

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
