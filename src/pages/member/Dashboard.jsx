import React, { useState } from 'react';
import { 
  Heart, Calendar, Award, TrendingUp, Clock, MapPin, 
  User, Star, Gift, Bell, ChevronRight, Plus
} from 'lucide-react';
import { StatsCard, InfoCard, ActionCard } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal, { AlertModal } from '../../components/ui/Modal';

const MemberDashboard = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const memberData = {
    name: "Nguyễn Văn A",
    totalDonations: 12,
    rewardPoints: 1200,
    nextEligibleDate: "2025-08-15",
    bloodType: "O+",
    lifeSaved: 36,
    memberSince: "2022-03-15"
  };

  const upcomingAppointments = [
    {
      id: 1,
      date: "2025-06-15",
      time: "09:00",
      location: "Bệnh viện Chợ Rẫy",
      status: "confirmed",
      type: "whole_blood"
    },
    {
      id: 2,
      date: "2025-06-20",
      time: "14:30",
      location: "Trung tâm Y tế Quận 1",
      status: "pending",
      type: "platelet"
    }
  ];

  const donationHistory = [
    {
      id: 1,
      date: "2025-02-15",
      location: "Bệnh viện Chợ Rẫy",
      type: "Máu toàn phần",
      volume: "450ml",
      status: "completed"
    },
    {
      id: 2,
      date: "2024-10-20",
      location: "Trung tâm Y tế Quận 3",
      type: "Tiểu cầu",
      volume: "250ml",
      status: "completed"
    },
    {
      id: 3,
      date: "2024-06-18",
      location: "Bệnh viện Từ Dũ",
      type: "Máu toàn phần",
      volume: "450ml",
      status: "completed"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Người hiến máu thường xuyên",
      description: "Hiến máu 10 lần",
      icon: "🏆",
      unlocked: true,
      date: "2024-12-15"
    },
    {
      id: 2,
      title: "Cứu tinh nhân loại",
      description: "Cứu sống 25 người",
      icon: "⭐",
      unlocked: true,
      date: "2025-01-20"
    },
    {
      id: 3,
      title: "Người hùng máu hiếm",
      description: "Hiến máu O- 5 lần",
      icon: "💎",
      unlocked: false,
      date: null
    }
  ];

  const healthTips = [
    {
      title: "Uống đủ nước",
      description: "Uống ít nhất 2-3 lít nước mỗi ngày để duy trì lượng máu tốt",
      icon: "💧"
    },
    {
      title: "Ăn đủ chất sắt",
      description: "Thực phẩm giàu sắt giúp tái tạo hồng cầu nhanh chóng",
      icon: "🥬"
    },
    {
      title: "Nghỉ ngơi đầy đủ",
      description: "Ngủ 7-8 tiếng mỗi ngày để cơ thể phục hồi tốt nhất",
      icon: "😴"
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'completed': return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Chào mừng trở lại, {memberData.name}! 👋
            </h1>
            <p className="text-red-100 mb-4">
              Cảm ơn bạn đã là một phần của cộng đồng hiến máu. Mỗi giọt máu của bạn đều có ý nghĩa!
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" fill="currentColor" />
                <span>Nhóm máu: {memberData.bloodType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Thành viên từ: {formatDate(memberData.memberSince)}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Heart}
          title="Tổng lần hiến máu"
          value={memberData.totalDonations}
          change="+2 lần trong 6 tháng qua"
          trend="up"
        />
        <StatsCard
          icon={Award}
          title="Điểm tích lũy"
          value={memberData.rewardPoints.toLocaleString()}
          change="+340 điểm tháng này"
          trend="up"
        />
        <StatsCard
          icon={User}
          title="Người được cứu"
          value={memberData.lifeSaved}
          change="Ước tính từ số lần hiến máu"
        />
        <StatsCard
          icon={Calendar}
          title="Ngày có thể hiến tiếp"
          value={formatDate(memberData.nextEligibleDate)}
          change="Còn 45 ngày"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          icon={Plus}
          title="Đặt lịch hiến máu"
          description="Đặt lịch hẹn hiến máu tại các điểm gần bạn"
          actionText="Đặt lịch ngay"
          action={() => setShowBookingModal(true)}
          className="border-2 border-red-200 hover:border-red-300"
        />
        <ActionCard
          icon={MapPin}
          title="Tìm điểm hiến máu"
          description="Xem danh sách các điểm hiến máu gần bạn"
          actionText="Xem bản đồ"
          action={() => console.log('View map')}
        />
        <ActionCard
          icon={Gift}
          title="Đổi phần thưởng"
          description="Sử dụng điểm tích lũy để nhận quà tặng"
          actionText="Xem quà tặng"
          action={() => console.log('View rewards')}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 text-red-500 mr-2" />
              Lịch hẹn sắp tới
            </h2>
            <Button variant="ghost" size="sm">
              Xem tất cả
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">
                      {formatDate(appointment.date)} - {appointment.time}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Loại: {appointment.type === 'whole_blood' ? 'Máu toàn phần' : 'Tiểu cầu'}
                  </span>
                  <Button variant="ghost" size="sm" icon={<ChevronRight />}>
                    Chi tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {upcomingAppointments.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Bạn chưa có lịch hẹn nào</p>
              <Button variant="primary" onClick={() => setShowBookingModal(true)}>
                Đặt lịch hẹn đầu tiên
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              Lịch sử hiến máu gần đây
            </h2>
            <Button variant="ghost" size="sm">
              Xem tất cả
            </Button>
          </div>

          <div className="space-y-4">
            {donationHistory.slice(0, 3).map((donation) => (
              <div key={donation.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-600" fill="currentColor" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{donation.type}</span>
                    <span className="text-sm text-gray-500">{donation.volume}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{formatDate(donation.date)}</span>
                    <span>•</span>
                    <span>{donation.location}</span>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="w-5 h-5 text-yellow-500 mr-2" />
              Thành tích
            </h2>
            <Button variant="ghost" size="sm">
              Xem tất cả
            </Button>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.date && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Đạt được: {formatDate(achievement.date)}
                      </p>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              Mẹo sức khỏe
            </h2>
          </div>

          <div className="space-y-4">
            {healthTips.map((tip, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-3">
                  <div className="text-xl">{tip.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Nhắc nhở</span>
            </div>
            <p className="text-sm text-blue-700">
              Bạn có thể hiến máu lại sau ngày {formatDate(memberData.nextEligibleDate)}. 
              Hãy đặt lịch hẹn sớm để đảm bảo có chỗ!
            </p>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        type="info"
        title="Đặt lịch hiến máu"
        message="Chức năng đặt lịch hẹn sẽ được triển khai trong phiên bản tiếp theo. Hiện tại bạn có thể gọi hotline 1900 1234 để đặt lịch."
        buttonText="Đã hiểu"
      />
    </div>
  );
};

export default MemberDashboard;