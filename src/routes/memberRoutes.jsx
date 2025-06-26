import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const MemberDashboard = lazy(() => import('../pages/member/Dashboard'));
const MemberProfile = lazy(() => import('../pages/member/Profile'));
const MemberHistory = lazy(() => import('../pages/member/History'));
const MemberRewards = lazy(() => import('../pages/member/Rewards'));

const MemberRoutes = () => {
  return (
    <Layout userType="MEMBER">
      <Routes>
        <Route path="dashboard" element={<MemberDashboard />} />
        <Route path="profile" element={<MemberProfile />} />
        <Route path="history" element={<MemberHistory />} />
        <Route path="rewards" element={<MemberRewards />} />
      </Routes>
    </Layout>
  );
};

export default MemberRoutes;
