import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const MembersPage = lazy(() => import('../pages/admin/MembersPage'));
const StaffsPage = lazy(() => import('../pages/admin/StaffsPage'));
const BloodDonationsPage = lazy(() => import('../pages/admin/BloodDonationsPage'));
const AppointmentsPage = lazy(() => import('../pages/admin/AppointmentsPage'));
const InventoriesPage = lazy(() => import('../pages/admin/InventoriesPage'));

const AdminRoutes = () => {
  return (
    <Layout userType="ADMIN">
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="medium" />
        </div>
      }>
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users/members" element={<MembersPage />} />
          <Route path="users/staffs" element={<StaffsPage />} />
          <Route path="donations/donation-history" element={<BloodDonationsPage />} />
          <Route path="donations/appointments" element={<AppointmentsPage />} />
          <Route path="donations/inventories" element={<InventoriesPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default AdminRoutes;