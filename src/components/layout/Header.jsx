import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Menu, Bell, Search, User, Settings, LogOut,
  ChevronDown, MessageSquare, Shield, Calendar, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import Button from '../ui/Button';
import { SearchInput } from '../ui/Input';

const Header = ({ userType, onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }

    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'ADMIN': return 'Quản trị viên';
      case 'STAFF': return 'Nhân viên';
      case 'MEMBER': return 'Thành viên';
      default: return '';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
              icon={<Menu />}
            />

            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
              <div className="relative">
                <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  BloodConnect
                </span>
                <div className="text-xs text-gray-500">{getUserTypeLabel()}</div>
              </div>
            </div>

            <div className="hidden md:block">
              <p className="text-sm text-gray-600">
                {getGreeting()}, <span className="font-medium text-gray-900">{user?.fullName || 'Người dùng'}</span>
              </p>
            </div>
          </div>

          {/* <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch}>
              <SearchInput
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>
          </div> */}

          <div className="flex items-center space-x-3">
            {/* <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<Calendar />}
                onClick={() => navigate(userType === 'MEMBER' ? ROUTES.MEMBER_APPOINTMENTS : ROUTES.STAFF_APPOINTMENTS)}
              >
                Lịch hẹn
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<MessageSquare />}
                onClick={() => console.log('Open chat')}
              >
                Hỗ trợ
              </Button>
            </div> */}



            <div className="relative" ref={profileMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    <p>{user?.fullName}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user?.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getUserTypeLabel()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {[
                      {
                        icon: User,
                        label: 'Hồ sơ cá nhân',
                        onClick: () => navigate(userType === 'MEMBER' ? ROUTES.MEMBER_PROFILE : '/profile')
                      },
                      // {
                      //   icon: Settings,
                      //   label: 'Cài đặt',
                      //   onClick: () => console.log('Settings')
                      // },
                      // {
                      //   icon: Shield,
                      //   label: 'Bảo mật',
                      //   onClick: () => console.log('Security')
                      // },
                      // {
                      //   icon: HelpCircle,
                      //   label: 'Trợ giúp',
                      //   onClick: () => console.log('Help')
                      // }
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;