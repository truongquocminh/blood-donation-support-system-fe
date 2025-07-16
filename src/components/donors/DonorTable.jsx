import React from 'react';
import {
  Eye, UserCheck, Calendar, Droplets, Phone,
  CheckCircle, Clock, XCircle, AlertCircle, User
} from 'lucide-react';
import { BLOOD_DONATION_STATUS } from '../../utils/constants';

const DonorTable = ({
  donations,
  bloodTypes,
  onStatusUpdate,
  onViewDetails,
  getBloodTypeName
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      [BLOOD_DONATION_STATUS.PENDING]: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Chờ xác nhận'
      },
      [BLOOD_DONATION_STATUS.APPROVED]: {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Đã phê duyệt'
      },
      [BLOOD_DONATION_STATUS.COMPLETED]: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Hoàn thành'
      },
      [BLOOD_DONATION_STATUS.CANCELLED]: {
        icon: XCircle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Đã hủy'
      },
      [BLOOD_DONATION_STATUS.REJECTED]: {
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Từ chối'
      }
    };

    const config = statusConfig[status] || statusConfig[BLOOD_DONATION_STATUS.PENDING];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getStatusActions = (donation) => {
    const actions = [];
    switch (donation.status) {
      case BLOOD_DONATION_STATUS.PENDING:
        actions.push(
          <button
            key="approve"
            onClick={() => onStatusUpdate(donation?.user?.id, donation.donationDate, donation.donationId, BLOOD_DONATION_STATUS.APPROVED)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Phê duyệt
          </button>
        );
        actions.push(
          <button
            key="reject"
            onClick={() => onStatusUpdate(donation.donationId, BLOOD_DONATION_STATUS.REJECTED)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Từ chối
          </button>
        );
        break;

      case BLOOD_DONATION_STATUS.APPROVED:
        actions.push(
          <button
            key="complete"
            onClick={() => onStatusUpdate(donation.donationId, BLOOD_DONATION_STATUS.COMPLETED)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Hoàn thành
          </button>
        );
        break;

      default:
        break;
    }

    return actions;
  };

  const isPastDue = (donationDate, status) => {
    return new Date(donationDate) < new Date() &&
      [BLOOD_DONATION_STATUS.PENDING, BLOOD_DONATION_STATUS.APPROVED].includes(status);
  };

  const isToday = (donationDate) => {
    const today = new Date();
    const donation = new Date(donationDate);
    return donation.toDateString() === today.toDateString();
  };

  const sortedDonations = [...donations].sort((a, b) => {
    const now = new Date();

    const aDate = new Date(a.donationDate);
    const bDate = new Date(b.donationDate);

    const isPast = (date) => date < now;

    const aPast = isPast(aDate);
    const bPast = isPast(bDate);

    if (aPast && !bPast) return 1;
    if (!aPast && bPast) return -1;

    return Math.abs(aDate - now) - Math.abs(bDate - now);
  });


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Danh sách đăng ký hiến máu ({donations.length})
        </h3>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đăng ký nào</h3>
          <p className="text-gray-500">Chưa có đăng ký hiến máu nào phù hợp với bộ lọc</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người hiến
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin hiến máu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày hiến
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDonations.map((donation) => (
                <tr key={donation.donationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {donation.user.name}
                        </div>

                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {donation.user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Droplets className="w-3 h-3 mr-1" />
                          {getBloodTypeName(donation.bloodType)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {donation.volumeMl}ml
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className={`text-sm ${isToday(donation.donationDate) ? 'font-medium text-blue-600' : 'text-gray-900'
                          }`}>
                          {new Date(donation.donationDate).toLocaleDateString('vi-VN')}
                          {isToday(donation.donationDate) && (
                            <span className="ml-1 text-blue-500">(Hôm nay)</span>
                          )}
                        </div>
                        {isPastDue(donation.donationDate, donation.status) && (
                          <div className="text-xs text-red-500">Quá hạn</div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {getStatusBadge(donation.status)}
                      {donation.healthCheckDetails && (
                        <div className="flex items-center space-x-1">
                          <UserCheck className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">Đã kiểm tra</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetails(donation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col space-y-1">
                        {getStatusActions(donation).map((action, index) => (
                          <div key={index}>{action}</div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonorTable;