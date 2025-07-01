import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES, ROLES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

import AdminRoutes from './adminRoutes';
import MemberRoutes from './memberRoutes';
import StaffRoutes from './staffRoutes';

const Landing = lazy(() => import('../pages/guest/Landing'));
const About = lazy(() => import('../pages/guest/About'));
const Contact = lazy(() => import('../pages/guest/Contact'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

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
        <Route path={ROUTES.HOME}
          element={
            isAuthenticated ?
              <Navigate to={getDefaultRoute()} replace /> :
              <Landing />
          }
        />
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
            // isAuthenticated ?
            //   <Navigate to={getDefaultRoute()} replace /> :
              <Register />
          }
        />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

        <Route path="/member/*" element={<MemberRoutes />} />
        <Route path="/staff/*" element={<StaffRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/server-error" element={<ServerError />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;