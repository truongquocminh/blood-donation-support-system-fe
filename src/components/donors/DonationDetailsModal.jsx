import React from 'react';
import { 
  X, User, Calendar, Droplets, MapPin, Phone, Mail, 
  Weight, UserCheck, FileText, Clock, CheckCircle 
} from 'lucide-react';

const DonationDetailsModal = ({ 
  isOpen, 
  onClose, 
  donation, 
  bloodTypes, 
  bloodComponents, 
  onStatusUpdate 
}) => {
  if (!isOpen || !donation) return null;

  const getBloodTypeName = (typeId) => {
    const type = bloodTypes.find(t => t.bloodTypeId === typeId);
    return type ? type.typeName : 'N/A';
  };

  const getComponentName = (componentId) => {
    const component = bloodComponents.find(c => c.componentId === componentId);
    return component ? component.componentName : 'N/A';
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-600 bg-yellow-100',
      CONFIRMED: 'text-blue-600 bg-blue-100',
      COMPLETED: 'text-green-600 bg-green-100',
      CANCELLED: 'text-gray-600 bg-gray-100',
      REJECTED: 'text-red-600 bg-red-100'
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
      REJECTED: 'Từ chối'
    };
    return labels[status] || 'Không xác định';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Chi tiết đăng ký hiến máu #{donation.id}
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
                <label className="text-sm font-medium text-gray-500">Tuổi</label>
                <p className="text-sm text-gray-900 mt-1">{donation.user.age} tuổi</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {donation.user.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {donation.user.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nhóm máu cá nhân</label>
                <p className="text-sm text-gray-900 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Droplets className="w-3 h-3 mr-1" />
                    {getBloodTypeName(donation.user.bloodType)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cân nặng</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Weight className="w-4 h-4 mr-2 text-gray-400" />
                  {donation.user.weight} kg
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
                <label className="text-sm font-medium text-gray-500">Nhóm máu hiến</label>
                <p className="text-sm text-gray-900 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Droplets className="w-3 h-3 mr-1" />
                    {getBloodTypeName(donation.bloodType)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Thành phần máu</label>
                <p className="text-sm text-gray-900 mt-1">{getComponentName(donation.bloodComponent)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Thể tích</label>
                <p className="text-sm text-gray-900 mt-1">{donation.volumeMl} ml</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Địa điểm</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {donation.location}
                </p>
              </div>
            </div>
          </div>

          {donation.healthCheck && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Kết quả kiểm tra sức khỏe
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Huyết áp</label>
                  <p className="text-sm text-gray-900 mt-1">{donation.healthCheck.bloodPressure} mmHg</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nhịp tim</label>
                  <p className="text-sm text-gray-900 mt-1">{donation.healthCheck.heartRate} bpm</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Hemoglobin</label>
                  <p className="text-sm text-gray-900 mt-1">{donation.healthCheck.hemoglobin} g/dL</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cân nặng</label>
                  <p className="text-sm text-gray-900 mt-1">{donation.healthCheck.weight} kg</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nhiệt độ</label>
                  <p className="text-sm text-gray-900 mt-1">{donation.healthCheck.temperature}°C</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kết quả</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      donation.healthCheck.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {donation.healthCheck.approved ? (
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
              </div>
              {donation.healthCheck.notes && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-white rounded border">
                    {donation.healthCheck.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {donation.notes && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Ghi chú
              </h4>
              <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded border">
                {donation.notes}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Lịch sử thay đổi
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Đăng ký hiến máu</p>
                  <p className="text-xs text-gray-500">
                    {new Date(donation.registeredAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              
              {donation.healthCheck && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kiểm tra sức khỏe</p>
                    <p className="text-xs text-gray-500">
                      Kết quả: {donation.healthCheck.approved ? 'Đạt' : 'Không đạt'}
                    </p>
                  </div>
                </div>
              )}

              {donation.completedAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hoàn thành hiến máu</p>
                    <p className="text-xs text-gray-500">
                      {new Date(donation.completedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(donation.status === 'PENDING' || donation.status === 'CONFIRMED') && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">Thao tác</h4>
              <div className="flex flex-wrap gap-2">
                {donation.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => {
                        onStatusUpdate(donation.id, 'CONFIRMED');
                        onClose();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => {
                        onStatusUpdate(donation.id, 'REJECTED');
                        onClose();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Từ chối
                    </button>
                  </>
                )}
                
                {donation.status === 'CONFIRMED' && (
                  <>
                    <button
                      onClick={() => {
                        onStatusUpdate(donation.id, 'COMPLETED');
                        onClose();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Hoàn thành
                    </button>
                    <button
                      onClick={() => {
                        onStatusUpdate(donation.id, 'CANCELLED');
                        onClose();
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Hủy
                    </button>
                  </>
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