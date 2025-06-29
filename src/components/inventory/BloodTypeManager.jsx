import React, { useState } from 'react';
import { Plus, Edit, Trash2, Droplets, X } from 'lucide-react';

const BloodTypeFormModal = ({ isOpen, onClose, onSubmit, bloodType = null }) => {
  const [formData, setFormData] = useState({
    typeName: bloodType?.typeName || ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.typeName.trim()) {
      newErrors.typeName = 'Tên nhóm máu là bắt buộc';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ typeName: formData.typeName.trim() });
    setFormData({ typeName: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {bloodType ? 'Chỉnh sửa nhóm máu' : 'Thêm nhóm máu mới'}
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
              Tên nhóm máu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.typeName}
              onChange={(e) => setFormData({ typeName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                errors.typeName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: A+, B-, O+, AB-"
            />
            {errors.typeName && <p className="text-sm text-red-500 mt-1">{errors.typeName}</p>}
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
              {bloodType ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BloodTypeManager = ({ bloodTypes, onAdd, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBloodType, setEditingBloodType] = useState(null);

  const handleAdd = (bloodTypeData) => {
    onAdd(bloodTypeData);
    setIsModalOpen(false);
  };

  const handleEdit = (bloodTypeData) => {
    onEdit(editingBloodType.bloodTypeId, bloodTypeData);
    setEditingBloodType(null);
    setIsModalOpen(false);
  };

  const openEditModal = (bloodType) => {
    setEditingBloodType(bloodType);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingBloodType(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Quản lý nhóm máu</h3>
          <p className="text-gray-600">Thêm, sửa, xóa các loại nhóm máu trong hệ thống</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm nhóm máu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bloodTypes.map((bloodType) => (
          <div
            key={bloodType.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Droplets className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{bloodType.typeName}</h4>
                  <p className="text-sm text-gray-500">ID: {bloodType.id}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => openEditModal(bloodType)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Sửa</span>
              </button>
              <button
                onClick={() => onDelete(bloodType.id)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Xóa</span>
              </button>
            </div>
          </div>
        ))}

        {bloodTypes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Droplets className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có nhóm máu nào</h3>
            <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm nhóm máu đầu tiên</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nhóm máu</span>
            </button>
          </div>
        )}
      </div>

      <BloodTypeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBloodType(null);
        }}
        onSubmit={editingBloodType ? handleEdit : handleAdd}
        bloodType={editingBloodType}
      />
    </div>
  );
};

export default BloodTypeManager;