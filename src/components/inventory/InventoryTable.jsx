import React from "react";
import {
  Edit,
  Trash2,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Package,
  Loader2,
  Calendar,
  Hash
} from "lucide-react";
import { formatVietnamTime } from "../../utils/formatters"; 

const InventoryTable = ({
  inventories,
  bloodTypes,
  bloodComponents,
  onEdit,
  onDelete,
  searchTerm,
  filterType,
  filterComponent,
  loading = false,
  actionLoading = false,
}) => {
  const getBloodTypeName = (typeId) => {
    if (!typeId || !bloodTypes || bloodTypes.length === 0) return "N/A";
    const type = bloodTypes.find((t) => t.id === typeId);
    return type ? type.typeName : `ID: ${typeId}`;
  };

  const getComponentName = (componentId) => {
    if (!componentId || !bloodComponents || bloodComponents.length === 0)
      return "N/A";
    const component = bloodComponents.find(
      (c) => c.componentId === componentId
    );
    return component ? component.componentName : `ID: ${componentId}`;
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const isLowStock = (quantity) => {
    return quantity <= 5;
  };

  const filteredInventories = inventories.filter((inventory) => {
    const bloodTypeName = getBloodTypeName(inventory.bloodTypeId);
    const componentName = getComponentName(inventory.componentId);

    const matchesSearch =
      searchTerm === "" ||
      bloodTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inventory.batchNumber && inventory.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === "" || inventory.bloodTypeId?.toString() === filterType;
    const matchesComponent =
      filterComponent === "" ||
      inventory.componentId?.toString() === filterComponent;

    return matchesSearch && matchesType && matchesComponent;
  });

  const getStatusBadge = (inventory) => {
    if (isExpired(inventory.expiryDate)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Đã hết hạn
        </span>
      );
    }

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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
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

  const LoadingSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Danh sách kho máu {!loading && `(${filteredInventories.length})`}
        </h3>
        {loading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        )}
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
                Số lô
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày nhập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạn sử dụng
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
            {loading ? (
              Array.from({ length: 5 }, (_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : filteredInventories.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    Không tìm thấy kho máu
                  </p>
                  <p className="text-sm">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
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
                      {getBloodTypeName(inventory.bloodTypeId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getComponentName(inventory.componentId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`font-medium ${
                        isLowStock(inventory.quantity) ? "text-red-600" : ""
                      }`}
                    >
                      {inventory.quantity}
                    </span>{" "}
                    ml
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {inventory.batchNumber || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>
                        {inventory.addedDate ? formatVietnamTime(inventory.addedDate, 'DD/MM/YYYY') : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div
                      className={`flex items-center space-x-1 ${
                        isExpired(inventory.expiryDate)
                          ? "text-red-600 font-medium"
                          : isExpiringSoon(inventory.expiryDate)
                          ? "text-yellow-600 font-medium"
                          : ""
                      }`}
                    >
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <div>
                        <span>
                          {inventory.expiryDate ? formatVietnamTime(inventory.expiryDate, 'DD/MM/YYYY') : 'N/A'}
                        </span>
                        {isExpired(inventory.expiryDate) && (
                          <div className="text-xs text-red-500">
                            Đã hết hạn
                          </div>
                        )}
                        {isExpiringSoon(inventory.expiryDate) && !isExpired(inventory.expiryDate) && (
                          <div className="text-xs text-yellow-500">
                            Sắp hết hạn
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(inventory)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(inventory)}
                        disabled={actionLoading}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(inventory.id)}
                          disabled={actionLoading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa"
                        >
                          {actionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
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