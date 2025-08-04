import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, Heart, Phone, MapPin, CreditCard, Briefcase, Droplets, Activity, Weight, Gauge, UserCheck } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { getUserById } from '../../services/userService';
import { getAppointmentHealthDeclaration } from '../../services/healthDeclarationService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getHealthCheckByAppointment } from '../../services/healthCheckService';
import { getAppointmentBloodDonationInfo } from '../../services/bloodDonationInformationService';
import { formatVietnamTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState(null);
  const [healthDeclaration, setHealthDeclaration] = useState(null);
  const [healthCheck, setHealthCheck] = useState(null);
  const [bloodDonationInfo, setBloodDonationInfo] = useState(null);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingHealthCheck, setLoadingHealthCheck] = useState(false);
  const [loadingBloodDonation, setLoadingBloodDonation] = useState(false);
  const [userError, setUserError] = useState(false);
  const [healthError, setHealthError] = useState(false);
  const [healthCheckError, setHealthCheckError] = useState(false);
  const [bloodDonationError, setBloodDonationError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointment?.userId || !appointment?.appointmentId) return;

      setLoadingUser(true);
      setLoadingHealth(true);
      setLoadingHealthCheck(true);
      setLoadingBloodDonation(true);
      setUserError(false);
      setHealthError(false);
      setHealthCheckError(false);
      setBloodDonationError(false);

      try {
        const [userData, bloodTypesData] = await Promise.all([
          getUserById(appointment.userId),
          getBloodTypes()
        ]);

        setUserInfo(userData.data.data);
        setBloodTypes(bloodTypesData.data.data.content);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUserError(true);
      } finally {
        setLoadingUser(false);
      }

      try {
        const healthData = await getAppointmentHealthDeclaration(appointment.appointmentId);
        setHealthDeclaration(healthData.data.data);
      } catch (error) {
        console.error('Error fetching health declaration:', error);
        setHealthError(true);
      } finally {
        setLoadingHealth(false);
      }

      try {
        const healthCheckData = await getHealthCheckByAppointment(appointment.appointmentId);
        setHealthCheck(healthCheckData.data.data[0]);
      } catch (error) {
        console.error('Error fetching health check:', error);
        setHealthCheckError(true);
      } finally {
        setLoadingHealthCheck(false);
      }

      if ([APPOINTMENT_STATUS.COMPLETED].includes(appointment.status)) {
        try {
          const bloodDonationData = await getAppointmentBloodDonationInfo(appointment.appointmentId);
          setBloodDonationInfo(bloodDonationData.data.data);
        } catch (error) {
          console.error('Error fetching blood donation info:', error);
          setBloodDonationError(true);
        } finally {
          setLoadingBloodDonation(false);
        }
      } else {
        setLoadingBloodDonation(false);
      }
    };

    if (isOpen && appointment) {
      fetchData();
    }
  }, [appointment, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setUserInfo(null);
      setHealthDeclaration(null);
      setHealthCheck(null);
      setBloodDonationInfo(null);
      setBloodTypes([]);
      setLoadingUser(false);
      setLoadingHealth(false);
      setLoadingHealthCheck(false);
      setLoadingBloodDonation(false);
      setUserError(false);
      setHealthError(false);
      setHealthCheckError(false);
      setBloodDonationError(false);
    }
  }, [isOpen]);

  if (!isOpen || !appointment) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      [APPOINTMENT_STATUS.PENDING]: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Chờ xác nhận'
      },
      [APPOINTMENT_STATUS.SCHEDULED]: {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Đã lên lịch'
      },
      [APPOINTMENT_STATUS.COMPLETED]: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Hoàn thành'
      },
      [APPOINTMENT_STATUS.MEDICAL_COMPLETED]: {
        icon: UserCheck,
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Đã kiểm tra y tế'
      },
      [APPOINTMENT_STATUS.CANCELLED]: {
        icon: XCircle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Đã hủy'
      }
    };

    const config = statusConfig[status] || statusConfig[APPOINTMENT_STATUS.PENDING];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {config.label}
      </span>
    );
  };

  const getBloodTypeName = (bloodTypeId) => {
    const bloodType = bloodTypes.find(bt => bt.id === bloodTypeId);
    return bloodType ? bloodType.typeName : 'Chưa cập nhật';
  };

  const GENDER_LABELS = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác'
  };

  const UserInfoDisplay = () => {
    if (loadingUser) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-500">Đang tải thông tin người dùng...</span>
        </div>
      );
    }

    if (userError || !userInfo) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-500">Không thể tải thông tin người dùng</span>
          </div>
          <p className="text-sm text-gray-600">ID: {appointment.userId}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-500" />
            <div>
              <span className="text-sm font-medium text-gray-900">{userInfo.fullName}</span>
              <div className="text-xs text-gray-500">ID: {userInfo.id}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{userInfo.phoneNumber || 'Chưa cập nhật'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {userInfo.dateOfBirth ? formatVietnamTime(userInfo.dateOfBirth, 'DD/MM/YYYY') : 'Chưa cập nhật'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-700">{getBloodTypeName(userInfo.bloodTypeId)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600">{userInfo.email}</div>

          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{GENDER_LABELS[userInfo.gender] || 'Chưa cập nhật'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{userInfo.citizenId || 'Chưa cập nhật'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{userInfo.job || 'Chưa cập nhật'}</span>
          </div>
        </div>

        {userInfo.address && (
          <div className="md:col-span-2">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
              <span className="text-sm text-gray-700">{userInfo.address}</span>
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <div className="text-xs text-gray-500">
            Vai trò: <span className="font-medium">{userInfo.role}</span>
            {userInfo.status !== undefined && (
              <span className="ml-4">
                Trạng thái: <span className={`font-medium ${userInfo.status ? 'text-green-600' : 'text-red-600'}`}>
                  {userInfo.status ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const HealthDeclarationDisplay = () => {
    if (loadingHealth) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
          <span className="text-sm text-gray-500">Đang tải khai báo y tế...</span>
        </div>
      );
    }

    if (healthError || !healthDeclaration) {
      return (
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-500">Không thể tải thông tin khai báo y tế</span>
        </div>
      );
    }

    const BooleanDisplay = ({ label, value }) => (
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-700">{label}:</span>
        <span className={`text-sm font-medium ${value ? 'text-red-600' : 'text-green-600'}`}>
          {value ? 'Có' : 'Không'}
        </span>
      </div>
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900">Tiền sử bệnh lý</h5>
          <div className="space-y-1">
            <BooleanDisplay label="Bệnh lây qua đường máu" value={healthDeclaration.hasBloodTransmittedDisease} />
            <BooleanDisplay label="Bệnh mãn tính" value={healthDeclaration.hasChronicDisease} />
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-700">Thuốc đang sử dụng:</span>
              <span className="text-sm text-gray-900 text-right">{healthDeclaration.currentMedications}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-medium text-gray-900">Hoạt động gần đây</h5>
          <div className="space-y-1">
            <BooleanDisplay label="Xăm mình/châm cứu" value={healthDeclaration.hasTattooAcupuncture} />
            <BooleanDisplay label="Tiêm vaccine gần đây" value={healthDeclaration.hasRecentVaccine} />
            <BooleanDisplay label="Đi nước ngoài" value={healthDeclaration.hasTravelAbroad} />
            <BooleanDisplay label="Hành vi tình dục không an toàn" value={healthDeclaration.hasUnsafeSex} />
          </div>
        </div>

        <div className="md:col-span-2 space-y-1">
          <BooleanDisplay label="Lần đầu hiến máu" value={healthDeclaration.isFirstBlood} />

          {healthDeclaration.isPregnantOrBreastfeeding !== null && (
            <BooleanDisplay label="Mang thai/cho con bú" value={healthDeclaration.isPregnantOrBreastfeeding} />
          )}

          {healthDeclaration.isMenstruating !== null && (
            <BooleanDisplay label="Đang trong kỳ kinh nguyệt" value={healthDeclaration.isMenstruating} />
          )}
        </div>
      </div>
    );
  };

  const HealthCheckDisplay = () => {
    if (loadingHealthCheck) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
          <span className="text-sm text-gray-500">Đang tải thông tin khám sức khỏe...</span>
        </div>
      );
    }

    if (healthCheckError || !healthCheck) {
      return (
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Chưa có thông tin khám sức khỏe</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-lg border-2 ${healthCheck.isEligible
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
          }`}>
          <div className="flex items-center space-x-2 mb-2">
            {healthCheck.isEligible ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${healthCheck.isEligible ? 'text-green-800' : 'text-red-800'}`}>
              {healthCheck.isEligible ? 'Đủ điều kiện hiến máu' : 'Không đủ điều kiện hiến máu'}
            </span>
          </div>

          {healthCheck.resultSummary && (
            <p className="text-sm text-gray-700 mb-2">{healthCheck.resultSummary}</p>
          )}

          {!healthCheck.isEligible && healthCheck.ineligibleReason && (
            <div className="bg-red-100 p-3 rounded-md">
              <p className="text-sm text-red-700">
                <span className="font-medium">Lý do không đủ điều kiện:</span> {healthCheck.ineligibleReason}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Chỉ số sinh hiệu</h5>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">Mạch:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{healthCheck.pulse} nhịp/phút</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Huyết áp:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{healthCheck.bloodPressure} mmHg</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Weight className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700">Cân nặng:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{healthCheck.weight} kg</span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Thông tin khác</h5>

            {healthCheck.suggestBloodVolume && (
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700">Lượng máu đề xuất:</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{healthCheck.suggestBloodVolume} ml</span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Thời gian khám:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatVietnamTime(healthCheck.checkedAt)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">ID Khám sức khỏe:</span>
              <span className="text-sm font-medium text-gray-900">#{healthCheck.healthCheckId}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BloodDonationDisplay = () => {
    if (loadingBloodDonation) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
          <span className="text-sm text-gray-500">Đang tải thông tin hiến máu...</span>
        </div>
      );
    }

    if (bloodDonationError || !bloodDonationInfo) {
      return (
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Chưa có thông tin hiến máu</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-2 bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Đã hoàn thành hiến máu</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-red-100">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700">Lượng máu thực tế:</span>
                </div>
                <span className="text-sm font-medium text-red-900">{bloodDonationInfo.actualBloodVolume} ml</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-red-100">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700">Nhóm máu:</span>
                </div>
                <span className="text-sm font-medium text-red-900">
                  {bloodDonationInfo.bloodTypeName || 'Chưa xác định'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-red-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Thời gian hiến:</span>
                </div>
                <span className="text-sm font-medium text-red-900">
                  {formatVietnamTime(bloodDonationInfo.createdAt, 'DD/MM/YYYY HH:mm')}
                </span>
              </div>

              {bloodDonationInfo.updatedAt !== bloodDonationInfo.createdAt && (
                <div className="flex items-center justify-between py-2 border-b border-red-100">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Cập nhật lần cuối:</span>
                  </div>
                  <span className="text-sm font-medium text-red-900">
                    {formatVietnamTime(bloodDonationInfo.updatedAt, 'DD/MM/YYYY HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {user.role === 'MEMBER' && (
            <div className="mt-4 p-3 bg-green-100 rounded-md">
              <p className="text-sm text-green-800">
                <span className="font-medium">🎉 Cảm ơn bạn đã hiến máu!</span>
                <br />Lượng máu hiến tặng của bạn sẽ giúp cứu sống nhiều người.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết lịch hẹn
              </h3>
              <p className="text-sm text-gray-600">
                Lịch hẹn #{appointment.appointmentId}
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

        <div className="p-6 space-y-6">
          {user.role === 'STAFF' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin người khám</h4>
              <UserInfoDisplay />
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin lịch hẹn</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">ID Lịch hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">#{appointment.appointmentId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ngày hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {formatVietnamTime(appointment.appointmentDate, 'DD/MM/YYYY')}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Giờ hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {formatVietnamTime(appointment.appointmentDate, 'HH:mm')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ngày trong tuần:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {formatVietnamTime(appointment.appointmentDate, 'dddd')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Trạng thái hiện tại</h4>
            <div className="flex items-center space-x-2">
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-600" />
              <span>Khai báo y tế</span>
            </h4>
            <HealthDeclarationDisplay />
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span>Thông tin khám sức khỏe</span>
            </h4>
            <HealthCheckDisplay />
          </div>

          {[APPOINTMENT_STATUS.COMPLETED].includes(appointment.status) && (
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-red-600" />
                <span>Thông tin hiến máu</span>
              </h4>
              <BloodDonationDisplay />
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin thời gian</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian lịch hẹn:</span>
                <span className="font-medium">
                  {formatVietnamTime(appointment.appointmentDate)}
                </span>
              </div>

              {formatVietnamTime(appointment.appointmentDate, 'YYYY-MM-DD') === formatVietnamTime(new Date(), 'YYYY-MM-DD') && (
                <div className="flex justify-between text-blue-600">
                  <span>Lịch hẹn hôm nay:</span>
                  <span className="font-medium">Cần được ưu tiên xử lý</span>
                </div>
              )}

              {new Date(appointment.appointmentDate) < new Date() &&
                [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(appointment.status) && (
                  <div className="flex justify-between text-red-600">
                    <span>Trạng thái:</span>
                    <span className="font-medium flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Quá hạn
                    </span>
                  </div>
                )}

              {appointment.status === APPOINTMENT_STATUS.COMPLETED && (
                <div className="flex justify-between text-green-600">
                  <span>Trạng thái:</span>
                  <span className="font-medium">Đã hoàn thành thành công</span>
                </div>
              )}

              {appointment.status === APPOINTMENT_STATUS.CANCELLED && (
                <div className="flex justify-between text-red-600">
                  <span>Trạng thái:</span>
                  <span className="font-medium">Đã bị hủy</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;