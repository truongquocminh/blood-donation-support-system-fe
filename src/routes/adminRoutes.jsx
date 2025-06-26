import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('../pages/admin/UserManagement'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));

const AdminRoutes = () => {
  return (
    <Layout userType="ADMIN">
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />                
        <Route path="reports" element={<AdminReports />} />
      </Routes>
    </Layout>
  );
};

export default AdminRoutes;
