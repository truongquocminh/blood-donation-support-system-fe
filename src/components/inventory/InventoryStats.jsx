import React from 'react';
import { Package, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

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

const InventoryStats = ({ inventories }) => {
  const totalUnits = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
  
  const uniqueTypes = new Set(inventories.map(inv => inv.bloodType)).size;
  
  const expiringSoon = inventories.filter(inv => {
    const today = new Date();
    const expiry = new Date(inv.expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;

  const lowStock = inventories.filter(inv => inv.quantity <= 5).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Tổng đơn vị máu"
        value={totalUnits}
        icon={Package}
        color="text-blue-600"
        subtitle="Hiện có trong kho"
      />
      
      <StatsCard
        title="Loại máu khác nhau"
        value={uniqueTypes}
        icon={Activity}
        color="text-green-600"
        subtitle="Đang được lưu trữ"
      />
      
      <StatsCard
        title="Sắp hết hạn"
        value={expiringSoon}
        icon={AlertTriangle}
        color="text-yellow-600"
        subtitle="Trong 7 ngày tới"
      />
      
      <StatsCard
        title="Tồn kho thấp"
        value={lowStock}
        icon={TrendingUp}
        color="text-red-600"
        subtitle="≤ 5 đơn vị"
      />
    </div>
  );
};

export default InventoryStats;