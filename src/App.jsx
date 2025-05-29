import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

import AppRouter from './routes/AppRouter';

import LoadingSpinner from './components/common/LoadingSpinner';
import ScrollToTop from './components/common/ScrollToTop';

import './styles/index.css';

function App() {
  const { user, loading: authLoading, initializeAuth } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      <ScrollToTop />
      
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        }
      >
        <AppRouter />
      </Suspense>
    </div>
  );
}

export default App;