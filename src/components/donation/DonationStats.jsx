import React from 'react';
import { Heart, Calendar, CheckCircle, Clock } from 'lucide-react';

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

const DonationStats = ({ donations }) => {
  const totalDonations = donations.length;
  
  const completedDonations = donations.filter(d => d.status === 'COMPLETED').length;
  
  const pendingDonations = donations.filter(d => d.status === 'PENDING').length;
  
  const totalVolume = donations
    .filter(d => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.volumeMl, 0);

  const nextDonation = donations
    .filter(d => d.status === 'PENDING' || d.status === 'CONFIRMED')
    .sort((a, b) => new Date(a.donationDate) - new Date(b.donationDate))[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Tổng lần hiến"
        value={totalDonations}
        icon={Heart}
        color="text-red-600"
        subtitle="Tất cả đăng ký"
      />
      
      <StatsCard
        title="Đã hoàn thành"
        value={completedDonations}
        icon={CheckCircle}
        color="text-green-600"
        subtitle="Hiến máu thành công"
      />
      
      <StatsCard
        title="Đang chờ"
        value={pendingDonations}
        icon={Clock}
        color="text-yellow-600"
        subtitle="Chờ xác nhận"
      />
      
      <StatsCard
        title="Tổng thể tích"
        value={`${totalVolume}ml`}
        icon={Calendar}
        color="text-blue-600"
        subtitle="Máu đã hiến"
      />
    </div>
  );
};

export default DonationStats;