import React from 'react';
import { Droplets, Users, Calendar, BarChart3 } from 'lucide-react';

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

const BloodDonationStats = ({ donations }) => {
  const totalDonations = donations.length;
  
  const totalVolume = donations.reduce((sum, donation) => sum + donation.actualBloodVolume, 0);
  
  const uniqueDonors = [...new Set(donations.map(d => d.userId))].length;
  
  const bloodTypeStats = donations.reduce((acc, donation) => {
    acc[donation.bloodTypeName] = (acc[donation.bloodTypeName] || 0) + 1;
    return acc;
  }, {});
  
  const mostCommonBloodType = Object.entries(bloodTypeStats).reduce(
    (max, [type, count]) => count > max.count ? { type, count } : max,
    { type: 'N/A', count: 0 }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Tổng lượt hiến máu"
        value={totalDonations}
        icon={Droplets}
        color="text-red-600"
        subtitle="Tất cả"
      />
      
      <StatsCard
        title="Tổng thể tích"
        value={`${totalVolume}ml`}
        icon={BarChart3}
        color="text-blue-600"
        subtitle="Đã thu được"
      />
      
      <StatsCard
        title="Số người hiến"
        value={uniqueDonors}
        icon={Users}
        color="text-green-600"
        subtitle="Người dùng"
      />
      
      <StatsCard
        title="Nhóm máu phổ biến"
        value={mostCommonBloodType.type}
        icon={Calendar}
        color="text-purple-600"
        subtitle={`${mostCommonBloodType.count} lượt`}
      />
    </div>
  );
};

export default BloodDonationStats;