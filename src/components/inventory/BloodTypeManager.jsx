import React, { useState } from 'react';
import { Plus, Edit, Trash2, Droplets, X, AlertTriangle } from 'lucide-react';
import { createBloodType, updateBloodType, deleteBloodType } from '../../services/bloodTypeService';
import toast from 'react-hot-toast';
import HandleLoading from '../common/HandleLoading';

const BloodTypeFormModal = ({ isOpen, onClose, onSubmit, bloodType = null, loading = false }) => {
  const [formData, setFormData] = useState({
    typeName: bloodType?.typeName || ''
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        typeName: bloodType?.typeName || ''
      });
      setErrors({});
    }
  }, [bloodType, isOpen]);

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

    onSubmit({
      typeName: formData.typeName.trim(),
      componentIds: bloodType?.components?.map(c => c.componentId) || []
    });
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
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.typeName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="VD: A_POS, B_NEG, O_POS, AB_NEG"
            />
            {errors.typeName && <p className="text-sm text-red-500 mt-1">{errors.typeName}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Gợi ý format:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• A_POS, A_NEG</div>
              <div>• B_POS, B_NEG</div>
              <div>• O_POS, O_NEG</div>
              <div>• AB_POS, AB_NEG</div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : (bloodType ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message, itemName, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-3">{message}</p>
            {itemName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">
                  Tên nhóm máu: <span className="text-red-600">{itemName}</span>
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-3">
              <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BloodTypeManager = ({ bloodTypes, onAdd, onEdit, onDelete, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBloodType, setEditingBloodType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    bloodType: null
  });

  const handleAdd = async (bloodTypeData) => {
    try {
      setLoading(true);

      const newBloodTypeData = {
        bloodTypeId: Math.max(...bloodTypes.map(bt => bt.id), 0) + 1,
        typeName: bloodTypeData.typeName,
        componentIds: bloodTypeData.componentIds || []
      };

      const response = await createBloodType(newBloodTypeData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Thêm nhóm máu thành công!');
        setIsModalOpen(false);
        setEditingBloodType(null);

        if (onRefresh) {
          onRefresh();
        } else {
          onAdd(response.data.data);
        }
      } else {
        toast.error('Không thể thêm nhóm máu');
      }
    } catch (error) {
      console.error('Lỗi khi thêm nhóm máu:', error);
      toast.error('Lỗi khi thêm nhóm máu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (bloodTypeData) => {
    try {
      setLoading(true);

      const updateData = {
        bloodTypeId: editingBloodType.id,
        typeName: bloodTypeData.typeName,
        componentIds: bloodTypeData.componentIds || editingBloodType.components?.map(c => c.componentId) || []
      };

      const response = await updateBloodType(editingBloodType.id, updateData);

      if (response.status === 200) {
        toast.success('Cập nhật nhóm máu thành công!');
        setIsModalOpen(false);
        setEditingBloodType(null);

        if (onRefresh) {
          onRefresh();
        } else {
          onEdit(editingBloodType.id, updateData);
        }
      } else {
        toast.error('Không thể cập nhật nhóm máu');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật nhóm máu:', error);
      toast.error('Lỗi khi cập nhật nhóm máu');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (bloodType) => {
    setDeleteModal({
      isOpen: true,
      bloodType: bloodType
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      bloodType: null
    });
  };

  const handleConfirmDelete = async () => {
    const bloodType = deleteModal.bloodType;
    if (!bloodType) return;

    try {
      setLoading(true);

      const response = await deleteBloodType(bloodType.id);

      if (response.status === 200) {
        toast.success('Xóa nhóm máu thành công!');
        closeDeleteModal();

        if (onRefresh) {
          onRefresh();
        } else {
          onDelete(bloodType.id);
        }
      } else {
        toast.error('Không thể xóa nhóm máu');
      }
    } catch (error) {
      console.error('Lỗi khi xóa nhóm máu:', error);
      toast.error('Lỗi khi xóa nhóm máu');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (bloodType) => {
    setEditingBloodType(bloodType);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingBloodType(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!loading) {
      setIsModalOpen(false);
      setEditingBloodType(null);
    }
  };

  return (
    <>
      {loading && (
        <HandleLoading />
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Quản lý nhóm máu</h3>
            <p className="text-gray-600">Thêm, sửa, xóa các loại nhóm máu trong hệ thống</p>
          </div>
          <button
            onClick={openAddModal}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Sửa</span>
                </button>
                <button
                  onClick={() => openDeleteModal(bloodType)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm nhóm máu</span>
              </button>
            </div>
          )}
        </div>

        <BloodTypeFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingBloodType ? handleEdit : handleAdd}
          bloodType={editingBloodType}
          loading={loading}
        />

        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa nhóm máu"
          message="Bạn có chắc chắn muốn xóa nhóm máu này?"
          itemName={deleteModal.bloodType?.typeName}
          loading={loading}
        />
      </div>
    </>
  );
};

export default BloodTypeManager;