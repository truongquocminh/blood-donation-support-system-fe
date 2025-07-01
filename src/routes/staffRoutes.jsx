import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StaffDashboard = lazy(() => import('../pages/staff/Dashboard'));
const StaffAppointments = lazy(() => import('../pages/staff/Appointments'));
const Donors = lazy(() => import('../pages/staff/Donors'));
const Inventory = lazy(() => import('../pages/staff/Inventory'));
const Reminders = lazy(() => import('../pages/staff/Reminders'));
const BloodRequests = lazy(() => import('../pages/staff/BloodRequests'));

const StaffRoutes = () => {
  return (
    <Layout userType="STAFF">
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="medium" />
        </div>
      }>
        <Routes>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="appointments" element={<StaffAppointments />} />               
          <Route path="donors" element={<Donors />} />               
          <Route path="blood-requests" element={<BloodRequests />} />               
          <Route path="inventories" element={<Inventory />} />               
          <Route path="reminders" element={<Reminders />} />               
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default StaffRoutes;