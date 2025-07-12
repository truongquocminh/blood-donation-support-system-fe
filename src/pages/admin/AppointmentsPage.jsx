import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Tag, Space, DatePicker, Select, Input } from 'antd';
import { Search, Eye, Calendar, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { filterAppointments } from '../../services/appointmentService';
import { getUserById } from '../../services/userService';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import AppointmentDetailModal from '../../components/admin-details/AppointmentDetailModal';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: undefined,
    dateRange: null,
    userId: undefined
  });
  const [userNames, setUserNames] = useState({});
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async (page = 0, size = 10, filterParams = {}) => {
    setLoading(true);
    try {
      const response = await filterAppointments({
        page,
        size,
        ...filterParams
      });
      if (response.status === 200) {
        const appointmentData = response.data.data.content;
        setAppointments(appointmentData);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.page.totalElements
        }));

        const userIds = [...new Set(appointmentData.map(app => app.userId))];
        const userPromises = userIds.map(async (userId) => {
          try {
            const userResponse = await getUserById(userId);
            return { userId, name: userResponse.data.data.fullName };
          } catch (error) {
            return { userId, name: 'Unknown User' };
          }
        });

        const userResults = await Promise.all(userPromises);
        const userMap = {};
        userResults.forEach(({ userId, name }) => {
          userMap[userId] = name;
        });
        setUserNames(userMap);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách cuộc hẹn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleTableChange = (paginationInfo) => {
    setPagination(paginationInfo);
    fetchAppointments(paginationInfo.current - 1, paginationInfo.pageSize, filters);
  };

  const handleFilter = () => {
    const filterParams = {};
    if (filters.status) filterParams.status = filters.status;
    if (filters.dateRange) {
      filterParams.from = filters.dateRange[0].format('YYYY-MM-DD');
      filterParams.to = filters.dateRange[1].format('YYYY-MM-DD');
    }
    if (filters.userId) filterParams.userId = filters.userId;

    fetchAppointments(0, pagination.pageSize, filterParams);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleResetFilter = () => {
    setFilters({
      status: undefined,
      dateRange: null,
      userId: undefined
    });
    fetchAppointments();
  };

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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
      width: 80
    },
    {
      title: 'Người dùng',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId) => userNames[userId] || 'Đang tải...'
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
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
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<Eye size={16} />}
            onClick={() => handleViewDetail(record.appointmentId)}
          >
            Chi tiết
          </Button>
        </Space>
      )
    }
  ];

  const handleViewDetail = (appointmentId) => {
    const appointment = appointments.find(app => app.appointmentId === appointmentId);
    setSelectedAppointment(appointment);
    setAppointmentModalVisible(true);
  };

  const handleCloseAppointmentModal = () => {
    setAppointmentModalVisible(false);
    setSelectedAppointment(null);
  };

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý cuộc hẹn
        </Title>

      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Select
          placeholder="Chọn trạng thái"
          style={{ width: 200 }}
          allowClear
          value={filters.status}
          onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        >
          <Select.Option value={APPOINTMENT_STATUS.PENDING}>Chờ xử lý</Select.Option>
          <Select.Option value={APPOINTMENT_STATUS.SCHEDULED}>Đã lên lịch</Select.Option>
          <Select.Option value={APPOINTMENT_STATUS.COMPLETED}>Hoàn thành</Select.Option>
          <Select.Option value={APPOINTMENT_STATUS.CANCELLED}>Đã hủy</Select.Option>
        </Select>

        <RangePicker
          style={{ width: 300 }}
          placeholder={['Từ ngày', 'Đến ngày']}
          value={filters.dateRange}
          onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
        />

        <Input
          placeholder="ID người dùng"
          style={{ width: 150 }}
          value={filters.userId}
          onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
        />

        <Button
          type="primary"
          icon={<Filter size={16} />}
          onClick={handleFilter}
          loading={loading}
        >
          Lọc
        </Button>

        <Button onClick={handleResetFilter}>
          Đặt lại
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={appointments}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="appointmentId"
        scroll={{ x: 800 }}
      />

      <AppointmentDetailModal
        visible={appointmentModalVisible}
        onCancel={handleCloseAppointmentModal}
        appointment={selectedAppointment}
      />
    </Card>
  );
};

export default AppointmentsPage;