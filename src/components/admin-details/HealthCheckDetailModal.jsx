import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Spin, Button, Space, Progress } from 'antd';
import { Activity, User, Calendar, Heart, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { getUserById } from '../../services/userService';

const HealthCheckDetailModal = ({ visible, onCancel, healthCheck, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDetail = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await getUserById(userId);
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
    if (visible && userId) {
      fetchUserDetail();
    }
  }, [visible, userId]);

  const getPulseStatus = (pulse) => {
    if (pulse < 60) return { status: 'low', text: 'Thấp', color: 'orange' };
    if (pulse > 100) return { status: 'high', text: 'Cao', color: 'red' };
    return { status: 'normal', text: 'Bình thường', color: 'green' };
  };

  const getBloodPressureStatus = (bp) => {
    if (!bp) return { status: 'unknown', text: 'Không xác định', color: 'default' };

    const [systolic, diastolic] = bp.split('/').map(num => parseInt(num.trim()));

    if (systolic < 90 || diastolic < 60) {
      return { status: 'low', text: 'Thấp', color: 'orange' };
    }
    if (systolic > 140 || diastolic > 90) {
      return { status: 'high', text: 'Cao', color: 'red' };
    }
    return { status: 'normal', text: 'Bình thường', color: 'green' };
  };

  const getEligibilityIcon = (isEligible) => {
    return isEligible ? <CheckCircle size={16} /> : <XCircle size={16} />;
  };

  const getEligibilityColor = (isEligible) => {
    return isEligible ? 'green' : 'red';
  };

  const getEligibilityText = (isEligible) => {
    return isEligible ? 'Đủ điều kiện hiến máu' : 'Không đủ điều kiện hiến máu';
  };

  const handleApprove = () => {
    toast.success(`Duyệt kết quả kiểm tra sức khỏe ID: ${healthCheck.healthCheckId}`);
  };

  const handleReject = () => {
    toast.success(`Từ chối kết quả kiểm tra sức khỏe ID: ${healthCheck.healthCheckId}`);
  };

  const handleEdit = () => {
    toast.success(`Chỉnh sửa kết quả kiểm tra sức khỏe ID: ${healthCheck.healthCheckId}`);
  };

  const pulseStatus = healthCheck ? getPulseStatus(healthCheck.pulse) : null;
  const bpStatus = healthCheck ? getBloodPressureStatus(healthCheck.bloodPressure) : null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={20} />
          Chi tiết kiểm tra sức khỏe
        </div>
      }
      style={{ top: 10 }}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
        // <Button key="edit" onClick={handleEdit}>
        //   Chỉnh sửa
        // </Button>,
        ...(healthCheck?.isEligible ? [
          // <Button key="approve" type="primary" onClick={handleApprove}>
          //   Duyệt kết quả
          // </Button>
        ] : [
          // <Button key="reject" danger onClick={handleReject}>
          //   Từ chối
          // </Button>
        ])
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : healthCheck ? (
        <div>
          <Descriptions title="Thông tin kiểm tra" column={2} bordered>
            <Descriptions.Item
              label={
                <Space>
                  <Activity size={16} />
                  Mã kiểm tra
                </Space>
              }
              span={2}
            >
              <Tag color="blue">#{healthCheck.healthCheckId}</Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Calendar size={16} />
                  Thời gian kiểm tra
                </Space>
              }
              span={2}
            >
              {dayjs(healthCheck.checkedAt).format('DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <User size={16} />
                  Người được kiểm tra
                </Space>
              }
              span={2}
            >
              {user ? user.fullName : 'Đang tải...'}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ margin: '24px 0' }}>
            <h4>Chỉ số sức khỏe</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Heart size={20} color={pulseStatus?.color === 'green' ? '#52c41a' : pulseStatus?.color === 'red' ? '#ff4d4f' : '#faad14'} />
                  <strong>Nhịp tim</strong>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 8 }}>
                  {healthCheck.pulse} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>bpm</span>
                </div>
                <Tag color={pulseStatus?.color}>{pulseStatus?.text}</Tag>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    percent={Math.min((healthCheck.pulse / 120) * 100, 100)}
                    strokeColor={pulseStatus?.color === 'green' ? '#52c41a' : pulseStatus?.color === 'red' ? '#ff4d4f' : '#faad14'}
                    showInfo={false}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    Bình thường: 60-100 bpm
                  </div>
                </div>
              </div>

              <div style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <TrendingUp size={20} color={bpStatus?.color === 'green' ? '#52c41a' : bpStatus?.color === 'red' ? '#ff4d4f' : '#faad14'} />
                  <strong>Huyết áp</strong>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 8 }}>
                  {healthCheck.bloodPressure} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>mmHg</span>
                </div>
                <Tag color={bpStatus?.color}>{bpStatus?.text}</Tag>
                <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                  Bình thường: 90/60 - 140/90 mmHg
                </div>
              </div>
            </div>
          </div>

          <Descriptions title="Kết quả đánh giá" column={1} bordered>
            <Descriptions.Item
              label={
                <Space>
                  {getEligibilityIcon(healthCheck.isEligible)}
                  Kết quả tổng thể
                </Space>
              }
            >
              <Tag color={getEligibilityColor(healthCheck.isEligible)} style={{ fontSize: '16px', padding: '4px 12px' }}>
                {getEligibilityText(healthCheck.isEligible)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Tóm tắt kết quả">
              {healthCheck.resultSummary || 'Không có ghi chú đặc biệt'}
            </Descriptions.Item>

            {!healthCheck.isEligible && (
              <Descriptions.Item
                label={
                  <Space>
                    <AlertCircle size={16} />
                    Lý do không đủ điều kiện
                  </Space>
                }
              >
                <Tag color="red">{healthCheck.ineligibleReason || 'Không có lý do cụ thể'}</Tag>
              </Descriptions.Item>
            )}

            {healthCheck.bloodTypeId && (
              <Descriptions.Item label="Nhóm máu được xác định">
                <Tag color="red">{healthCheck.bloodTypeName || `ID: ${healthCheck.bloodTypeId}`}</Tag>
              </Descriptions.Item>
            )}
          </Descriptions>

          {healthCheck.isEligible ? (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8 }}>
              <h4 style={{ color: '#389e0d' }}>✅ Đủ điều kiện hiến máu</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Kết quả kiểm tra sức khỏe cho thấy người này đủ điều kiện để hiến máu.
                Các chỉ số sức khỏe đều trong mức bình thường.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8 }}>
              <h4 style={{ color: '#cf1322' }}>❌ Không đủ điều kiện hiến máu</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Dựa trên kết quả kiểm tra, người này hiện tại không đủ điều kiện hiến máu.
                Lý do: {healthCheck.ineligibleReason || 'Các chỉ số sức khỏe chưa đạt yêu cầu'}
              </p>
            </div>
          )}

          <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f0f9ff', border: '1px solid #91d5ff', borderRadius: 8 }}>
            <h4 style={{ color: '#1890ff' }}>💡 Ghi chú cho bác sĩ</h4>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#666' }}>
              <li>Nhịp tim bình thường: 60-100 bpm khi nghỉ ngơi</li>
              <li>Huyết áp bình thường: 90/60 - 140/90 mmHg</li>
              <li>Cần đánh giá tổng thể tình trạng sức khỏe trước khi hiến máu</li>
              <li>Thời gian chờ tối thiểu giữa các lần hiến máu: 8-12 tuần</li>
            </ul>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          Không tìm thấy thông tin kiểm tra sức khỏe
        </div>
      )}
    </Modal>
  );
};

export default HealthCheckDetailModal;