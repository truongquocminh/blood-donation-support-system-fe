import React from 'react';
import { 
  Eye, UserCheck, Calendar, Droplets, MapPin, Phone, 
  CheckCircle, Clock, XCircle, AlertCircle, User 
} from 'lucide-react';

const DonorTable = ({ 
  donations, 
  bloodTypes, 
  bloodComponents, 
  onStatusUpdate, 
  onViewDetails, 
  onHealthCheck 
}) => {
  const getBloodTypeName = (typeId) => {
    const type = bloodTypes.find(t => t.bloodTypeId === typeId);
    return type ? type.typeName : 'N/A';
  };

  const getComponentName = (componentId) => {
    const component = bloodComponents.find(c => c.componentId === componentId);
    return component ? component.componentName : 'N/A';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Chờ xác nhận'
      },
      CONFIRMED: {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Đã xác nhận'
      },
      COMPLETED: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Hoàn thành'
      },
      CANCELLED: {
        icon: XCircle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Đã hủy'
      },
      REJECTED: {
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Từ chối'
      }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
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
      case 'PENDING':
        actions.push(
          <button
            key="health-check"
            onClick={() => onHealthCheck(donation)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Kiểm tra sức khỏe
          </button>
        );
        actions.push(
          <button
            key="reject"
            onClick={() => onStatusUpdate(donation.id, 'REJECTED')}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Từ chối
          </button>
        );
        break;

      case 'CONFIRMED':
        actions.push(
          <button
            key="complete"
            onClick={() => onStatusUpdate(donation.id, 'COMPLETED')}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Hoàn thành
          </button>
        );
        actions.push(
          <button
            key="cancel"
            onClick={() => onStatusUpdate(donation.id, 'CANCELLED')}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Hủy
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
           ['PENDING', 'CONFIRMED'].includes(status);
  };

  const isToday = (donationDate) => {
    const today = new Date();
    const donation = new Date(donationDate);
    return donation.toDateString() === today.toDateString();
  };

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
                  Địa điểm
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
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
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
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Phone className="w-3 h-3" />
                          <span>{donation.user.phone}</span>
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
                      <div className="text-sm text-gray-900">
                        {getComponentName(donation.bloodComponent)}
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
                        <div className={`text-sm ${
                          isToday(donation.donationDate) ? 'font-medium text-blue-600' : 'text-gray-900'
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
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 truncate max-w-[150px]">
                        {donation.location}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {getStatusBadge(donation.status)}
                      {donation.healthCheck && (
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