import React, { useState, useEffect } from 'react';
import { X, Droplets, User, Calendar, Heart, Phone, MapPin, CreditCard, Briefcase } from 'lucide-react';
import { getUserById } from '../../services/userService';
import { getAppointmentById } from '../../services/appointmentService';
import { getAppointmentHealthDeclaration } from '../../services/healthDeclarationService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { formatVietnamTime } from '../../utils/formatters';

const BloodDonationDetailsModal = ({ isOpen, onClose, donation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const [healthDeclaration, setHealthDeclaration] = useState(null);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && donation) {
      loadAllData();
    }
  }, [isOpen, donation]);

  useEffect(() => {
    if (!isOpen) {
      setUserInfo(null);
      setAppointmentInfo(null);
      setHealthDeclaration(null);
      setBloodTypes([]);
    }
  }, [isOpen]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const [userResponse, appointmentResponse, bloodTypesResponse] = await Promise.all([
        getUserById(donation.userId),
        getAppointmentById(donation.appointmentId),
        getBloodTypes()
      ]);

      if (userResponse.status === 200) {
        setUserInfo(userResponse.data.data);
      }

      if (appointmentResponse.status === 200) {
        setAppointmentInfo(appointmentResponse.data.data);
      }

      if (bloodTypesResponse.status === 200) {
        setBloodTypes(bloodTypesResponse.data.data.content);
      }

      try {
        const healthResponse = await getAppointmentHealthDeclaration(donation.appointmentId);
        if (healthResponse.status === 200) {
          setHealthDeclaration(healthResponse.data.data);
        }
      } catch (error) {
        console.error('Health declaration not found:', error);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !donation) return null;

  const getBloodTypeName = (bloodTypeId) => {
    const bloodType = bloodTypes.find(bt => bt.id === bloodTypeId);
    return bloodType ? bloodType.typeName : 'Chưa cập nhật';
  };

  const GENDER_LABELS = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác'
  };

  const STATUS_LABELS = {
    PENDING: 'Chờ xác nhận',
    SCHEDULED: 'Đã lên lịch',
    MEDICAL_COMPLETED: 'Đã kiểm tra y tế',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy'
  };

  const BooleanDisplay = ({ label, value }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-700">{label}:</span>
      <span className={`text-sm font-medium ${value ? 'text-red-600' : 'text-green-600'}`}>
        {value ? 'Có' : 'Không'}
      </span>
    </div>
  );

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Droplets className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết thông tin hiến máu
              </h3>
              <p className="text-sm text-gray-600">
                ID: #{donation.bloodDonationInformationId} - {donation.userName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Đang tải thông tin...</span>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-red-600" />
                <span>Thông tin hiến máu</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID hiến máu:</span>
                  <p className="font-medium">#{donation.bloodDonationInformationId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Lịch hẹn:</span>
                  <p className="font-medium">#{donation.appointmentId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Nhóm máu:</span>
                  <p className="font-medium text-red-600">{donation.bloodTypeName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Thể tích máu:</span>
                  <p className="font-medium text-blue-600">{donation.actualBloodVolume}ml</p>
                </div>
                <div>
                  <span className="text-gray-600">Thời gian hiến:</span>
                  <p className="font-medium">{formatVietnamTime(donation.createdAt)}</p>
                </div>
                {donation.updatedAt !== donation.createdAt && (
                  <div>
                    <span className="text-gray-600">Cập nhật cuối:</span>
                    <p className="font-medium">{formatVietnamTime(donation.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {userInfo && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Thông tin người hiến</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Họ tên:</span>
                    <p className="font-medium">{userInfo.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{userInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">SĐT:</span>
                    <p className="font-medium">{userInfo.phoneNumber || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Giới tính:</span>
                    <p className="font-medium">{GENDER_LABELS[userInfo.gender] || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngày sinh:</span>
                    <p className="font-medium">
                      {userInfo.dateOfBirth ? formatVietnamTime(userInfo.dateOfBirth, 'DD/MM/YYYY') : 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nhóm máu (hệ thống):</span>
                    <p className="font-medium text-red-600">{getBloodTypeName(userInfo.bloodTypeId)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">CMND/CCCD:</span>
                    <p className="font-medium">{userInfo.citizenId || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nghề nghiệp:</span>
                    <p className="font-medium">{userInfo.job || 'Chưa cập nhật'}</p>
                  </div>
                  {userInfo.address && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <p className="font-medium">{userInfo.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {appointmentInfo && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>Thông tin lịch hẹn</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ID lịch hẹn:</span>
                    <p className="font-medium">#{appointmentInfo.appointmentId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Thời gian hẹn:</span>
                    <p className="font-medium">{formatVietnamTime(appointmentInfo.appointmentDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Trạng thái:</span>
                    <p className="font-medium text-green-600">{STATUS_LABELS[appointmentInfo.status] || appointmentInfo.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <p className="font-medium">{appointmentInfo.userId}</p>
                  </div>
                </div>
              </div>
            )}

            {healthDeclaration && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span>Khai báo y tế</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900 text-sm">Tiền sử bệnh lý</h5>
                    <div className="space-y-1">
                      <BooleanDisplay label="Bệnh lây qua đường máu" value={healthDeclaration.hasBloodTransmittedDisease} />
                      <BooleanDisplay label="Bệnh mãn tính" value={healthDeclaration.hasChronicDisease} />
                      <div className="flex items-center justify-between py-1">
                        <span className="text-sm text-gray-700">Thuốc đang dùng:</span>
                        <span className="text-sm text-gray-900 text-right max-w-32 truncate" title={healthDeclaration.currentMedications}>
                          {healthDeclaration.currentMedications}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900 text-sm">Hoạt động gần đây</h5>
                    <div className="space-y-1">
                      <BooleanDisplay label="Xăm mình/châm cứu" value={healthDeclaration.hasTattooAcupuncture} />
                      <BooleanDisplay label="Tiêm vaccine" value={healthDeclaration.hasRecentVaccine} />
                      <BooleanDisplay label="Đi nước ngoài" value={healthDeclaration.hasTravelAbroad} />
                      <BooleanDisplay label="Tình dục không an toàn" value={healthDeclaration.hasUnsafeSex} />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <BooleanDisplay label="Lần đầu hiến máu" value={healthDeclaration.isFirstBlood} />
                    
                    {healthDeclaration.isPregnantOrBreastfeeding !== null && (
                      <BooleanDisplay label="Mang thai/cho con bú" value={healthDeclaration.isPregnantOrBreastfeeding} />
                    )}
                    
                    {healthDeclaration.isMenstruating !== null && (
                      <BooleanDisplay label="Đang có kinh" value={healthDeclaration.isMenstruating} />
                    )}

                    <div className="pt-2 text-xs text-gray-500">
                      Thời gian khai báo: {formatVietnamTime(healthDeclaration.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationDetailsModal;