import React from 'react';
import {
  MapPin, Calendar, Droplets, X,
  CheckCircle, Clock, XCircle, AlertCircle,
  Heart
} from 'lucide-react';

const DonationHistory = ({
  donations,
  bloodTypes,
  onCancel
}) => {
  const getBloodTypeName = (typeId) => {
    const type = bloodTypes.find(t => t.id === typeId);
    return type ? type.typeName : 'N/A';
  };


  const getComponentName = (bloodTypeId, componentId) => {
    const bloodType = bloodTypes.find(t => t.id === bloodTypeId);
    const component = bloodType?.components.find(c => c.componentId === componentId);
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
        label: 'Bị từ chối'
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

  const canCancel = (donation) => {
    return ['PENDING', 'CONFIRMED'].includes(donation.status) &&
      new Date(donation.donationDate) > new Date();
  };

  const isPastDue = (donationDate, status) => {
    return new Date(donationDate) < new Date() &&
      ['PENDING', 'CONFIRMED'].includes(status);
  };

  const sortedDonations = [...donations].sort((a, b) => {
    const now = new Date();

    const aDate = new Date(a.donationDate);
    const bDate = new Date(b.donationDate);

    const isCancelledOrRejected = (status) => ['CANCELLED', 'REJECTED'].includes(status);
    const isPastDue = (date, status) =>
      new Date(date) < now && ['PENDING', 'CONFIRMED'].includes(status);

    if (isCancelledOrRejected(a.status) && !isCancelledOrRejected(b.status)) return 1;
    if (!isCancelledOrRejected(a.status) && isCancelledOrRejected(b.status)) return -1;

    const aIsPast = isPastDue(aDate, a.status);
    const bIsPast = isPastDue(bDate, b.status);

    if (aIsPast && !bIsPast) return 1;
    if (!aIsPast && bIsPast) return -1;

    return Math.abs(aDate - now) - Math.abs(bDate - now);
  });


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Lịch sử hiến máu ({donations.length})
        </h3>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử hiến máu</h3>
          <p className="text-gray-500">Hãy đăng ký lần hiến máu đầu tiên của bạn!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {sortedDonations.map((donation) => (
            <div key={donation.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Droplets className="w-3 h-3 mr-1" />
                        {getBloodTypeName(donation.bloodType)}
                      </span>
                      {/* <span className="text-sm font-medium text-gray-900">
                        {getComponentName(donation.bloodType, donation.bloodComponent)}

                      </span> */}
                    </div>
                    {getStatusBadge(donation.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(donation.donationDate).toLocaleDateString('vi-VN')}
                        {isPastDue(donation.donationDate, donation.status) && (
                          <span className="text-red-500 ml-1">(Quá hạn)</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-gray-400" />
                      <span>{donation.volumeMl}ml</span>
                    </div>

                    {donation.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{donation.location}</span>
                      </div>
                    )}
                  </div>

                  {donation.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{donation.notes}</p>
                    </div>
                  )}
                </div>

                {canCancel(donation) && (
                  <div className="ml-4">
                    <button
                      onClick={() => onCancel(donation.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hủy đăng ký"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {donation.healthCheck && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Đã kiểm tra sức khỏe
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;