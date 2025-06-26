import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import InventoryStats from '../../components/inventory/InventoryStats';
import InventoryTable from '../../components/inventory/InventoryTable';
import InventoryFormModal from '../../components/inventory/InventoryFormModal';
import BloodTypeManager from '../../components/inventory/BloodTypeManager';
import BloodComponentManager from '../../components/inventory/BloodComponentManager';
import { BLOOD_TYPES, BLOOD_COMPONENTS } from '../../utils/constants';

const MOCK_INVENTORIES = [
  { id: 1, bloodType: BLOOD_TYPES.O_NEGATIVE, bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD, quantity: 15, expiryDate: '2025-07-15', donorId: 'D001' },
  { id: 2, bloodType: BLOOD_TYPES.A_POSITIVE, bloodComponent: BLOOD_COMPONENTS.RED_BLOOD_CELLS, quantity: 8, expiryDate: '2025-07-20', donorId: 'D002' },
  { id: 3, bloodType: BLOOD_TYPES.B_NEGATIVE, bloodComponent: BLOOD_COMPONENTS.PLASMA, quantity: 12, expiryDate: '2025-08-01', donorId: 'D003' },
  { id: 4, bloodType: BLOOD_TYPES.AB_POSITIVE, bloodComponent: BLOOD_COMPONENTS.PLATELETS, quantity: 5, expiryDate: '2025-07-10', donorId: 'D004' },
  { id: 5, bloodType: BLOOD_TYPES.O_POSITIVE, bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD, quantity: 20, expiryDate: '2025-07-25', donorId: 'D005' },
];

const MOCK_BLOOD_TYPES = [
  { bloodTypeId: BLOOD_TYPES.O_NEGATIVE, typeName: 'O-' },
  { bloodTypeId: BLOOD_TYPES.O_POSITIVE, typeName: 'O+' },
  { bloodTypeId: BLOOD_TYPES.A_NEGATIVE, typeName: 'A-' },
  { bloodTypeId: BLOOD_TYPES.A_POSITIVE, typeName: 'A+' },
  { bloodTypeId: BLOOD_TYPES.B_NEGATIVE, typeName: 'B-' },
  { bloodTypeId: BLOOD_TYPES.B_POSITIVE, typeName: 'B+' },
  { bloodTypeId: BLOOD_TYPES.AB_NEGATIVE, typeName: 'AB-' },
  { bloodTypeId: BLOOD_TYPES.AB_POSITIVE, typeName: 'AB+' },
];

const MOCK_BLOOD_COMPONENTS = [
  { componentId: BLOOD_COMPONENTS.WHOLE_BLOOD, componentName: 'Máu toàn phần' },
  { componentId: BLOOD_COMPONENTS.RED_BLOOD_CELLS, componentName: 'Hồng cầu' },
  { componentId: BLOOD_COMPONENTS.PLATELETS, componentName: 'Tiểu cầu' },
  { componentId: BLOOD_COMPONENTS.PLASMA, componentName: 'Huyết tương' },
  { componentId: BLOOD_COMPONENTS.WHITE_BLOOD_CELLS, componentName: 'Bạch cầu' },
];

const Inventory = () => {
  const [inventories, setInventories] = useState(MOCK_INVENTORIES);
  const [bloodTypes, setBloodTypes] = useState(MOCK_BLOOD_TYPES);
  const [bloodComponents, setBloodComponents] = useState(MOCK_BLOOD_COMPONENTS);
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterComponent, setFilterComponent] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleAddInventory = (inventoryData) => {
    const newInventory = {
      id: Math.max(...inventories.map(i => i.id)) + 1,
      ...inventoryData
    };
    setInventories(prev => [...prev, newInventory]);
    setIsModalOpen(false);
  };

  const handleEditInventory = (inventoryData) => {
    setInventories(prev => 
      prev.map(inv => 
        inv.id === editingInventory.id 
          ? { ...inv, ...inventoryData }
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

  const handleAddBloodType = (bloodTypeData) => {
    const newBloodType = {
      bloodTypeId: Math.max(...bloodTypes.map(bt => bt.bloodTypeId)) + 1,
      ...bloodTypeData
    };
    setBloodTypes(prev => [...prev, newBloodType]);
  };

  const handleEditBloodType = (id, bloodTypeData) => {
    setBloodTypes(prev => 
      prev.map(bt => 
        bt.bloodTypeId === id 
          ? { ...bt, ...bloodTypeData }
          : bt
      )
    );
  };

  const handleDeleteBloodType = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhóm máu này?')) {
      setBloodTypes(prev => prev.filter(bt => bt.bloodTypeId !== id));
    }
  };

  const handleAddBloodComponent = (componentData) => {
    const newComponent = {
      componentId: Math.max(...bloodComponents.map(bc => bc.componentId)) + 1,
      ...componentData
    };
    setBloodComponents(prev => [...prev, newComponent]);
  };

  const handleEditBloodComponent = (id, componentData) => {
    setBloodComponents(prev => 
      prev.map(bc => 
        bc.componentId === id 
          ? { ...bc, ...componentData }
          : bc
      )
    );
  };

  const handleDeleteBloodComponent = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành phần máu này?')) {
      setBloodComponents(prev => prev.filter(bc => bc.componentId !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'inventory', label: 'Kho máu' },
            { id: 'blood-types', label: 'Nhóm máu' },
            { id: 'blood-components', label: 'Thành phần máu' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo nhóm máu, thành phần hoặc mã người hiến..."
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
                      <option key={type.bloodTypeId} value={type.bloodTypeId}>
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
                      <option key={component.componentId} value={component.componentId}>
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

      {/* Tab Content */}
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
          />
        </>
      )}

      {activeTab === 'blood-types' && (
        <BloodTypeManager
          bloodTypes={bloodTypes}
          onAdd={handleAddBloodType}
          onEdit={handleEditBloodType}
          onDelete={handleDeleteBloodType}
        />
      )}

      {activeTab === 'blood-components' && (
        <BloodComponentManager
          bloodComponents={bloodComponents}
          onAdd={handleAddBloodComponent}
          onEdit={handleEditBloodComponent}
          onDelete={handleDeleteBloodComponent}
        />
      )}

      {/* Inventory Form Modal */}
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