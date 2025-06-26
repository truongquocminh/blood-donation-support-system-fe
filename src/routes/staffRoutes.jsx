import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const StaffDashboard = lazy(() => import('../pages/staff/Dashboard'));
const StaffAppointments = lazy(() => import('../pages/staff/Appointments'));
const Inventory = lazy(() => import('../pages/staff/Inventory'));

const StaffRoutes = () => {
  return (
    <Layout userType="STAFF">
      <Routes>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="appointments" element={<StaffAppointments />} />               
        <Route path="inventory" element={<Inventory />} />               
      </Routes>
    </Layout>
  );
};

export default StaffRoutes;
