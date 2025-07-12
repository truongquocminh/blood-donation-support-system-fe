import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Spin, Button, Space, Divider, Progress } from 'antd';
import { Droplet, User, Calendar, Activity, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { getUserById } from '../../services/userService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getUserHealthChecks } from '../../services/healthCheckService';
import { BLOOD_DONATION_STATUS } from '../../utils/constants';

const BloodDonationDetailModal = ({ visible, onCancel, donation }) => {
  const [user, setUser] = useState(null);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [healthCheck, setHealthCheck] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!donation) return;

    setLoading(true);
    try {
      const [userRes, bloodTypesRes, healthCheckRes] = await Promise.all([
        getUserById(donation.user),
        getBloodTypes(),
        getUserHealthChecks(donation.user)
      ]);

      if (userRes.status === 200) {
        setUser(userRes.data.data);
      }

      if (bloodTypesRes.status === 200) {
        setBloodTypes(bloodTypesRes.data.data.content);
      }

      if (healthCheckRes.status === 200) {
        const foundHealthCheck = healthCheckRes.data.data.content.find(
          hc => hc.healthCheckId === donation.healthCheck
        );
        setHealthCheck(foundHealthCheck);
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin chi tiết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && donation) {
      fetchData();
    }
  }, [visible, donation]);

  const getBloodTypeName = (bloodTypeId) => {
    const bloodType = bloodTypes.find(bt => bt.id === bloodTypeId);
    return bloodType ? bloodType.typeName : 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case BLOOD_DONATION_STATUS.PENDING: return 'orange';
      case BLOOD_DONATION_STATUS.APPROVED: return 'blue';
      case BLOOD_DONATION_STATUS.REJECTED: return 'red';
      case BLOOD_DONATION_STATUS.COMPLETED: return 'green';
      case BLOOD_DONATION_STATUS.CANCELLED: return 'gray';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case BLOOD_DONATION_STATUS.PENDING: return 'Chờ xử lý';
      case BLOOD_DONATION_STATUS.APPROVED: return 'Đã duyệt';
      case BLOOD_DONATION_STATUS.REJECTED: return 'Từ chối';
      case BLOOD_DONATION_STATUS.COMPLETED: return 'Hoàn thành';
      case BLOOD_DONATION_STATUS.CANCELLED: return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case BLOOD_DONATION_STATUS.COMPLETED: return <CheckCircle size={16} />;
      case BLOOD_DONATION_STATUS.REJECTED:
      case BLOOD_DONATION_STATUS.CANCELLED: return <XCircle size={16} />;
      case BLOOD_DONATION_STATUS.PENDING: return <AlertCircle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getVolumeProgress = (volume) => {
    const maxVolume = 500;
    const percentage = Math.min((volume / maxVolume) * 100, 100);
    let status = 'normal';
    if (volume >= 400) status = 'success';
    else if (volume >= 250) status = 'normal';
    else status = 'exception';

    return { percentage, status };
  };

  const handleApprove = () => {
    toast.success(`Duyệt phiếu hiến máu ID: ${donation.donationId}`);
  };

  const handleReject = () => {
    toast.success(`Từ chối phiếu hiến máu ID: ${donation.donationId}`);
  };

  const handleComplete = () => {
    toast.success(`Hoàn thành hiến máu ID: ${donation.donationId}`);
  };

  const handleCancel = () => {
    toast.success(`Hủy phiếu hiến máu ID: ${donation.donationId}`);
  };

  const canApprove = donation?.status === BLOOD_DONATION_STATUS.PENDING;
  const canReject = donation?.status === BLOOD_DONATION_STATUS.PENDING;
  const canComplete = donation?.status === BLOOD_DONATION_STATUS.APPROVED;
  const canCancelDonation = [BLOOD_DONATION_STATUS.PENDING, BLOOD_DONATION_STATUS.APPROVED].includes(donation?.status);

  const { percentage, status } = donation ? getVolumeProgress(donation.volumeMl) : { percentage: 0, status: 'normal' };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Droplet size={20} />
          Chi tiết phiếu hiến máu
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      style={{ top: 10 }}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
        ...(canApprove ? [
          <Button key="approve" type="primary" onClick={handleApprove}>
            Duyệt phiếu
          </Button>
        ] : []),
        ...(canReject ? [
          <Button key="reject" danger onClick={handleReject}>
            Từ chối
          </Button>
        ] : []),
        ...(canComplete ? [
          <Button key="complete" type="primary" onClick={handleComplete}>
            Hoàn thành
          </Button>
        ] : []),
        ...(canCancelDonation ? [
          <Button key="cancel-donation" onClick={handleCancel}>
            Hủy phiếu
          </Button>
        ] : [])
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : donation ? (
        <div>
          <Descriptions title="Thông tin phiếu hiến máu" column={2} bordered>
            <Descriptions.Item
              label={
                <Space>
                  <FileText size={16} />
                  Mã phiếu
                </Space>
              }
              span={2}
            >
              <Tag color="blue">#{donation.donationId}</Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Calendar size={16} />
                  Ngày hiến máu
                </Space>
              }
            >
              {dayjs(donation.donationDate).format('DD/MM/YYYY')}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Droplet size={16} />
                  Nhóm máu
                </Space>
              }
            >
              <Tag color="red" style={{ fontSize: '16px', padding: '4px 8px' }}>
                {getBloodTypeName(donation.bloodType)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Activity size={16} />
                  Thể tích hiến
                </Space>
              }
              span={2}
            >
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={status === 'success' ? 'green' : status === 'exception' ? 'red' : 'blue'} style={{ fontSize: '16px', padding: '4px 12px' }}>
                    {donation.volumeMl} ml
                  </Tag>
                </div>
                <Progress
                  percent={percentage}
                  status={status}
                  format={() => `${donation.volumeMl}/500 ml`}
                />
              </div>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  {getStatusIcon(donation.status)}
                  Trạng thái
                </Space>
              }
              span={2}
            >
              <Tag color={getStatusColor(donation.status)} style={{ fontSize: '14px' }}>
                {getStatusText(donation.status)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions title="Thông tin người hiến" column={1} bordered>
            <Descriptions.Item
              label={
                <Space>
                  <User size={16} />
                  ID người dùng
                </Space>
              }
            >
              {donation.user}
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
          </Descriptions>

          <Divider />

          <Descriptions title="Thông tin kiểm tra sức khỏe" column={2} bordered>
            {healthCheck ? (
              <>
                <Descriptions.Item label="Mã kiểm tra">
                  <Tag color="blue">#{healthCheck.healthCheckId}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Thời gian kiểm tra">
                  {dayjs(healthCheck.checkedAt).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>

                <Descriptions.Item label="Mạch">
                  <Tag color="blue">{healthCheck.pulse} bpm</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Huyết áp">
                  <Tag color="green">{healthCheck.bloodPressure}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Kết quả" span={2}>
                  <Tag color={healthCheck.isEligible ? 'green' : 'red'} style={{ fontSize: '14px' }}>
                    {healthCheck.isEligible ? '✅ Đủ điều kiện hiến máu' : '❌ Không đủ điều kiện hiến máu'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Tóm tắt kết quả" span={2}>
                  {healthCheck.resultSummary || 'Không có ghi chú'}
                </Descriptions.Item>

                {!healthCheck.isEligible && healthCheck.ineligibleReason && (
                  <Descriptions.Item label="Lý do không đủ điều kiện" span={2}>
                    <Tag color="red">{healthCheck.ineligibleReason}</Tag>
                  </Descriptions.Item>
                )}
              </>
            ) : (
              <Descriptions.Item span={2}>
                Đang tải thông tin kiểm tra sức khỏe...
              </Descriptions.Item>
            )}
          </Descriptions>

          {donation.status === BLOOD_DONATION_STATUS.COMPLETED && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8 }}>
              <h4 style={{ color: '#389e0d' }}>🎉 Hiến máu thành công</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Cảm ơn bạn đã hiến {donation.volumeMl}ml máu nhóm {getBloodTypeName(donation.bloodType)} vào ngày {dayjs(donation.donationDate).format('DD/MM/YYYY')}.
                Đây là một hành động ý nghĩa giúp cứu sống nhiều người.
              </p>
            </div>
          )}

          {donation.status === BLOOD_DONATION_STATUS.REJECTED && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8 }}>
              <h4 style={{ color: '#cf1322' }}>❌ Phiếu hiến máu bị từ chối</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Phiếu hiến máu đã bị từ chối. Lý do: {donation.rejectReason || 'Không đủ điều kiện sức khỏe'}
              </p>
            </div>
          )}

          {donation.status === BLOOD_DONATION_STATUS.PENDING && healthCheck && !healthCheck.isEligible && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#fff7e6', border: '1px solid #ffd591', borderRadius: 8 }}>
              <h4 style={{ color: '#d48806' }}>⚠️ Cảnh báo sức khỏe</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Người hiến không đủ điều kiện sức khỏe để hiến máu. Lý do: {healthCheck.ineligibleReason}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          Không tìm thấy thông tin phiếu hiến máu
        </div>
      )}
    </Modal>
  );
};

export default BloodDonationDetailModal;