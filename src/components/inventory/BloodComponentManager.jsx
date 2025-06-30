import React, { useState } from 'react';
import { Plus, Edit, Trash2, Activity, X, AlertTriangle } from 'lucide-react';
import { createBloodComponent, updateBloodComponent, deleteBloodComponent } from '../../services/bloodComponentService';
import toast from 'react-hot-toast';
import HandleLoading from '../common/HandleLoading';

const BloodComponentFormModal = ({ isOpen, onClose, onSubmit, bloodComponent = null, loading = false }) => {
  const [formData, setFormData] = useState({
    componentName: bloodComponent?.componentName || ''
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        componentName: bloodComponent?.componentName || ''
      });
      setErrors({});
    }
  }, [bloodComponent, isOpen]);

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
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.componentName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="VD: WHOLE_BLOOD, RED_BLOOD_CELLS, PLATELETS"
            />
            {errors.componentName && <p className="text-sm text-red-500 mt-1">{errors.componentName}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Gợi ý tên thành phần:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• <strong>WHOLE_BLOOD</strong> - Máu toàn phần</div>
              <div>• <strong>RED_BLOOD_CELLS</strong> - Hồng cầu</div>
              <div>• <strong>PLATELETS</strong> - Tiểu cầu</div>
              <div>• <strong>PLASMA</strong> - Huyết tương</div>
              <div>• <strong>WHITE_BLOOD_CELLS</strong> - Bạch cầu</div>
              <div>• <strong>CRYOPRECIPITATE</strong> - Cryoprecipitate</div>
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
              {loading ? 'Đang xử lý...' : (bloodComponent ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message, itemName, warning, loading = false }) => {
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
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium text-gray-900">
                  Tên thành phần: <span className="text-red-600">{itemName}</span>
                </p>
              </div>
            )}
            {warning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">{warning}</p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500">
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

const BloodComponentManager = ({ bloodComponents, onAdd, onEdit, onDelete, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    component: null
  });

  const handleAdd = async (componentData) => {
    try {
      setLoading(true);

      const newComponentData = {
        componentId: Math.max(...bloodComponents.map(bc => bc.id), 0) + 1,
        componentName: componentData.componentName
      };

      const response = await createBloodComponent(newComponentData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Thêm thành phần máu thành công!');
        setIsModalOpen(false);
        setEditingComponent(null);

        if (onRefresh) {
          onRefresh();
        } else {
          onAdd(response.data.data);
        }
      } else {
        toast.error('Không thể thêm thành phần máu');
      }
    } catch (error) {
      console.error('Lỗi khi thêm thành phần máu:', error);
      toast.error('Lỗi khi thêm thành phần máu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (componentData) => {
    try {
      setLoading(true);

      const updateData = {
        componentId: editingComponent.id,
        componentName: componentData.componentName
      };

      const response = await updateBloodComponent(editingComponent.id, updateData);

      if (response.status === 200) {
        toast.success('Cập nhật thành phần máu thành công!');
        setIsModalOpen(false);
        setEditingComponent(null);

        if (onRefresh) {
          onRefresh();
        } else {
          onEdit(editingComponent.id, updateData);
        }
      } else {
        toast.error('Không thể cập nhật thành phần máu');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thành phần máu:', error);
      toast.error('Lỗi khi cập nhật thành phần máu');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (component) => {
    setDeleteModal({
      isOpen: true,
      component: component
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      component: null
    });
  };

  const handleConfirmDelete = async () => {
    const component = deleteModal.component;
    if (!component) return;

    try {
      setLoading(true);

      const response = await deleteBloodComponent(component.componentId);

      if (response.status === 200) {
        toast.success('Xóa thành phần máu thành công!');
        closeDeleteModal();

        if (onRefresh) {
          onRefresh();
        } else {
          onDelete(component.id);
        }
      } else {
        toast.error('Không thể xóa thành phần máu');
      }
    } catch (error) {
      console.error('Lỗi khi xóa thành phần máu:', error);
      toast.error('Lỗi khi xóa thành phần máu');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (component) => {
    setEditingComponent(component);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingComponent(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!loading) {
      setIsModalOpen(false);
      setEditingComponent(null);
    }
  };

  const getComponentIcon = (componentName) => {
    const name = componentName.toLowerCase();
    if (name.includes('whole') || name.includes('toàn phần')) {
      return '🩸';
    } else if (name.includes('red') || name.includes('hồng cầu')) {
      return '🔴';
    } else if (name.includes('platelet') || name.includes('tiểu cầu')) {
      return '🟡';
    } else if (name.includes('plasma') || name.includes('huyết tương')) {
      return '🟨';
    } else if (name.includes('white') || name.includes('bạch cầu')) {
      return '⚪';
    } else if (name.includes('cryoprecipitate')) {
      return '❄️';
    }
    return '🩸';
  };

  const getComponentDisplayName = (componentName) => {
    const displayNames = {
      'WHOLE_BLOOD': 'Máu toàn phần',
      'RED_BLOOD_CELLS': 'Hồng cầu',
      'PLATELETS': 'Tiểu cầu',
      'PLASMA': 'Huyết tương',
      'WHITE_BLOOD_CELLS': 'Bạch cầu',
      'CRYOPRECIPITATE': 'Cryoprecipitate'
    };

    return displayNames[componentName] || componentName;
  };

  return (
    <>
      {loading && (
        <HandleLoading />
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Quản lý thành phần máu</h3>
            <p className="text-gray-600">Thêm, sửa, xóa các loại thành phần máu trong hệ thống</p>
          </div>
          <button
            onClick={openAddModal}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm thành phần</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bloodComponents.map((component) => (
            <div
              key={component.id}
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
                    <p className="text-xs text-blue-600 mt-1">
                      {getComponentDisplayName(component.componentName)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(component)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Sửa</span>
                </button>
                <button
                  onClick={() => openDeleteModal(component)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm thành phần</span>
              </button>
            </div>
          )}
        </div>

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

        <BloodComponentFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingComponent ? handleEdit : handleAdd}
          bloodComponent={editingComponent}
          loading={loading}
        />

        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa thành phần máu"
          message="Bạn có chắc chắn muốn xóa thành phần máu này?"
          itemName={deleteModal.component?.componentName}
          warning="Việc xóa thành phần này có thể ảnh hưởng đến các cấu hình tương thích hiện có."
          loading={loading}
        />
      </div>
    </>
  );
};

export default BloodComponentManager;