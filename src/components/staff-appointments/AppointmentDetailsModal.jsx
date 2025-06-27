import React, { useState } from 'react';
import {
  X, User, Calendar, Phone, Mail, Weight, UserCheck,
  FileText, Clock, CheckCircle, Edit, Save, AlertTriangle
} from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../pages/staff/Appointments';

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
  bloodTypes,
  bloodComponents,
  onStatusUpdate,
  onAppointmentUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bloodType: '',
    bloodComponent: '',
    volumeMl: '',
    location: '',
    notes: ''
  });

  React.useEffect(() => {
    if (appointment) {
      setEditData({
        bloodType: appointment.bloodType?.toString() || '',
        bloodComponent: appointment.bloodComponent?.toString() || '',
        volumeMl: appointment.volumeMl?.toString() || '',
        location: appointment.location || '',
        notes: appointment.notes || ''
      });
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const getBloodTypeName = (typeId) => {
    if (!typeId) return 'Chưa xác định';
    const type = bloodTypes.find(t => t.bloodTypeId === typeId);
    return type ? type.typeName : 'N/A';
  };

  const getComponentName = (componentId) => {
    if (!componentId) return 'Chưa xác định';
    const component = bloodComponents.find(c => c.componentId === componentId);
    return component ? component.componentName : 'N/A';
  };

  const getStatusColor = (status) => {
    const colors = {
      [APPOINTMENT_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
      [APPOINTMENT_STATUS.SCHEDULED]: 'text-blue-600 bg-blue-100',
      [APPOINTMENT_STATUS.COMPLETED]: 'text-green-600 bg-green-100',
      [APPOINTMENT_STATUS.CANCELLED]: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || colors[APPOINTMENT_STATUS.PENDING];
  };

  const getStatusLabel = (status) => {
    const labels = {
      [APPOINTMENT_STATUS.PENDING]: 'Chờ xác nhận',
      [APPOINTMENT_STATUS.SCHEDULED]: 'Đã lên lịch',
      [APPOINTMENT_STATUS.COMPLETED]: 'Hoàn thành',
      [APPOINTMENT_STATUS.CANCELLED]: 'Đã hủy'
    };
    return labels[status] || 'Không xác định';
  };

  const handleSaveEdit = () => {
    const updateData = {
      bloodType: editData.bloodType ? parseInt(editData.bloodType) : null,
      bloodComponent: editData.bloodComponent ? parseInt(editData.bloodComponent) : null,
      volumeMl: editData.volumeMl ? parseInt(editData.volumeMl) : null,
      location: editData.location || null,
      notes: editData.notes || appointment.notes
    };

    onAppointmentUpdate(appointment.id, updateData);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Chi tiết lịch hẹn #{appointment.id}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
              {getStatusLabel(appointment.status)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {appointment.status === APPOINTMENT_STATUS.PENDING && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={isEditing ? "Hủy chỉnh sửa" : "Tư vấn và bổ sung thông tin"}
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin bệnh nhân
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Họ tên</label>
                <p className="text-sm text-gray-900 mt-1">{appointment.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tuổi</label>
                <p className="text-sm text-gray-900 mt-1">{appointment.user.age} tuổi</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cân nặng</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Weight className="w-4 h-4 mr-2 text-gray-400" />
                  {appointment.user.weight} kg
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {appointment.user.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {appointment.user.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nhóm máu (hồ sơ)</label>
                <p className="text-sm text-gray-900 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {getBloodTypeName(appointment.user.bloodType)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Thông tin lịch hẹn
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Thời gian hẹn</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {new Date(appointment.appointmentDate).toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Thời gian đăng ký</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(appointment.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              {appointment.completedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Thời gian hoàn thành</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(appointment.completedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {appointment.notes && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Ghi chú từ thành viên
              </h4>
              <p className="text-sm text-gray-700 p-3 bg-white rounded border">
                {appointment.notes}
              </p>
            </div>
          )}

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Thông tin hiến máu (do Staff tư vấn)
              </h4>
              {isEditing && (
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu tư vấn</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm máu</label>
                    <select
                      value={editData.bloodType}
                      onChange={(e) => handleEditChange('bloodType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn nhóm máu</option>
                      {bloodTypes.map(type => (
                        <option key={type.bloodTypeId} value={type.bloodTypeId}>
                          {type.typeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thành phần máu</label>
                    <select
                      value={editData.bloodComponent}
                      onChange={(e) => handleEditChange('bloodComponent', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn thành phần máu</option>
                      {bloodComponents.map(component => (
                        <option key={component.componentId} value={component.componentId}>
                          {component.componentName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thể tích (ml)</label>
                    <input
                      type="number"
                      min="50"
                      max="500"
                      value={editData.volumeMl}
                      onChange={(e) => handleEditChange('volumeMl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập thể tích"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                    <select
                      value={editData.location}
                      onChange={(e) => handleEditChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn địa điểm</option>
                      <option value="Bệnh viện Chợ Rẫy">Bệnh viện Chợ Rẫy</option>
                      <option value="Trung tâm Huyết học TP.HCM">Trung tâm Huyết học TP.HCM</option>
                      <option value="Bệnh viện Đại học Y Dược">Bệnh viện Đại học Y Dược</option>
                      <option value="Bệnh viện Nhân dân 115">Bệnh viện Nhân dân 115</option>
                      <option value="Bệnh viện Từ Dũ">Bệnh viện Từ Dũ</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú tư vấn</label>
                  <textarea
                    value={editData.notes}
                    onChange={(e) => handleEditChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ghi chú từ buổi tư vấn với thành viên..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Hướng dẫn tư vấn:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Nhóm máu:</strong> Xác nhận bằng xét nghiệm nhanh</li>
                    <li>• <strong>Thành phần:</strong> Tư vấn dựa trên nhu cầu và sức khỏe</li>
                    <li>• <strong>Thể tích:</strong> Toàn phần: 450ml, Hồng cầu: 300ml, Huyết tương: 200ml</li>
                    <li>• <strong>Địa điểm:</strong> Chọn thuận tiện cho thành viên</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nhóm máu hiến</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {appointment.bloodType ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {getBloodTypeName(appointment.bloodType)}
                      </span>
                    ) : (
                      <span className="text-orange-600 italic">Chờ staff tư vấn</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Thành phần máu</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {appointment.bloodComponent ? getComponentName(appointment.bloodComponent) :
                      <span className="text-orange-600 italic">Chờ staff tư vấn</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Thể tích</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {appointment.volumeMl ? `${appointment.volumeMl} ml` :
                      <span className="text-orange-600 italic">Chờ staff tư vấn</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Địa điểm</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {appointment.location || <span className="text-orange-600 italic">Chờ staff tư vấn</span>}
                  </p>
                </div>
              </div>
            )}

            {appointment.status === APPOINTMENT_STATUS.PENDING && !appointment.bloodType && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-700">
                    Appointment này cần được staff tư vấn và bổ sung thông tin hiến máu
                  </span>
                </div>
              </div>
            )}
          </div>

          {appointment.healthCheck && (
            <div className={`rounded-lg p-4 border ${appointment.healthCheck.isEligible
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
              }`}>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Kết quả kiểm tra sức khỏe
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mạch</label>
                  <p className="text-sm text-gray-900 mt-1">{appointment.healthCheck.pulse} bpm</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Huyết áp</label>
                  <p className="text-sm text-gray-900 mt-1">{appointment.healthCheck.bloodPressure} mmHg</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nhóm máu xác nhận</label>
                  <p className="text-sm text-gray-900 mt-1">{getBloodTypeName(appointment.healthCheck.bloodTypeId)}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Kết quả tổng quan</label>
                <p className={`text-sm mt-1 ${appointment.healthCheck.isEligible ? 'text-green-700' : 'text-red-700'
                  }`}>
                  {appointment.healthCheck.resultSummary}
                </p>
              </div>

              {!appointment.healthCheck.isEligible && appointment.healthCheck.ineligibleReason && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500">Lý do không đủ điều kiện</label>
                  <p className="text-sm text-red-700 mt-1 p-3 bg-red-100 rounded border">
                    {appointment.healthCheck.ineligibleReason}
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-500 border-t pt-3">
                Kiểm tra bởi: {appointment.healthCheck.staffName} - {' '}
                {new Date(appointment.healthCheck.checkedAt).toLocaleString('vi-VN')}
              </div>
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
                  <p className="text-sm font-medium text-gray-900">Thành viên đăng ký lịch hẹn</p>
                  <p className="text-xs text-gray-500">
                    {new Date(appointment.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              {appointment.bloodType && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Edit className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Staff tư vấn và bổ sung thông tin</p>
                    <p className="text-xs text-gray-500">
                      Đã xác định: {getBloodTypeName(appointment.bloodType)} - {getComponentName(appointment.bloodComponent)} - {appointment.volumeMl}ml
                    </p>
                  </div>
                </div>
              )}

              {appointment.healthCheck && (
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${appointment.healthCheck.isEligible ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    <UserCheck className={`w-4 h-4 ${appointment.healthCheck.isEligible ? 'text-green-600' : 'text-red-600'
                      }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kiểm tra sức khỏe</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.healthCheck.checkedAt).toLocaleString('vi-VN')} - {' '}
                      Kết quả: {appointment.healthCheck.isEligible ? 'Đạt' : 'Không đạt'}
                    </p>
                  </div>
                </div>
              )}

              {appointment.status === APPOINTMENT_STATUS.SCHEDULED && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Xác nhận lịch hẹn</p>
                    <p className="text-xs text-gray-500">Đã sẵn sàng cho buổi hiến máu</p>
                  </div>
                </div>
              )}

              {appointment.completedAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hoàn thành hiến máu</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.completedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}

              {appointment.cancelledAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hủy lịch hẹn</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.cancelledAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {[APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(appointment.status) && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">Thao tác nhanh</h4>
              <div className="flex flex-wrap gap-2">
                {appointment.status === APPOINTMENT_STATUS.PENDING && (
                  <>
                    <button
                      onClick={() => {
                        onStatusUpdate(appointment.id, APPOINTMENT_STATUS.SCHEDULED);
                        onClose();
                      }}
                      disabled={!appointment.bloodType}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      title={!appointment.bloodType ? "Cần tư vấn trước khi xác nhận" : ""}
                    >
                      Xác nhận lịch hẹn
                    </button>
                    <button
                      onClick={() => {
                        onStatusUpdate(appointment.id, APPOINTMENT_STATUS.CANCELLED);
                        onClose();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Hủy lịch hẹn
                    </button>
                  </>
                )}

                {appointment.status === APPOINTMENT_STATUS.SCHEDULED && (
                  <>
                    <button
                      onClick={() => {
                        onStatusUpdate(appointment.id, APPOINTMENT_STATUS.COMPLETED);
                        onClose();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Hoàn thành hiến máu
                    </button>
                    <button
                      onClick={() => {
                        onStatusUpdate(appointment.id, APPOINTMENT_STATUS.CANCELLED);
                        onClose();
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Hủy lịch hẹn
                    </button>
                  </>
                )}
              </div>

              {appointment.status === APPOINTMENT_STATUS.PENDING && !appointment.bloodType && (
                <p className="text-sm text-orange-600 mt-2">
                  💡 Tip: Hãy tư vấn và bổ sung thông tin hiến máu trước khi xác nhận lịch hẹn
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;