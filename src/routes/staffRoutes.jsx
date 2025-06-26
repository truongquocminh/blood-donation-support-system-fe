import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const StaffDashboard = lazy(() => import('../pages/staff/Dashboard'));
const StaffAppointments = lazy(() => import('../pages/staff/Appointments'));
const Donors = lazy(() => import('../pages/staff/Donors'));
const Inventory = lazy(() => import('../pages/staff/Inventory'));
const Reminders = lazy(() => import('../pages/staff/Reminders'));

const StaffRoutes = () => {
  return (
    <Layout userType="STAFF">
      <Routes>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="appointments" element={<StaffAppointments />} />               
        <Route path="donors" element={<Donors />} />               
        <Route path="inventories" element={<Inventory />} />               
        <Route path="reminders" element={<Reminders />} />               
      </Routes>
    </Layout>
  );
};

export default StaffRoutes;
