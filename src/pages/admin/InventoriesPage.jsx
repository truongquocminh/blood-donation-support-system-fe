import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Tag, Space, Input } from 'antd';
import { Search, Eye, Package, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { getInventories } from '../../services/inventoryService'
import { getBloodTypes } from '../../services/bloodTypeService'
import { getBloodComponents } from '../../services/bloodComponentService'
import InventoryDetailModal from '../../components/admin-details/InventoryDetailModal';

const { Title } = Typography;

const InventoriesPage = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

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

  const fetchBloodComponents = async () => {
    try {
      const response = await getBloodComponents();
      if (response.status === 200) {
        setBloodComponents(response.data.data.content);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách thành phần máu');
    }
  };

  const fetchInventories = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await getInventories(page, size);
      if (response.status === 200) {
        setInventories(response.data.data.content);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.page.totalElements
        }));
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tồn kho');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchInventories(pagination.current - 1, pagination.pageSize);
      toast.success('Đã cập nhật danh sách tồn kho');
    } catch (error) {
      toast.error('Lỗi khi làm mới danh sách');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBloodTypes();
    fetchBloodComponents();
    fetchInventories();
  }, []);

  const handleTableChange = (paginationInfo) => {
    setPagination(paginationInfo);
    fetchInventories(paginationInfo.current - 1, paginationInfo.pageSize);
  };

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

  const filteredInventories = inventories.filter(inventory => {
    const bloodType = getBloodTypeName(inventory.bloodTypeId);
    const bloodComponent = getBloodComponentName(inventory.bloodComponentId);
    const searchLower = searchText.toLowerCase();

    return bloodType.toLowerCase().includes(searchLower) ||
      bloodComponent.toLowerCase().includes(searchLower) ||
      inventory.quantity.toString().includes(searchLower);
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodTypeId',
      key: 'bloodTypeId',
      render: (bloodTypeId) => (
        <Tag color="blue">{getBloodTypeName(bloodTypeId)}</Tag>
      )
    },
    {
      title: 'Thành phần máu',
      dataIndex: 'bloodComponentId',
      key: 'bloodComponentId',
      render: (bloodComponentId) => getBloodComponentName(bloodComponentId)
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Tag color={getQuantityColor(quantity)}>
          {quantity} đơn vị
        </Tag>
      ),
      sorter: (a, b) => a.quantity - b.quantity
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (lastUpdated) => dayjs(lastUpdated).format('DD/MM/YYYY HH:mm')
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

  const handleViewDetail = (inventoryId) => {
    const inventory = inventories.find(inv => inv.id === inventoryId);
    setSelectedInventory(inventory);
    setInventoryModalVisible(true);
  };

  const handleCloseInventoryModal = () => {
    setInventoryModalVisible(false);
    setSelectedInventory(null);
  };

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý tồn kho
        </Title>
        <Space>
          <Button
            icon={<RefreshCw size={16} />}
            onClick={handleRefresh}
            loading={refreshing}
          >
            Làm mới
          </Button>

        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo nhóm máu, thành phần máu hoặc số lượng..."
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 400 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredInventories}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: 800 }}
      />

      <InventoryDetailModal
        visible={inventoryModalVisible}
        onCancel={handleCloseInventoryModal}
        inventory={selectedInventory}
      />
    </Card>
  );
};

export default InventoriesPage;