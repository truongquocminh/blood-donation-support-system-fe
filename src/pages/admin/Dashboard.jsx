import React, { useState } from 'react';
import { 
  Users, Heart, TrendingUp, AlertTriangle, Calendar, MapPin, 
  BarChart3, PieChart, Activity, Clock, Shield, Award, 
  ArrowUp, ArrowDown, Eye, Download, Filter, RefreshCw
} from 'lucide-react';
import { StatsCard } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = {
    totalUsers: 15234,
    totalDonations: 3456,
    activeAppointments: 89,
    criticalBloodTypes: 5,
    monthlyGrowth: 12.5,
    todayDonations: 23,
    emergencyRequests: 3,
    availableStaff: 45
  };

  const bloodInventory = [
    { type: 'O+', current: 45, required: 60, status: 'low', change: -5 },
    { type: 'O-', current: 12, required: 25, status: 'critical', change: -2 },
    { type: 'A+', current: 78, required: 50, status: 'good', change: +8 },
    { type: 'A-', current: 23, required: 30, status: 'low', change: +3 },
    { type: 'B+', current: 56, required: 40, status: 'good', change: +5 },
    { type: 'B-', current: 18, required: 20, status: 'low', change: +2 },
    { type: 'AB+', current: 34, required: 25, status: 'good', change: +4 },
    { type: 'AB-', current: 8, required: 15, status: 'critical', change: -1 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'donation',
      message: 'Nguyễn Văn A đã hoàn thành hiến máu',
      location: 'Bệnh viện Chợ Rẫy',
      time: '5 phút trước',
      status: 'success'
    },
    {
      id: 2,
      type: 'appointment',
      message: 'Lịch hẹn mới được đặt cho ngày mai',
      location: 'Trung tâm Y tế Quận 1',
      time: '12 phút trước',
      status: 'info'
    },
    {
      id: 3,
      type: 'emergency',
      message: 'Yêu cầu máu khẩn cấp - O- cần 3 đơn vị',
      location: 'Bệnh viện Nhi Đồng',
      time: '18 phút trước',
      status: 'urgent'
    },
    {
      id: 4,
      type: 'user',
      message: 'Thành viên mới đăng ký tài khoản',
      location: 'Hệ thống',
      time: '25 phút trước',
      status: 'info'
    },
    {
      id: 5,
      type: 'staff',
      message: 'Nhân viên Trần Thị B bắt đầu ca làm việc',
      location: 'Trung tâm Huyết học',
      time: '35 phút trước',
      status: 'success'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      donor: 'Nguyễn Văn C',
      time: '09:00',
      type: 'Máu toàn phần',
      bloodType: 'O+',
      location: 'Bệnh viện Chợ Rẫy',
      status: 'confirmed'
    },
    {
      id: 2,
      donor: 'Trần Thị D',
      time: '09:30',
      type: 'Tiểu cầu',
      bloodType: 'A-',
      location: 'Trung tâm Y tế Q1',
      status: 'confirmed'
    },
    {
      id: 3,
      donor: 'Lê Văn E',
      time: '10:00',
      type: 'Máu toàn phần',
      bloodType: 'B+',
      location: 'Bệnh viện Từ Dũ',
      status: 'pending'
    },
    {
      id: 4,
      donor: 'Phạm Thị F',
      time: '10:30',
      type: 'Huyết tương',
      bloodType: 'AB+',
      location: 'Bệnh viện Chợ Rẫy',
      status: 'confirmed'
    }
  ];

  const topLocations = [
    { name: 'Bệnh viện Chợ Rẫy', donations: 234, change: +12 },
    { name: 'Trung tâm Y tế Quận 1', donations: 189, change: +8 },
    { name: 'Bệnh viện Từ Dũ', donations: 156, change: +15 },
    { name: 'Trung tâm Huyết học', donations: 134, change: -5 },
    { name: 'Bệnh viện Nhi Đồng', donations: 98, change: +7 }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'good': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'donation': return Heart;
      case 'appointment': return Calendar;
      case 'emergency': return AlertTriangle;
      case 'user': return Users;
      case 'staff': return Shield;
      default: return Activity;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Quản trị</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống hiến máu</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Thời gian:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="1d">24 giờ qua</option>
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="90d">3 tháng qua</option>
            </select>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={isRefreshing}
            icon={<RefreshCw />}
          >
            Làm mới
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            icon={<Download />}
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          title="Tổng người dùng"
          value={stats.totalUsers.toLocaleString()}
          change={`+${stats.monthlyGrowth}% tháng này`}
          trend="up"
        />
        <StatsCard
          icon={Heart}
          title="Tổng lần hiến máu"
          value={stats.totalDonations.toLocaleString()}
          change={`${stats.todayDonations} hôm nay`}
          trend="up"
        />
        <StatsCard
          icon={Calendar}
          title="Lịch hẹn đang chờ"
          value={stats.activeAppointments}
          change="12 hôm nay"
          trend="up"
        />
        <StatsCard
          icon={AlertTriangle}
          title="Yêu cầu khẩn cấp"
          value={stats.emergencyRequests}
          change="Cần xử lý ngay"
          trend="down"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 text-red-500 mr-2" />
                Tồn kho máu theo nhóm
              </h2>
              <Button variant="ghost" size="sm" icon={<Eye />}>
                Chi tiết
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bloodInventory.map((blood) => (
                <div key={blood.type} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">{blood.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blood.status)}`}>
                      {blood.status === 'critical' ? 'Nguy cấp' : 
                       blood.status === 'low' ? 'Thấp' : 'Tốt'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hiện có:</span>
                      <span className="font-medium">{blood.current} đơn vị</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cần:</span>
                      <span className="font-medium">{blood.required} đơn vị</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          blood.status === 'critical' ? 'bg-red-500' :
                          blood.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((blood.current / blood.required) * 100, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {Math.round((blood.current / blood.required) * 100)}%
                      </span>
                      <span className={`flex items-center ${blood.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {blood.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(blood.change)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              Lịch hẹn hôm nay
            </h2>
            <Button variant="ghost" size="sm">
              Xem tất cả
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{appointment.donor}</span>
                  <span className="text-sm font-medium text-red-600">{appointment.bloodType}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{appointment.time}</span>
                  <span>{appointment.type}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{appointment.location}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                  }`}>
                    {appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 text-purple-500 mr-2" />
              Hoạt động gần đây
            </h2>
            <Button variant="ghost" size="sm">
              Xem tất cả
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.status)}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{activity.location}</p>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 text-green-500 mr-2" />
              Điểm hiến máu hàng đầu
            </h2>
            <Button variant="ghost" size="sm">
              Xem tất cả
            </Button>
          </div>

          <div className="space-y-4">
            {topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.donations} lần hiến</p>
                  </div>
                </div>
                
                <span className={`flex items-center text-sm font-medium ${
                  location.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {location.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(location.change)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Hành động nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            Thêm người dùng
          </Button>
          <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            Tạo báo cáo
          </Button>
          <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            Quản lý kho máu
          </Button>
          <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            Cài đặt hệ thống
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;