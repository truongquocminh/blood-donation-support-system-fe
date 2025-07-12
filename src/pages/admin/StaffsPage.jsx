import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Tag, Space, Input, Modal, Form } from 'antd';
import { Search, Eye, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers } from '../../services/userService';
import { createStaff } from '../../services/authService';
import UserDetailModal from '../../components/admin-details/UserDetailModal';

const { Title } = Typography;

const StaffsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
  const [addStaffLoading, setAddStaffLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await getUsers(page, size);
      if (response.status === 200) {
        const staffs = response.data.data.content.users.filter(user => user.role === 'STAFF');
        setUsers(staffs);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.page.totalElements
        }));
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (paginationInfo) => {
    setPagination(paginationInfo);
    fetchUsers(paginationInfo.current - 1, paginationInfo.pageSize);
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Hoạt động' : 'Không hoạt động'}
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
            onClick={() => handleViewDetail(record.id)}
          >
            Chi tiết
          </Button>
        </Space>
      )
    }
  ];

  const handleViewDetail = (userId) => {
    setSelectedUserId(userId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUserId(null);
  };

  const handleAddStaff = () => {
    setAddStaffModalVisible(true);
  };

  const handleAddStaffCancel = () => {
    setAddStaffModalVisible(false);
    form.resetFields();
  };

  const handleAddStaffSubmit = async (values) => {
    setAddStaffLoading(true);
    try {
      const response = await createStaff(values);
      if (response.status === 200 || response.status === 201) {
        toast.success('Thêm nhân viên thành công');
        setAddStaffModalVisible(false);
        form.resetFields();
        fetchUsers();
      }
    } catch (error) {
      if (error.response?.data?.data) {
        const errorData = error.response.data.data;
        const errorMessage = Object.values(errorData)[0];
        toast.error(errorMessage);
      } else {
        toast.error('Lỗi khi thêm nhân viên');
      }
    } finally {
      setAddStaffLoading(false);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý nhân viên
        </Title>
        <Button
          type="primary"
          icon={<UserPlus size={16} />}
          onClick={handleAddStaff}
        >
          Thêm nhân viên
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: 800 }}
      />

      <UserDetailModal
        visible={modalVisible}
        onCancel={handleCloseModal}
        userId={selectedUserId}
        userType="staff"
      />

      <Modal
        title="Thêm nhân viên mới"
        open={addStaffModalVisible}
        onCancel={handleAddStaffCancel}
        footer={[
          <Button key="cancel" onClick={handleAddStaffCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={addStaffLoading}
            onClick={() => form.submit()}
          >
            Thêm
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddStaffSubmit}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                }
              })
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' }
            ]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default StaffsPage;