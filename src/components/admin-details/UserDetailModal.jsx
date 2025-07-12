import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Spin, Avatar, Button, Space } from 'antd';
import { User, Mail, Shield, Activity, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { getUserById } from '../../services/userService';

const UserDetailModal = ({ visible, onCancel, userId, userType = 'member' }) => {
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'STAFF': return 'blue';
      case 'MEMBER': return 'green';
      default: return 'default';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'STAFF': return 'Nhân viên';
      case 'MEMBER': return 'Thành viên';
      default: return role;
    }
  };

  const getTitle = () => {
    switch (userType) {
      case 'staff': return 'Chi tiết nhân viên';
      case 'member': return 'Chi tiết thành viên';
      default: return 'Chi tiết người dùng';
    }
  };

  const handleEdit = () => {
    toast.error('Tính năng hiện chưa có');
  };

  const handleToggleStatus = () => {
    if (user) {
      const action = user.status ? 'vô hiệu hóa' : 'kích hoạt';
      toast.success(`${action} tài khoản thành công`);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={20} />
          {getTitle()}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={600}
      style={{ top: 10 }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Đóng
        </Button>,
        <Button key="edit" type="primary" onClick={handleEdit}>
          Chỉnh sửa
        </Button>,
        // <Button
        //   key="toggle"
        //   type={user?.status ? 'default' : 'primary'}
        //   danger={user?.status}
        //   onClick={handleToggleStatus}
        // >
        //   {user?.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
        // </Button>
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : user ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar
              size={80}
              icon={<User />}
              style={{ backgroundColor: '#1890ff' }}
            />
            <h3 style={{ margin: '16px 0 8px' }}>{user.fullName}</h3>
            <Tag color={getRoleColor(user.role)} style={{ fontSize: '14px' }}>
              {getRoleText(user.role)}
            </Tag>
          </div>

          <Descriptions column={1} bordered>
            <Descriptions.Item
              label={
                <Space>
                  <User size={16} />
                  ID người dùng
                </Space>
              }
            >
              {user.id}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <User size={16} />
                  Họ và tên
                </Space>
              }
            >
              {user.fullName}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Mail size={16} />
                  Email
                </Space>
              }
            >
              {user.email}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Shield size={16} />
                  Vai trò
                </Space>
              }
            >
              <Tag color={getRoleColor(user.role)}>
                {getRoleText(user.role)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Activity size={16} />
                  Trạng thái
                </Space>
              }
            >
              <Tag color={user.status ? 'green' : 'red'}>
                {user.status ? 'Hoạt động' : 'Không hoạt động'}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Calendar size={16} />
                  Ngày tạo
                </Space>
              }
            >
              {user.createdAt ? dayjs(user.createdAt).format('DD/MM/YYYY HH:mm') : 'Không có thông tin'}
            </Descriptions.Item>
          </Descriptions>

          {userType === 'member' && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <h4>Thông tin hiến máu</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Thành viên có thể đăng ký hiến máu và tham gia các hoạt động từ thiện
              </p>
            </div>
          )}

          {userType === 'staff' && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <h4>Quyền hạn nhân viên</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Có thể quản lý cuộc hẹn, kiểm tra sức khỏe và hỗ trợ thành viên
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          Không tìm thấy thông tin người dùng
        </div>
      )}
    </Modal>
  );
};

export default UserDetailModal;