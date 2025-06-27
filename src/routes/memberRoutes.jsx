import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const MemberDashboard = lazy(() => import('../pages/member/Dashboard'));
const MemberProfile = lazy(() => import('../pages/member/Profile'));
const MemberDonations = lazy(() => import('../pages/member/Donations'));
const Appointments = lazy(() => import('../pages/member/Appointments'));
const MemberRewards = lazy(() => import('../pages/member/Rewards'));
const Reminders = lazy(() => import('../pages/member/Reminders'));

const MemberRoutes = () => {
  return (
    <Layout userType="MEMBER">
      <Routes>
        <Route path="dashboard" element={<MemberDashboard />} />
        <Route path="profile" element={<MemberProfile />} />
        <Route path="donations" element={<MemberDonations />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="rewards" element={<MemberRewards />} />
      </Routes>
    </Layout>
  );
};

export default MemberRoutes;
