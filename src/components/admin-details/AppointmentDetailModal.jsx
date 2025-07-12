import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Spin, Button, Space, Divider } from 'antd';
import { Calendar, User, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { getUserById } from '../../services/userService'; 
import { APPOINTMENT_STATUS } from '../../utils/constants'; 

const AppointmentDetailModal = ({ visible, onCancel, appointment }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDetail = async () => {
    if (!appointment?.userId) return;
    
    setLoading(true);
    try {
      const response = await getUserById(appointment.userId);
      if (response.status === 200) {
        setUser(response.data.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && appointment) {
      fetchUserDetail();
    }
  }, [visible, appointment]);

  const getStatusColor = (status) => {
    switch (status) {
      case APPOINTMENT_STATUS.PENDING: return 'orange';
      case APPOINTMENT_STATUS.SCHEDULED: return 'blue';
      case APPOINTMENT_STATUS.COMPLETED: return 'green';
      case APPOINTMENT_STATUS.CANCELLED: return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case APPOINTMENT_STATUS.PENDING: return 'Chờ xử lý';
      case APPOINTMENT_STATUS.SCHEDULED: return 'Đã lên lịch';
      case APPOINTMENT_STATUS.COMPLETED: return 'Hoàn thành';
      case APPOINTMENT_STATUS.CANCELLED: return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case APPOINTMENT_STATUS.COMPLETED: return <CheckCircle size={16} />;
      case APPOINTMENT_STATUS.CANCELLED: return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleApprove = () => {
    toast.success(`Duyệt cuộc hẹn ID: ${appointment.appointmentId}`);
  };

  const handleCancel = () => {
    toast.success(`Hủy cuộc hẹn ID: ${appointment.appointmentId}`);
  };

  const handleComplete = () => {
    toast.success(`Hoàn thành cuộc hẹn ID: ${appointment.appointmentId}`);
  };

  const canApprove = appointment?.status === APPOINTMENT_STATUS.PENDING;
  const canComplete = appointment?.status === APPOINTMENT_STATUS.SCHEDULED;
  const canCancelAppt = appointment?.status === APPOINTMENT_STATUS.PENDING || appointment?.status === APPOINTMENT_STATUS.SCHEDULED;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={20} />
          Chi tiết cuộc hẹn
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
        ...(canApprove ? [
          <Button key="approve" type="primary" onClick={handleApprove}>
            Duyệt cuộc hẹn
          </Button>
        ] : []),
        ...(canComplete ? [
          <Button key="complete" type="primary" onClick={handleComplete}>
            Hoàn thành
          </Button>
        ] : []),
        ...(canCancelAppt ? [
          <Button key="cancel-appt" danger onClick={handleCancel}>
            Hủy cuộc hẹn
          </Button>
        ] : [])
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : appointment ? (
        <div>
          <Descriptions title="Thông tin cuộc hẹn" column={2} bordered>
            <Descriptions.Item 
              label={
                <Space>
                  <FileText size={16} />
                  Mã cuộc hẹn
                </Space>
              }
              span={2}
            >
              <Tag color="blue">#{appointment.appointmentId}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  <Calendar size={16} />
                  Ngày hẹn
                </Space>
              }
            >
              {dayjs(appointment.appointmentDate).format('DD/MM/YYYY')}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  <Clock size={16} />
                  Thời gian
                </Space>
              }
            >
              {dayjs(appointment.appointmentDate).format('HH:mm')}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  {getStatusIcon(appointment.status)}
                  Trạng thái
                </Space>
              }
              span={2}
            >
              <Tag color={getStatusColor(appointment.status)} style={{ fontSize: '14px' }}>
                {getStatusText(appointment.status)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions title="Thông tin người đăng ký" column={1} bordered>
            <Descriptions.Item 
              label={
                <Space>
                  <User size={16} />
                  ID người dùng
                </Space>
              }
            >
              {appointment.userId}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  <User size={16} />
                  Họ và tên
                </Space>
              }
            >
              {user ? user.fullName : 'Đang tải...'}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  <User size={16} />
                  Email
                </Space>
              }
            >
              {user ? user.email : 'Đang tải...'}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  <User size={16} />
                  Vai trò
                </Space>
              }
            >
              {user ? (
                <Tag color={user.role === 'MEMBER' ? 'green' : 'blue'}>
                  {user.role === 'MEMBER' ? 'Thành viên' : user.role}
                </Tag>
              ) : 'Đang tải...'}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
            <h4>Ghi chú</h4>
            <p style={{ margin: 0, color: '#666' }}>
              {appointment.notes || 'Không có ghi chú đặc biệt cho cuộc hẹn này.'}
            </p>
          </div>

          {appointment.status === APPOINTMENT_STATUS.COMPLETED && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8 }}>
              <h4 style={{ color: '#389e0d' }}>Cuộc hẹn đã hoàn thành</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Cuộc hẹn đã được thực hiện thành công vào {dayjs(appointment.appointmentDate).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
          )}

          {appointment.status === APPOINTMENT_STATUS.CANCELLED && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8 }}>
              <h4 style={{ color: '#cf1322' }}>Cuộc hẹn đã bị hủy</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Lý do hủy: {appointment.cancelReason || 'Không có lý do cụ thể'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          Không tìm thấy thông tin cuộc hẹn
        </div>
      )}
    </Modal>
  );
};

export default AppointmentDetailModal;