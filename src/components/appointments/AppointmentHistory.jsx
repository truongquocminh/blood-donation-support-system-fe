import React, { useState } from 'react';
import { Calendar, X, Clock, CheckCircle, XCircle, FileText, UserCheck, Eye, Loader2 } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import HealthDeclarationModal from './HealthDeclarationModal';
import { formatVietnamTime } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const AppointmentHistory = ({ appointments, onCancel, onViewDetails, loadingDetails }) => {

  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const canCancel = (appointment) => {
    return [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(appointment.status) &&
      new Date(appointment.appointmentDate) > new Date();
  };

  const isPastDue = (appointmentDate, status) => {
    const nowVietnam = dayjs().tz('Asia/Ho_Chi_Minh');
    
    const appointmentVietnam = dayjs(appointmentDate).tz('Asia/Ho_Chi_Minh');
    
    return appointmentVietnam.isBefore(nowVietnam) &&
      [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(status);
  };

  const isToday = (appointmentDate) => {
    const todayVietnam = dayjs().tz('Asia/Ho_Chi_Minh');
    const appointmentVietnam = dayjs(appointmentDate).tz('Asia/Ho_Chi_Minh');
    
    return appointmentVietnam.isSame(todayVietnam, 'day');
  };

  const handleViewHealthDeclaration = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setHealthModalOpen(true);
  };

  const handleCloseHealthModal = () => {
    setHealthModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleViewDetailsClick = (appointmentId) => {
    if (onViewDetails) {
      onViewDetails(appointmentId);
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const now = new Date();

    const aDate = new Date(a.appointmentDate);
    const bDate = new Date(b.appointmentDate);

    const aIsCancelled = a.status === APPOINTMENT_STATUS.CANCELLED;
    const bIsCancelled = b.status === APPOINTMENT_STATUS.CANCELLED;

    if (aIsCancelled && !bIsCancelled) return 1;
    if (!aIsCancelled && bIsCancelled) return -1;

    const aDiff = Math.abs(aDate - now);
    const bDiff = Math.abs(bDate - now);

    return aDiff - bDiff;
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Lịch sử lịch hẹn ({appointments.length})
          </h3>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
            <p className="text-gray-500">Hãy đặt lịch hẹn hiến máu đầu tiên của bạn!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedAppointments.map((appointment) => (
              <div key={appointment.appointmentId} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          Lịch hẹn #{appointment.appointmentId}
                        </span>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className={isToday(appointment.appointmentDate) ? 'font-medium text-blue-600' : ''}>
                          {formatVietnamTime(appointment.appointmentDate)}
                          {isToday(appointment.appointmentDate) && (
                            <span className="ml-1 text-blue-500">(Hôm nay)</span>
                          )}
                        </span>
                        {isPastDue(appointment.appointmentDate, appointment.status) && (
                          <div className="text-red-500 text-xs">Quá hạn</div>
                        )}
                      </div>
                    </div>

                    {appointment.status === APPOINTMENT_STATUS.PENDING && (
                      <div className="flex items-center space-x-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded mb-3">
                        <Clock className="w-4 h-4" />
                        <span>Lịch hẹn đang chờ xác nhận từ nhân viên y tế</span>
                      </div>
                    )}

                    {appointment.status === APPOINTMENT_STATUS.SCHEDULED && (
                      <div className="flex items-center space-x-2 text-sm text-blue-700 bg-blue-50 p-2 rounded mb-3">
                        <CheckCircle className="w-4 h-4" />
                        <span>Lịch hẹn đã được xác nhận. Vui lòng đến đúng giờ hẹn.</span>
                      </div>
                    )}

                    {appointment.status === APPOINTMENT_STATUS.COMPLETED && (
                      <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-2 rounded mb-3">
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          Đã hoàn thành
                        </span>
                      </div>
                    )}

                    {appointment.status === APPOINTMENT_STATUS.MEDICAL_COMPLETED && (
                      <div className="flex items-center space-x-2 text-sm bg-purple-100 text-purple-800 border-purple-200 p-2 rounded mb-3">
                        <UserCheck className="w-4 h-4" />
                        <span>
                          Đã kiểm tra y tế
                        </span>
                      </div>
                    )}

                    {appointment.status === APPOINTMENT_STATUS.CANCELLED && (
                      <div className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 p-2 rounded mb-3">
                        <XCircle className="w-4 h-4" />
                        <span>Lịch hẹn đã bị hủy</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 mt-3">
                      {/* Nút xem chi tiết */}
                      <button
                        onClick={() => handleViewDetailsClick(appointment.appointmentId)}
                        disabled={loadingDetails}
                        className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xem chi tiết lịch hẹn"
                      >
                        {loadingDetails ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        <span>{loadingDetails ? 'Đang tải...' : 'Chi tiết'}</span>
                      </button>

                      {/* Nút xem khai báo y tế */}
                      <button
                        onClick={() => handleViewHealthDeclaration(appointment.appointmentId)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        title="Xem khai báo y tế"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Khai báo y tế</span>
                      </button>
                    </div>
                  </div>

                  {canCancel(appointment) && (
                    <div className="ml-4">
                      <button
                        onClick={() => onCancel(appointment.appointmentId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hủy lịch hẹn"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <HealthDeclarationModal
        isOpen={healthModalOpen}
        onClose={handleCloseHealthModal}
        appointmentId={selectedAppointmentId}
      />
    </>
  );
};

export default AppointmentHistory;