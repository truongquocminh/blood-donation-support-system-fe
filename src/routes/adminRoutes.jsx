import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('../pages/admin/UserManagement'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));

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
          <Route path="users" element={<AdminUsers />} />                
          <Route path="reports" element={<AdminReports />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default AdminRoutes;