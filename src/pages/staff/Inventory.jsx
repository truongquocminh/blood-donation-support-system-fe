import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import InventoryStats from '../../components/inventory/InventoryStats';
import InventoryTable from '../../components/inventory/InventoryTable';
import InventoryFormModal from '../../components/inventory/InventoryFormModal';
import BloodTypeManager from '../../components/inventory/BloodTypeManager';
import BloodComponentManager from '../../components/inventory/BloodComponentManager';
import BloodCompatibilityManager from '../../components/inventory/BloodCompatibilityManager';
import { getInventories } from '../../services/inventoryService';
import toast from 'react-hot-toast';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getBloodComponents } from '../../services/bloodComponentService';

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterComponent, setFilterComponent] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleAddInventory = (inventoryData) => {
    const newInventory = {
      id: Math.max(...inventories.map(i => i.id), 0) + 1,
      bloodType: inventoryData.bloodType,
      bloodComponent: inventoryData.bloodComponent,
      quantity: inventoryData.quantity,
      lastUpdated: new Date().toISOString()
    };
    setInventories(prev => [...prev, newInventory]);
    setIsModalOpen(false);
  };

  const handleEditInventory = (inventoryData) => {
    setInventories(prev =>
      prev.map(inv =>
        inv.id === editingInventory.id
          ? { 
              ...inv, 
              bloodType: inventoryData.bloodType,
              bloodComponent: inventoryData.bloodComponent,
              quantity: inventoryData.quantity,
              lastUpdated: new Date().toISOString() 
            }
          : inv
      )
    );
    setEditingInventory(null);
    setIsModalOpen(false);
  };

  const handleDeleteInventory = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kho máu này?')) {
      setInventories(prev => prev.filter(inv => inv.id !== id));
    }
  };

  const openEditModal = (inventory) => {
    setEditingInventory(inventory);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingInventory(null);
    setIsModalOpen(true);
  };

  const handleAddBloodType = async (bloodTypeData) => {
    await fetchBloodData();
  };

  const handleEditBloodType = async (id, bloodTypeData) => {
    await fetchBloodData();
  };

  const handleDeleteBloodType = async (id) => {
    await fetchBloodData();
  };

  const handleAddBloodComponent = async (componentData) => {
    await fetchBloodData();
  };

  const handleEditBloodComponent = async (id, componentData) => {
    await fetchBloodData();
  };

  const handleDeleteBloodComponent = async (id) => {
    await fetchBloodData();
  };

  useEffect(() => {
    fetchInventories();
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchBloodData();
  }, []);

  const fetchBloodData = async () => {
    try {
      const [typesRes, componentsRes] = await Promise.all([
        getBloodTypes(),
        getBloodComponents()
      ]);

      if (typesRes.status === 200 && typesRes.data.data?.content) {
        setBloodTypes(typesRes.data.data.content);
      } else {
        toast.error('Không thể tải danh sách nhóm máu');
      }

      if (componentsRes.status === 200 && componentsRes.data.data?.content) {
        setBloodComponents(componentsRes.data.data.content);
      } else {
        toast.error('Không thể tải danh sách thành phần máu');
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu máu:', error);
      toast.error('Lỗi khi gọi API nhóm máu hoặc thành phần máu');
    }
  };

  const fetchInventories = async () => {
    try {
      setLoading(true);
      const res = await getInventories(currentPage, pageSize);
      
      if (res.status === 200 && res.data.data) {
        const { content, page } = res.data.data;
        setInventories(content);
        setTotalPages(page.totalPages);
        setTotalElements(page.totalElements);
      } else {
        setInventories([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Lỗi khi tải kho máu:", error);
      toast.error("Không thể tải kho máu");
      setInventories([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kho máu</h1>
          <p className="text-gray-600">Theo dõi và quản lý tồn kho máu</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>

          {activeTab === 'inventory' && (
            <button
              onClick={openAddModal}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm kho máu</span>
            </button>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'inventory', label: 'Kho máu' },
            { id: 'blood-types', label: 'Nhóm máu' },
            { id: 'blood-components', label: 'Thành phần máu' },
            { id: 'compatibility', label: 'Bảng tương thích truyền máu' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo nhóm máu, thành phần..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo nhóm máu
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Tất cả nhóm máu</option>
                    {bloodTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.typeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo thành phần
                  </label>
                  <select
                    value={filterComponent}
                    onChange={(e) => setFilterComponent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Tất cả thành phần</option>
                    {bloodComponents.map(component => (
                      <option key={component.id} value={component.id}>
                        {component.componentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <>
          <InventoryStats inventories={inventories} />
          <InventoryTable
            inventories={inventories}
            bloodTypes={bloodTypes}
            bloodComponents={bloodComponents}
            onEdit={openEditModal}
            onDelete={handleDeleteInventory}
            searchTerm={searchTerm}
            filterType={filterType}
            filterComponent={filterComponent}
            loading={loading}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Hiển thị {currentPage * pageSize + 1} – {Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số {totalElements} bản ghi
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 border rounded ${i === currentPage ? 'bg-red-500 text-white' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(0);
                }}
                className="ml-4 border px-2 py-1 rounded"
              >
                <option value={5}>5/trang</option>
                <option value={10}>10/trang</option>
                <option value={20}>20/trang</option>
              </select>
            </div>
          )}
        </>
      )}

      {activeTab === 'blood-types' && (
        <BloodTypeManager
          bloodTypes={bloodTypes}
          onAdd={handleAddBloodType}
          onEdit={handleEditBloodType}
          onDelete={handleDeleteBloodType}
          onRefresh={fetchBloodData}
        />
      )}

      {activeTab === 'blood-components' && (
        <BloodComponentManager
          bloodComponents={bloodComponents}
          onAdd={handleAddBloodComponent}
          onEdit={handleEditBloodComponent}
          onDelete={handleDeleteBloodComponent}
          onRefresh={fetchBloodData}
        />
      )}

      {activeTab === 'compatibility' && (
        <BloodCompatibilityManager
          bloodTypes={bloodTypes}
          bloodComponents={bloodComponents}
          onUpdate={fetchBloodData}
        />
      )}

      <InventoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInventory(null);
        }}
        onSubmit={editingInventory ? handleEditInventory : handleAddInventory}
        inventory={editingInventory}
        bloodTypes={bloodTypes}
        bloodComponents={bloodComponents}
      />
    </div>
  );
};

export default Inventory;