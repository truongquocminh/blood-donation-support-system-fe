import React from 'react';
import { Edit, Trash2, Droplets, AlertTriangle, CheckCircle, Package } from 'lucide-react';

const InventoryTable = ({ 
  inventories, 
  bloodTypes, 
  bloodComponents, 
  onEdit, 
  onDelete,
  searchTerm,
  filterType,
  filterComponent 
}) => {
  const getBloodTypeName = (typeId) => {
    const type = bloodTypes.find(t => t.bloodTypeId === typeId);
    return type ? type.typeName : 'N/A';
  };

  const getComponentName = (componentId) => {
    const component = bloodComponents.find(c => c.componentId === componentId);
    return component ? component.componentName : 'N/A';
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isLowStock = (quantity) => {
    return quantity <= 5;
  };

  const filteredInventories = inventories.filter(inventory => {
    const matchesSearch = searchTerm === '' || 
      getBloodTypeName(inventory.bloodType).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getComponentName(inventory.bloodComponent).toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.donorId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || inventory.bloodType.toString() === filterType;
    const matchesComponent = filterComponent === '' || inventory.bloodComponent.toString() === filterComponent;
    
    return matchesSearch && matchesType && matchesComponent;
  });

  const getStatusBadge = (inventory) => {
    if (isExpiringSoon(inventory.expiryDate)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Sắp hết hạn
        </span>
      );
    }
    
    if (isLowStock(inventory.quantity)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Tồn kho thấp
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Bình thường
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Danh sách kho máu ({filteredInventories.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhóm máu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thành phần
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạn sử dụng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã người hiến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventories.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Không tìm thấy kho máu</p>
                  <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </td>
              </tr>
            ) : (
              filteredInventories.map((inventory) => (
                <tr key={inventory.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{inventory.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Droplets className="w-3 h-3 mr-1" />
                      {getBloodTypeName(inventory.bloodType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getComponentName(inventory.bloodComponent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-medium ${isLowStock(inventory.quantity) ? 'text-red-600' : ''}`}>
                      {inventory.quantity}
                    </span> đơn vị
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className={`${isExpiringSoon(inventory.expiryDate) ? 'text-yellow-600 font-medium' : ''}`}>
                      {new Date(inventory.expiryDate).toLocaleDateString('vi-VN')}
                      {isExpiringSoon(inventory.expiryDate) && (
                        <div className="text-xs text-yellow-500">Sắp hết hạn</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {inventory.donorId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(inventory)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(inventory)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(inventory.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;