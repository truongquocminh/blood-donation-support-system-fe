import React from "react";
import { Syringe, TrendingUp, Calendar, Activity } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div
        className={`p-3 rounded-lg ${color
          .replace("text", "bg")
          .replace("600", "100")}`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const ExtractionStats = ({ extractions }) => {
  const totalVolume = extractions.reduce((sum, ext) => sum + ext.totalVolumeExtraction, 0);

  const uniqueTypes = new Set(extractions.map((ext) => ext.bloodTypeId)).size;

  const todayExtractions = extractions.filter((ext) => {
    if (!ext.extractedAt) return false;
    const today = new Date();
    const extractedDate = new Date(ext.extractedAt);
    return (
      extractedDate.getDate() === today.getDate() &&
      extractedDate.getMonth() === today.getMonth() &&
      extractedDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const thisWeekExtractions = extractions.filter((ext) => {
    if (!ext.extractedAt) return false;
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const extractedDate = new Date(ext.extractedAt);
    return extractedDate >= weekAgo && extractedDate <= today;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Tổng thể tích trích xuất"
        value={`${totalVolume} ml`}
        icon={Syringe}
        color="text-blue-600"
        subtitle="Toàn bộ hệ thống"
      />

      <StatsCard
        title="Loại máu đã trích xuất"
        value={uniqueTypes}
        icon={Activity}
        color="text-green-600"
        subtitle="Các nhóm máu khác nhau"
      />

      <StatsCard
        title="Trích xuất hôm nay"
        value={todayExtractions}
        icon={Calendar}
        color="text-orange-600"
        subtitle="Số lần trong ngày"
      />

      <StatsCard
        title="Trích xuất tuần này"
        value={thisWeekExtractions}
        icon={TrendingUp}
        color="text-purple-600"
        subtitle="7 ngày qua"
      />
    </div>
  );
};

export default ExtractionStats;