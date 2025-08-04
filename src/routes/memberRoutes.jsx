import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Blog from '../pages/staff/Blog';

const MemberDashboard = lazy(() => import('../pages/member/Dashboard'));
const MemberProfile = lazy(() => import('../pages/member/Profile'));
const MemberDonations = lazy(() => import('../pages/member/Donations'));
const Appointments = lazy(() => import('../pages/member/Appointments'));
const Certificates = lazy(() => import('../pages/member/Rewards'));
const Reminders = lazy(() => import('../pages/member/Reminders'));
const BloodLookupPage = lazy(() => import('../pages/member/BloodLookupPage'));
const HealthCheck = lazy(() => import('../pages/member/HealthCheck'));
const BloodRequests = lazy(() => import('../pages/member/BloodRequests'));

const MemberRoutes = () => {
  return (
    <Layout userType="MEMBER">
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="medium" />
        </div>
      }>
        <Routes>
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="donations" element={<MemberDonations />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="lookup" element={<BloodLookupPage />} />
          <Route path="blood-requests" element={<BloodRequests />} />
          <Route path="health-check" element={<HealthCheck />} />
          <Route path="blogs" element={<Blog />} />
          <Route path="rewards" element={<Certificates />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default MemberRoutes;