import React, { useState } from 'react';
import { Plus, Edit, Trash2, Activity, X } from 'lucide-react';

const BloodComponentFormModal = ({ isOpen, onClose, onSubmit, bloodComponent = null }) => {
  const [formData, setFormData] = useState({
    componentName: bloodComponent?.componentName || ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.componentName.trim()) {
      newErrors.componentName = 'Tên thành phần máu là bắt buộc';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ componentName: formData.componentName.trim() });
    setFormData({ componentName: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {bloodComponent ? 'Chỉnh sửa thành phần máu' : 'Thêm thành phần máu mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên thành phần máu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.componentName}
              onChange={(e) => setFormData({ componentName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                errors.componentName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: Máu toàn phần, Hồng cầu, Tiểu cầu"
            />
            {errors.componentName && <p className="text-sm text-red-500 mt-1">{errors.componentName}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Gợi ý tên thành phần:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• Máu toàn phần (Whole Blood)</div>
              <div>• Hồng cầu (Red Blood Cells)</div>
              <div>• Tiểu cầu (Platelets)</div>
              <div>• Huyết tương (Plasma)</div>
              <div>• Bạch cầu (White Blood Cells)</div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {bloodComponent ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BloodComponentManager = ({ bloodComponents, onAdd, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);

  const handleAdd = (componentData) => {
    onAdd(componentData);
    setIsModalOpen(false);
  };

  const handleEdit = (componentData) => {
    onEdit(editingComponent.componentId, componentData);
    setEditingComponent(null);
    setIsModalOpen(false);
  };

  const openEditModal = (component) => {
    setEditingComponent(component);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingComponent(null);
    setIsModalOpen(true);
  };

  const getComponentIcon = (componentName) => {
    const name = componentName.toLowerCase();
    if (name.includes('toàn phần') || name.includes('whole')) {
      return '🩸';
    } else if (name.includes('hồng cầu') || name.includes('red')) {
      return '🔴';
    } else if (name.includes('tiểu cầu') || name.includes('platelet')) {
      return '🟡';
    } else if (name.includes('huyết tương') || name.includes('plasma')) {
      return '🟨';
    } else if (name.includes('bạch cầu') || name.includes('white')) {
      return '⚪';
    }
    return '🩸';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Quản lý thành phần máu</h3>
          <p className="text-gray-600">Thêm, sửa, xóa các loại thành phần máu trong hệ thống</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thành phần</span>
        </button>
      </div>

      {/* Blood Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bloodComponents.map((component) => (
          <div
            key={component.componentId}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getComponentIcon(component.componentName)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 leading-tight">
                    {component.componentName}
                  </h4>
                  <p className="text-sm text-gray-500">ID: {component.componentId}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => openEditModal(component)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Sửa</span>
              </button>
              <button
                onClick={() => onDelete(component.componentId)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Xóa</span>
              </button>
            </div>
          </div>
        ))}

        {bloodComponents.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thành phần máu nào</h3>
            <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm thành phần máu đầu tiên</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm thành phần</span>
            </button>
          </div>
        )}
      </div>

      {/* Usage Info */}
      {bloodComponents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Thông tin về tương thích:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>• <strong>Máu toàn phần:</strong> Chỉ tương thích với cùng nhóm máu</div>
            <div>• <strong>Hồng cầu:</strong> Tuân theo quy tắc tương thích cơ bản (O- là donor toàn cầu)</div>
            <div>• <strong>Huyết tương:</strong> Ngược với hồng cầu (AB+ là donor toàn cầu)</div>
            <div>• <strong>Tiểu cầu & Bạch cầu:</strong> Tương thích theo quy tắc đơn giản (âm/dương)</div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <BloodComponentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingComponent(null);
        }}
        onSubmit={editingComponent ? handleEdit : handleAdd}
        bloodComponent={editingComponent}
      />
    </div>
  );
};

export default BloodComponentManager;