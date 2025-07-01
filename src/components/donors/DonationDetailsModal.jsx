import React from 'react';
import {
  X, User, Calendar, Droplets, Phone, Mail,
  Weight, UserCheck, FileText, Clock, CheckCircle
} from 'lucide-react';
import { BLOOD_DONATION_STATUS } from '../../utils/constants';

const DonationDetailsModal = ({
  isOpen,
  onClose,
  donation,
  bloodTypes,
  onStatusUpdate,
  getBloodTypeName
}) => {
  if (!isOpen || !donation) return null;

  const getStatusColor = (status) => {
    const colors = {
      [BLOOD_DONATION_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
      [BLOOD_DONATION_STATUS.APPROVED]: 'text-blue-600 bg-blue-100',
      [BLOOD_DONATION_STATUS.COMPLETED]: 'text-green-600 bg-green-100',
      [BLOOD_DONATION_STATUS.CANCELLED]: 'text-gray-600 bg-gray-100',
      [BLOOD_DONATION_STATUS.REJECTED]: 'text-red-600 bg-red-100'
    };
    return colors[status] || colors[BLOOD_DONATION_STATUS.PENDING];
  };

  const getStatusLabel = (status) => {
    const labels = {
      [BLOOD_DONATION_STATUS.PENDING]: 'Chờ xác nhận',
      [BLOOD_DONATION_STATUS.APPROVED]: 'Đã phê duyệt',
      [BLOOD_DONATION_STATUS.COMPLETED]: 'Hoàn thành',
      [BLOOD_DONATION_STATUS.CANCELLED]: 'Đã hủy',
      [BLOOD_DONATION_STATUS.REJECTED]: 'Từ chối'
    };
    return labels[status] || 'Không xác định';
  };

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Chi tiết đăng ký hiến máu #{donation.donationId}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin người hiến
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Họ tên</label>
                <p className="text-sm text-gray-900 mt-1">{donation.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ID người dùng</label>
                <p className="text-sm text-gray-900 mt-1">{donation.user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {donation.user.email}
                </p>
              </div>

            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Droplets className="w-5 h-5 mr-2" />
              Thông tin hiến máu
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Ngày hiến máu</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {new Date(donation.donationDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                    {getStatusLabel(donation.status)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nhóm máu</label>
                <p className="text-sm text-gray-900 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Droplets className="w-3 h-3 mr-1" />
                    {getBloodTypeName(donation.bloodType)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Thể tích</label>
                <p className="text-sm text-gray-900 mt-1">{donation.volumeMl} ml</p>
              </div>
            </div>
          </div>

          {donation.healthCheckDetails && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Kết quả kiểm tra sức khỏe
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {donation.healthCheckDetails.bloodPressure && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Huyết áp</label>
                    <p className="text-sm text-gray-900 mt-1">{donation.healthCheckDetails.bloodPressure} mmHg</p>
                  </div>
                )}
                {donation.healthCheckDetails.heartRate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nhịp tim</label>
                    <p className="text-sm text-gray-900 mt-1">{donation.healthCheckDetails.heartRate} bpm</p>
                  </div>
                )}
                {donation.healthCheckDetails.hemoglobin && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hemoglobin</label>
                    <p className="text-sm text-gray-900 mt-1">{donation.healthCheckDetails.hemoglobin} g/dL</p>
                  </div>
                )}
                {donation.healthCheckDetails.weight && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cân nặng</label>
                    <p className="text-sm text-gray-900 mt-1">{donation.healthCheckDetails.weight} kg</p>
                  </div>
                )}
                {donation.healthCheckDetails.temperature && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nhiệt độ</label>
                    <p className="text-sm text-gray-900 mt-1">{donation.healthCheckDetails.temperature}°C</p>
                  </div>
                )}
                {donation.healthCheckDetails.pulse && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mạch</label>
                    <p className="text-sm text-gray-900 mt-1">{donation.healthCheckDetails.pulse} bpm</p>
                  </div>
                )}
                {donation.healthCheckDetails.isEligible !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Kết quả</label>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donation.healthCheckDetails.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {donation.healthCheckDetails.isEligible ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Đạt
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 mr-1" />
                            Không đạt
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {donation.healthCheckDetails.resultSummary && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tóm tắt kết quả</label>
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {donation.healthCheckDetails.resultSummary}
                  </p>
                </div>
              )}

              {donation.healthCheckDetails.notes && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500">Ghi chú bổ sung</label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-white rounded border">
                    {donation.healthCheckDetails.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Thông tin bổ sung
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ID đăng ký: #{donation.donationId}</p>
                  <p className="text-xs text-gray-500">
                    Ngày hiến: {new Date(donation.donationDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {donation.healthCheck && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">ID kiểm tra sức khỏe: #{donation.healthCheck}</p>
                    <p className="text-xs text-gray-500">
                      {donation.healthCheckDetails ?
                        `Kết quả: ${donation.healthCheckDetails.isEligible ? 'Đạt' : 'Không đạt'}` :
                        'Chưa có kết quả'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(donation.status === BLOOD_DONATION_STATUS.PENDING || donation.status === BLOOD_DONATION_STATUS.APPROVED) && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">Thao tác</h4>
              <div className="flex flex-wrap gap-2">
                {donation.status === BLOOD_DONATION_STATUS.PENDING && (
                  <>
                    <button
                      onClick={() => {
                        onStatusUpdate(donation.donationId, BLOOD_DONATION_STATUS.APPROVED);
                        onClose();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Phê duyệt
                    </button>
                    <button
                      onClick={() => {
                        onStatusUpdate(donation.donationId, BLOOD_DONATION_STATUS.REJECTED);
                        onClose();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Từ chối
                    </button>
                  </>
                )}

                {donation.status === BLOOD_DONATION_STATUS.APPROVED && (
                  <button
                    onClick={() => {
                      onStatusUpdate(donation.donationId, BLOOD_DONATION_STATUS.COMPLETED);
                      onClose();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Hoàn thành
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;