import React from 'react';
import { Users, Clock, CheckCircle, XCircle, Calendar, Heart } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const DonorStats = ({ donations }) => {
  const totalDonations = donations.length;
  
  const pendingDonations = donations.filter(d => d.status === 'PENDING').length;
  
  const confirmedDonations = donations.filter(d => d.status === 'CONFIRMED').length;
  
  const completedDonations = donations.filter(d => d.status === 'COMPLETED').length;
  
  const rejectedDonations = donations.filter(d => d.status === 'REJECTED').length;

  const todayDonations = donations.filter(d => {
    const today = new Date();
    const donationDate = new Date(d.donationDate);
    return donationDate.toDateString() === today.toDateString();
  }).length;

  const totalVolume = donations
    .filter(d => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.volumeMl, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      <StatsCard
        title="Tổng đăng ký"
        value={totalDonations}
        icon={Users}
        color="text-blue-600"
        subtitle="Tất cả"
      />
      
      <StatsCard
        title="Chờ xử lý"
        value={pendingDonations}
        icon={Clock}
        color="text-yellow-600"
        subtitle="Cần xem xét"
      />
      
      <StatsCard
        title="Đã xác nhận"
        value={confirmedDonations}
        icon={Calendar}
        color="text-green-600"
        subtitle="Sẵn sàng hiến"
      />
      
      <StatsCard
        title="Hoàn thành"
        value={completedDonations}
        icon={CheckCircle}
        color="text-green-600"
        subtitle="Đã hiến máu"
      />
      
      <StatsCard
        title="Từ chối"
        value={rejectedDonations}
        icon={XCircle}
        color="text-red-600"
        subtitle="Không đạt"
      />
      
      <StatsCard
        title="Hôm nay"
        value={todayDonations}
        icon={Heart}
        color="text-purple-600"
        subtitle="Lịch hiến máu"
      />
    </div>
  );
};

export default DonorStats;