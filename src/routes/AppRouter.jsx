import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Layout from '../components/layout/Layout';

import { ROUTES, ROLES } from '../utils/constants';

import { useAuth } from '../hooks/useAuth';

const Landing = lazy(() => import('../pages/guest/Landing'));
const About = lazy(() => import('../pages/guest/About'));
const Contact = lazy(() => import('../pages/guest/Contact'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

const MemberDashboard = lazy(() => import('../pages/member/Dashboard'));
const MemberProfile = lazy(() => import('../pages/member/Profile'));
const MemberHistory = lazy(() => import('../pages/member/History'));
const MemberRewards = lazy(() => import('../pages/member/Rewards'));

const StaffDashboard = lazy(() => import('../pages/staff/Dashboard'));
const StaffAppointments = lazy(() => import('../pages/staff/Appointments'));

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('../pages/admin/UserManagement'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));

const NotFound = lazy(() => import('../pages/error/NotFound'));
const Unauthorized = lazy(() => import('../pages/error/Unauthorized'));
const ServerError = lazy(() => import('../pages/error/ServerError'));

const AppRouter = () => {
  const { user, isAuthenticated } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return ROUTES.HOME;
    
    switch (user?.role) {
      case ROLES.ADMIN:
        return ROUTES.ADMIN_DASHBOARD;
      case ROLES.STAFF:
        return ROUTES.STAFF_DASHBOARD;
      case ROLES.MEMBER:
        return ROUTES.MEMBER_DASHBOARD;
      default:
        return ROUTES.HOME;
    }
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    }>
      <Routes>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        
        <Route 
          path={ROUTES.LOGIN} 
          element={
            isAuthenticated ? 
            <Navigate to={getDefaultRoute()} replace /> : 
            <Login />
          } 
        />
        <Route 
          path={ROUTES.REGISTER} 
          element={
            isAuthenticated ? 
            <Navigate to={getDefaultRoute()} replace /> : 
            <Register />
          } 
        />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

        <Route 
          path="/member/*" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN]}>
              <Layout userType="MEMBER">
                <Routes>
                  <Route index element={<Navigate to={ROUTES.MEMBER_DASHBOARD} replace />} />
                  <Route path="dashboard" element={<MemberDashboard />} />
                  <Route path="profile" element={<MemberProfile />} />
                  <Route path="history" element={<MemberHistory />} />
                  <Route path="rewards" element={<MemberRewards />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/staff/*" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
              <Layout userType="STAFF">
                <Routes>
                  <Route index element={<Navigate to={ROUTES.STAFF_DASHBOARD} replace />} />
                  <Route path="dashboard" element={<StaffDashboard />} />
                  <Route path="appointments" element={<StaffAppointments />} />               
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout userType="ADMIN">
                <Routes>
                  <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />                
                  <Route path="reports" element={<AdminReports />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/server-error" element={<ServerError />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;