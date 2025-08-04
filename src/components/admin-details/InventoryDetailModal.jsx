import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Spin, Button, Space, InputNumber, Form } from 'antd';
import { Package, Droplet, Calendar, TrendingUp, TrendingDown, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getBloodComponents } from '../../services/bloodComponentService';

const InventoryDetailModal = ({ visible, onCancel, inventory }) => {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const fetchBloodData = async () => {
    setLoading(true);
    try {
      const [bloodTypesRes, bloodComponentsRes] = await Promise.all([
        getBloodTypes(),
        getBloodComponents()
      ]);

      if (bloodTypesRes.status === 200) {
        setBloodTypes(bloodTypesRes.data.data.content);
      }
      if (bloodComponentsRes.status === 200) {
        setBloodComponents(bloodComponentsRes.data.data.content);
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin máu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchBloodData();
    }
  }, [visible]);

  useEffect(() => {
    if (inventory && editing) {
      form.setFieldsValue({
        quantity: inventory.quantity
      });
    }
  }, [inventory, editing, form]);

  const getBloodTypeName = (bloodTypeId) => {
    const bloodType = bloodTypes.find(bt => bt.id === bloodTypeId);
    return bloodType ? bloodType.typeName : 'Unknown';
  };

  const getBloodComponentName = (bloodComponentId) => {
    const bloodComponent = bloodComponents.find(bc => bc.componentId === bloodComponentId);
    return bloodComponent ? bloodComponent.componentName : 'Unknown';
  };

  const getQuantityColor = (quantity) => {
    if (quantity <= 10) return 'red';
    if (quantity <= 30) return 'orange';
    return 'green';
  };

  const getQuantityStatus = (quantity) => {
    if (quantity <= 10) return 'Mức nguy hiểm';
    if (quantity <= 30) return 'Mức thấp';
    return 'Đủ tồn kho';
  };

  const getQuantityIcon = (quantity) => {
    if (quantity <= 10) return <TrendingDown size={16} />;
    if (quantity <= 30) return <TrendingDown size={16} />;
    return <TrendingUp size={16} />;
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      toast.success(`Cập nhật số lượng tồn kho thành ${values.quantity} ml`);
      setEditing(false);
    } catch (error) {
      toast.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    form.resetFields();
  };

  const handleAdjustStock = (type) => {
    const action = type === 'in' ? 'nhập kho' : 'xuất kho';
    toast.success(`Thực hiện ${action} cho tồn kho ID: ${inventory.id}`);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Package size={20} />
          Chi tiết tồn kho
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      style={{ top: 10 }}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
        ...(editing ? [
          <Button key="cancel-edit" onClick={handleCancelEdit}>
            Hủy
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        ] : [
          // <Button key="stock-out" onClick={() => handleAdjustStock('out')}>
          //   Xuất kho
          // </Button>,
          // <Button key="stock-in" type="primary" onClick={() => handleAdjustStock('in')}>
          //   Nhập kho
          // </Button>,
          // <Button key="edit" icon={<Edit size={16} />} onClick={handleEdit}>
          //   Chỉnh sửa
          // </Button>
        ])
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : inventory ? (
        <div>
          <Descriptions title="Thông tin cơ bản" column={2} bordered>
            <Descriptions.Item
              label={
                <Space>
                  <Package size={16} />
                  Mã tồn kho
                </Space>
              }
              span={2}
            >
              <Tag color="blue">#{inventory.id}</Tag>
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
                {getBloodTypeName(inventory.bloodTypeId)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Package size={16} />
                  Thành phần máu
                </Space>
              }
            >
              {getBloodComponentName(inventory.bloodComponentId)}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  {getQuantityIcon(inventory.quantity)}
                  Số lượng tồn kho
                </Space>
              }
              span={2}
            >
              {editing ? (
                <Form form={form} layout="inline">
                  <Form.Item
                    name="quantity"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số lượng' },
                      { type: 'number', min: 0, message: 'Số lượng phải lớn hơn 0' }
                    ]}
                  >
                    <InputNumber
                      style={{ width: 150 }}
                      placeholder="Nhập số lượng"
                      addonAfter="ml"
                    />
                  </Form.Item>
                </Form>
              ) : (
                <Space>
                  <Tag color={getQuantityColor(inventory.quantity)} style={{ fontSize: '16px', padding: '4px 12px' }}>
                    {inventory.quantity} ml
                  </Tag>
                  <Tag color={getQuantityColor(inventory.quantity)}>
                    {getQuantityStatus(inventory.quantity)}
                  </Tag>
                </Space>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <Calendar size={16} />
                  Cập nhật lần cuối
                </Space>
              }
              span={2}
            >
              {dayjs(inventory.lastUpdated).format('DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24 }}>
            <h4>Thông tin chi tiết nhóm máu</h4>
            {bloodTypes.length > 0 && (
              <div style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                {(() => {
                  const bloodType = bloodTypes.find(bt => bt.id === inventory.bloodTypeId);
                  return bloodType ? (
                    <div>
                      <p><strong>Nhóm máu:</strong> {bloodType.typeName}</p>
                      <p><strong>Các thành phần có sẵn:</strong></p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {bloodType.components.map(component => (
                          <Tag
                            key={component.componentId}
                            color={component.componentId === inventory.bloodComponentId ? 'blue' : 'default'}
                          >
                            {component.componentName}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>Không tìm thấy thông tin nhóm máu</p>
                  );
                })()}
              </div>
            )}
          </div>

          {inventory.quantity <= 10 && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8 }}>
              <h4 style={{ color: '#cf1322' }}>⚠️ Cảnh báo mức tồn kho thấp</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Số lượng tồn kho hiện tại ở mức nguy hiểm. Cần bổ sung ngay để đảm bảo nhu cầu sử dụng.
              </p>
            </div>
          )}

          {inventory.quantity > 10 && inventory.quantity <= 30 && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8 }}>
              <h4 style={{ color: '#d48806' }}>⚠️ Mức tồn kho thấp</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Số lượng tồn kho đang ở mức thấp. Nên cân nhắc bổ sung để tránh thiếu hụt.
              </p>
            </div>
          )}

          {inventory.quantity > 30 && (
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8 }}>
              <h4 style={{ color: '#389e0d' }}>✅ Tồn kho ổn định</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Số lượng tồn kho hiện tại đủ để đáp ứng nhu cầu sử dụng.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          Không tìm thấy thông tin tồn kho
        </div>
      )}
    </Modal>
  );
};

export default InventoryDetailModal;