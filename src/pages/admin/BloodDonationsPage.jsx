import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Tag, Space, Input, Select, DatePicker } from 'antd';
import { Search, Eye, Droplet, Filter, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { getBloodDonations } from '../../services/bloodDonationService';
import { getUserById } from '../../services/userService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getUserHealthChecks } from '../../services/healthCheckService';
import { BLOOD_DONATION_STATUS } from '../../utils/constants';
import BloodDonationDetailModal from '../../components/admin-details/BloodDonationDetailModal';
import HealthCheckDetailModal from '../../components/admin-details/HealthCheckDetailModal';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const BloodDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [dateRange, setDateRange] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [bloodTypes, setBloodTypes] = useState([]);
  const [healthChecks, setHealthChecks] = useState({});
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [healthCheckModalVisible, setHealthCheckModalVisible] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedHealthCheckUserId, setSelectedHealthCheckUserId] = useState(null);

  const fetchBloodTypes = async () => {
    try {
      const response = await getBloodTypes();
      if (response.status === 200) {
        setBloodTypes(response.data.data.content);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách nhóm máu');
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const userResponse = await getUserById(userId);
      return userResponse.data.data.fullName;
    } catch (error) {
      return 'Unknown User';
    }
  };

  const fetchHealthCheckData = async (userId, healthCheckId) => {
    try {
      const response = await getUserHealthChecks(userId);
      if (response.status === 200) {
        const healthCheck = response.data.data.content.find(hc => hc.healthCheckId === healthCheckId);
        return healthCheck;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const fetchBloodDonations = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await getBloodDonations(page, size);
      if (response.status === 200) {
        const donationData = response.data.data.content;
        setDonations(donationData);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.page.totalElements
        }));
        const userIds = [...new Set(donationData.map(donation => donation.user))];
        const userPromises = userIds.map(async (userId) => {
          const name = await fetchUserData(userId);
          return { userId, name };
        });
        const userResults = await Promise.all(userPromises);
        const userMap = {};
        userResults.forEach(({ userId, name }) => {
          userMap[userId] = name;
        });
        setUserNames(userMap);

        const healthCheckPromises = donationData.map(async (donation) => {
          const healthCheck = await fetchHealthCheckData(donation.user, donation.healthCheck);
          return { donationId: donation.donationId, healthCheck };
        });

        const healthCheckResults = await Promise.all(healthCheckPromises);
        const healthCheckMap = {};
        healthCheckResults.forEach(({ donationId, healthCheck }) => {
          healthCheckMap[donationId] = healthCheck;
        });
        setHealthChecks(healthCheckMap);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách hiến máu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodTypes();
    fetchBloodDonations();
  }, []);

  const handleTableChange = (paginationInfo) => {
    setPagination(paginationInfo);
    fetchBloodDonations(paginationInfo.current - 1, paginationInfo.pageSize);
  };

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

  const getEligibilityColor = (isEligible) => {
    return isEligible ? 'green' : 'red';
  };

  const getEligibilityText = (isEligible) => {
    return isEligible ? 'Đủ điều kiện' : 'Không đủ điều kiện';
  };

  const filteredDonations = donations.filter(donation => {
    const userName = userNames[donation.user] || '';
    const bloodType = getBloodTypeName(donation.bloodType);
    const matchesSearch = userName.toLowerCase().includes(searchText.toLowerCase()) ||
      bloodType.toLowerCase().includes(searchText.toLowerCase()) ||
      donation.donationId.toString().includes(searchText);

    const matchesStatus = !statusFilter || donation.status === statusFilter;

    const matchesDate = !dateRange ||
      (dayjs(donation.donationDate).isAfter(dateRange[0].startOf('day')) &&
        dayjs(donation.donationDate).isBefore(dateRange[1].endOf('day')));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleFilter = () => {
    toast.success('Đã áp dụng bộ lọc');
  };

  const handleResetFilter = () => {
    setSearchText('');
    setStatusFilter(undefined);
    setDateRange(null);
    toast.success('Đã đặt lại bộ lọc');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'donationId',
      key: 'donationId',
      width: 80
    },
    {
      title: 'Người hiến',
      dataIndex: 'user',
      key: 'user',
      render: (userId) => userNames[userId] || 'Đang tải...'
    },
    {
      title: 'Ngày hiến',
      dataIndex: 'donationDate',
      key: 'donationDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (bloodTypeId) => (
        <Tag color="blue">{getBloodTypeName(bloodTypeId)}</Tag>
      )
    },
    {
      title: 'Thể tích (ml)',
      dataIndex: 'volumeMl',
      key: 'volumeMl',
      render: (volume) => `${volume} ml`,
      sorter: (a, b) => a.volumeMl - b.volumeMl
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Kiểm tra sức khỏe',
      dataIndex: 'healthCheck',
      key: 'healthCheck',
      render: (healthCheckId, record) => {
        const healthCheck = healthChecks[record.donationId];
        if (!healthCheck) return 'Đang tải...';

        return (
          <Space direction="vertical" size="small">
            <Tag color={getEligibilityColor(healthCheck.isEligible)}>
              {getEligibilityText(healthCheck.isEligible)}
            </Tag>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Mạch: {healthCheck.pulse} | BP: {healthCheck.bloodPressure}
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<Eye size={16} />}
            onClick={() => handleViewDetail(record.donationId)}
          >
            Chi tiết
          </Button>
          <Button
            size="small"
            icon={<FileText size={16} />}
            onClick={() => handleViewHealthCheck(record.donationId)}
          >
            KT Sức khỏe
          </Button>
        </Space>
      )
    }
  ];

  const handleViewDetail = (donationId) => {
    const donation = donations.find(don => don.donationId === donationId);
    setSelectedDonation(donation);
    setDonationModalVisible(true);
  };

  const handleViewHealthCheck = (donationId) => {
    const donation = donations.find(don => don.donationId === donationId);
    setSelectedDonation(donation);
    const healthCheck = healthChecks[donationId];
    if (healthCheck && donation) {
      setSelectedHealthCheckUserId(donation.user);
      setHealthCheckModalVisible(true);
    } else {
      toast.error('Không tìm thấy thông tin kiểm tra sức khỏe');
    }
  };

  const handleCloseDonationModal = () => {
    setDonationModalVisible(false);
    setSelectedDonation(null);
  };

  const handleCloseHealthCheckModal = () => {
    setHealthCheckModalVisible(false);
    setSelectedHealthCheckUserId(null);
  };


  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Lịch sử hiến máu
        </Title>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm theo tên, nhóm máu, ID..."
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        <Select
          placeholder="Chọn trạng thái"
          style={{ width: 200 }}
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
        >
          <Select.Option value={BLOOD_DONATION_STATUS.PENDING}>Chờ xử lý</Select.Option>
          <Select.Option value={BLOOD_DONATION_STATUS.APPROVED}>Đã duyệt</Select.Option>
          <Select.Option value={BLOOD_DONATION_STATUS.REJECTED}>Từ chối</Select.Option>
          <Select.Option value={BLOOD_DONATION_STATUS.COMPLETED}>Hoàn thành</Select.Option>
          <Select.Option value={BLOOD_DONATION_STATUS.CANCELLED}>Đã hủy</Select.Option>
        </Select>

        <RangePicker
          style={{ width: 300 }}
          placeholder={['Từ ngày', 'Đến ngày']}
          value={dateRange}
          onChange={setDateRange}
        />

        <Button
          type="primary"
          icon={<Filter size={16} />}
          onClick={handleFilter}
        >
          Lọc
        </Button>

        <Button onClick={handleResetFilter}>
          Đặt lại
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredDonations}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="donationId"
        scroll={{ x: 1200 }}
      />

      <BloodDonationDetailModal
        visible={donationModalVisible}
        onCancel={handleCloseDonationModal}
        donation={selectedDonation}
      />

      <HealthCheckDetailModal
        visible={healthCheckModalVisible}
        onCancel={handleCloseHealthCheckModal}
        healthCheck={selectedDonation ? healthChecks[selectedDonation.healthCheck] : null}
        userId={selectedHealthCheckUserId}
      />
    </Card>
  );
};

export default BloodDonationsPage;