import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X, Home, Calendar, User, Award, History, Users,
  BarChart3, Settings, FileText, MapPin, Package,
  Heart, Shield, Database, ChevronDown, ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const Sidebar = ({ userType, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const getNavigationItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: 'Trang chủ',
        path: ROUTES.HOME,
        badge: null
      }
    ];

    switch (userType) {
      case 'ADMIN':
        return [
          ...baseItems,
          {
            icon: BarChart3,
            label: 'Dashboard',
            path: ROUTES.ADMIN_DASHBOARD,
            badge: null
          },
          {
            icon: Users,
            label: 'Quản lý người dùng',
            path: ROUTES.ADMIN_USERS,
            children: [
              { label: 'Thành viên', path: ROUTES.ADMIN_USERS + '/members' },
              { label: 'Nhân viên', path: ROUTES.ADMIN_STAFF },
              { label: 'Quản trị viên', path: ROUTES.ADMIN_USERS + '/admins' }
            ]
          },
          {
            icon: Heart,
            label: 'Quản lý hiến máu',
            path: ROUTES.ADMIN_DONATIONS,
            children: [
              { label: 'Lịch sử hiến máu', path: ROUTES.ADMIN_DONATIONS + '/history' },
              { label: 'Lịch hẹn', path: ROUTES.ADMIN_DONATIONS + '/appointments' },
              { label: 'Kho máu', path: ROUTES.ADMIN_DONATIONS + '/inventories' }
            ]
          },
          {
            icon: MapPin,
            label: 'Điểm hiến máu',
            path: ROUTES.ADMIN_LOCATIONS,
            badge: null
          },
          {
            icon: FileText,
            label: 'Báo cáo',
            path: ROUTES.ADMIN_REPORTS,
            children: [
              { label: 'Báo cáo tổng quan', path: ROUTES.ADMIN_REPORTS + '/overview' },
              { label: 'Báo cáo hiến máu', path: ROUTES.ADMIN_REPORTS + '/donations' },
              { label: 'Báo cáo người dùng', path: ROUTES.ADMIN_REPORTS + '/users' }
            ]
          },
          {
            icon: Settings,
            label: 'Cài đặt hệ thống',
            path: ROUTES.ADMIN_SETTINGS,
            badge: null
          }
        ];

      case 'STAFF':
        return [
          ...baseItems,
          {
            icon: BarChart3,
            label: 'Dashboard',
            path: ROUTES.STAFF_DASHBOARD,
            badge: null
          },
          {
            icon: Calendar,
            label: 'Lịch hẹn',
            path: ROUTES.STAFF_APPOINTMENTS,
            badge: 5
          },
          // {
          //   icon: Heart,
          //   label: 'Hiến máu',
          //   path: ROUTES.STAFF_DONATIONS,
          //   children: [
          //     { label: 'Quy trình hiến máu', path: ROUTES.STAFF_DONATIONS + '/process' },
          //     { label: 'Lịch sử', path: ROUTES.STAFF_DONATIONS + '/history' }
          //   ]
          // },
          {
            icon: Users,
            label: 'Người hiến máu',
            path: ROUTES.STAFF_DONORS,
            badge: null
          },
          {
            icon: Package,
            label: 'Kho máu',
            path: ROUTES.STAFF_INVENTORIES,
            badge: null
          },
          {
            icon: History,
            label: 'Nhắc nhở',
            path: ROUTES.STAFF_REMINDERS,
            badge: null
          },
          {
            icon: FileText,
            label: 'Báo cáo',
            path: '/staff/reports',
            badge: null
          }
        ];

      case 'MEMBER':
        return [
          ...baseItems,
          {
            icon: BarChart3,
            label: 'Dashboard',
            path: ROUTES.MEMBER_DASHBOARD,
            badge: null
          },
          {
            icon: User,
            label: 'Hồ sơ cá nhân',
            path: ROUTES.MEMBER_PROFILE,
            badge: null
          },
          {
            icon: Heart,
            label: 'Hiến máu',
            path: ROUTES.MEMBER_DONATIONS,
            badge: null
          },
          {
            icon: Calendar,
            label: 'Lịch hẹn',
            path: ROUTES.MEMBER_APPOINTMENTS,
            badge: 2
          },
          {
            icon: History,
            label: 'Nhắc nhở',
            path: ROUTES.MEMBER_REMINDERS,
            badge: null
          },
          {
            icon: Award,
            label: 'Phần thưởng',
            path: ROUTES.MEMBER_REWARDS,
            badge: 3
          },
          {
            icon: FileText,
            label: 'Chứng nhận',
            path: '/member/certificates',
            badge: null
          }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const SidebarItem = ({ item, index }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections[index];
    const active = isActive(item.path);

    return (
      <div className="mb-1">
        <div
          className={cn(
            'flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors',
            active
              ? 'bg-red-100 text-red-700 border-r-2 border-red-500'
              : 'text-gray-700 hover:bg-gray-100'
          )}
          onClick={() => hasChildren ? toggleSection(index) : handleNavigation(item.path)}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={cn('w-5 h-5', active ? 'text-red-600' : 'text-gray-500')} />
            <span className="font-medium">{item.label}</span>
          </div>

          <div className="flex items-center space-x-2">
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <div className={cn('transition-transform', isExpanded ? 'rotate-90' : '')}>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-8 mt-2 space-y-1">
            {item.children.map((child, childIndex) => (
              <div
                key={childIndex}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm',
                  isActive(child.path)
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
                onClick={() => handleNavigation(child.path)}
              >
                <div className="w-2 h-2 rounded-full bg-gray-300 mr-3" />
                {child.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={cn(
        'fixed left-0 top-16 bottom-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {navigationItems.map((item, index) => (
            <SidebarItem key={index} item={item} index={index} />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
              <span className="text-sm font-medium text-gray-900">
                Cần hỗ trợ?
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Liên hệ với chúng tôi để được hỗ trợ tốt nhất
            </p>
            <button className="w-full bg-red-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-red-600 transition-colors">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;