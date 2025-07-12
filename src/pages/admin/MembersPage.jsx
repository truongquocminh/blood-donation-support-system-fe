import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Tag, Space, Input } from 'antd';
import { Search, Eye, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers } from '../../services/userService';
import UserDetailModal from '../../components/admin-details/UserDetailModal';

const { Title } = Typography;

const MembersPage = () => {
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

  const fetchUsers = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await getUsers(page, size);
      if (response.status === 200) {
        const members = response.data.data.content.users.filter(user => user.role === 'MEMBER');
        setUsers(members);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.page.totalElements
        }));
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách thành viên');
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

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý thành viên
        </Title>
       
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
        userType="member"
      />
    </Card>
  );
};

export default MembersPage;