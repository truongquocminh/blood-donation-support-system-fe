import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '../../utils/helpers';

const Layout = ({ children, userType = 'member' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userType={userType}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex h-screen pt-16">
        <Sidebar 
          userType={userType}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={cn(
          'flex-1 overflow-y-auto transition-all duration-300',
          'lg:ml-64'
        )}>
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </main>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;