import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Loader2, Calendar, Hash, Droplets } from 'lucide-react';
import { createInventory, updateInventory } from '../../services/inventoryService';
import toast from 'react-hot-toast';
import HandleLoading from '../common/HandleLoading';

const InventoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  inventory = null,
  bloodTypes,
  bloodComponents,
  onRefresh
}) => {
  const [availableComponents, setAvailableComponents] = useState([]);
  const [formData, setFormData] = useState({
    bloodType: '',
    componentId: '',
    quantity: '',
    batchNumber: '',
    addedDate: '',
    expiryDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inventory) {
      setFormData({
        bloodType: inventory.bloodTypeId ? inventory.bloodTypeId.toString() : '',
        componentId: inventory.componentId ? inventory.componentId.toString() : '',
        quantity: inventory.quantity ? inventory.quantity.toString() : '',
        batchNumber: inventory.batchNumber || '',
        addedDate: inventory.addedDate ? inventory.addedDate.split('T')[0] : '',
        expiryDate: inventory.expiryDate ? inventory.expiryDate.split('T')[0] : ''
      });
    } else {
      const today = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(today.getDate() + 35);

      setFormData({
        bloodType: '',
        componentId: '',
        quantity: '',
        batchNumber: '',
        addedDate: today.toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [inventory, isOpen]);

  useEffect(() => {
    const selectedType = bloodTypes.find(type => type.id.toString() === formData.bloodType);
    if (selectedType && selectedType.components) {
      setAvailableComponents(selectedType.components);
    } else {
      setAvailableComponents(bloodComponents || []);
    }
  }, [formData.bloodType, bloodTypes, bloodComponents]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'addedDate' && value) {
      const addedDate = new Date(value);
      const expiryDate = new Date(addedDate);
      expiryDate.setDate(addedDate.getDate() + 35);

      setFormData(prev => ({
        ...prev,
        [field]: value,
        expiryDate: expiryDate.toISOString().split('T')[0]
      }));
    }
  };

  const generateBatchNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    const batchNumber = `BLD${year}${month}${day}${random}`;
    setFormData(prev => ({ ...prev, batchNumber }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bloodType) {
      newErrors.bloodType = 'Vui lòng chọn nhóm máu';
    }

    if (!formData.componentId) {
      newErrors.componentId = 'Vui lòng chọn thành phần máu';
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }

    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Vui lòng nhập số lô';
    }

    if (!formData.addedDate) {
      newErrors.addedDate = 'Vui lòng chọn ngày nhập';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Vui lòng chọn hạn sử dụng';
    }

    if (formData.addedDate && formData.expiryDate) {
      const addedDate = new Date(formData.addedDate);
      const expiryDate = new Date(formData.expiryDate);

      if (expiryDate <= addedDate) {
        newErrors.expiryDate = 'Hạn sử dụng phải sau ngày nhập';
      }

      const todayVietnam = new Date();
      todayVietnam.setHours(todayVietnam.getHours() + 7); 
      todayVietnam.setHours(0, 0, 0, 0); 

      const addedDateAtMidnight = new Date(addedDate);
      addedDateAtMidnight.setHours(0, 0, 0, 0);

      if (addedDateAtMidnight > todayVietnam) {
        newErrors.addedDate = 'Ngày nhập không thể trong tương lai';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const inventoryData = {
        bloodTypeId: parseInt(formData.bloodType),
        componentId: parseInt(formData.componentId),
        quantity: parseInt(formData.quantity),
        batchNumber: formData.batchNumber.trim(),
        addedDate: formData.addedDate,
        expiryDate: formData.expiryDate
      };

      let response;
      if (inventory) {
        response = await updateInventory(inventory.id, inventoryData);
        if (response.status === 200) {
          toast.success('Cập nhật kho máu thành công!');
        }
      } else {
        response = await createInventory(inventoryData);

        console.log('Create Inventory Response:', response);
        if (response.status === 200 || response.status === 201) {
          toast.success('Thêm kho máu thành công!');
        }
      }

      onClose();
      if (onRefresh) {
        onRefresh();
      } else {
        onSubmit(inventoryData);
      }

    } catch (error) {
      console.error('Lỗi khi xử lý kho máu:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Dữ liệu không hợp lệ');
      } else if (error.response?.status === 409) {
        toast.error('Số lô này đã tồn tại');
      } else {
        toast.error(inventory ? 'Lỗi khi cập nhật kho máu' : 'Lỗi khi thêm kho máu');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (!loading) {
      onClose();
    }
  };

  const getDaysUntilExpiry = () => {
    if (!formData.expiryDate) return null;
    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = () => {
    const days = getDaysUntilExpiry();
    if (days === null) return null;

    if (days <= 0) return { type: 'expired', color: 'red', message: 'Đã hết hạn' };
    if (days <= 7) return { type: 'expiring', color: 'yellow', message: `Sắp hết hạn (${days} ngày)` };
    return { type: 'valid', color: 'green', message: 'Thời hạn hợp lệ' };
  };

  const expiryStatus = getExpiryStatus();

  if (!isOpen) return null;

  return (
    <>
      {loading && <HandleLoading />}

      <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Droplets className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {inventory ? 'Chỉnh sửa kho máu' : 'Thêm kho máu mới'}
                </h3>
                <p className="text-sm text-gray-600">
                  {inventory ? `ID: #${inventory.id}` : 'Nhập thông tin kho máu mới'}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">Lưu ý quan trọng:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Số lô phải là duy nhất trong hệ thống</li>
                    <li>• Hạn sử dụng sẽ được tự động tính khi chọn ngày nhập (35 ngày)</li>
                    <li>• Kiểm tra kỹ thông tin trước khi lưu</li>
                    <li>• Máu có hạn sử dụng giới hạn, cần quản lý cẩn thận</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhóm máu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.bloodType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Chọn nhóm máu</option>
                  {bloodTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
                {errors.bloodType && <p className="text-sm text-red-500 mt-1">{errors.bloodType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phần máu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.componentId}
                  onChange={(e) => handleInputChange('componentId', e.target.value)}
                  disabled={loading || !formData.bloodType}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.componentId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Chọn thành phần máu</option>
                  {availableComponents.map(component => (
                    <option key={component.componentId} value={component.componentId}>
                      {component.componentName}
                    </option>
                  ))}
                </select>
                {errors.componentId && <p className="text-sm text-red-500 mt-1">{errors.componentId}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng (ml) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="VD: 500"
                />
                {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
                <p className="text-xs text-gray-500 mt-1">Nhập thể tích máu (1-10,000ml)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lô <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                    disabled={loading}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.batchNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="VD: BLD20240101001"
                  />
                  <button
                    type="button"
                    onClick={generateBatchNumber}
                    disabled={loading}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    title="Tạo số lô tự động"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>
                {errors.batchNumber && <p className="text-sm text-red-500 mt-1">{errors.batchNumber}</p>}
                <p className="text-xs text-gray-500 mt-1">Mã định danh duy nhất cho lô máu</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.addedDate}
                    onChange={(e) => handleInputChange('addedDate', e.target.value)}
                    disabled={loading}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.addedDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.addedDate && <p className="text-sm text-red-500 mt-1">{errors.addedDate}</p>}
                <p className="text-xs text-gray-500 mt-1">Ngày nhập kho (không được trong tương lai)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hạn sử dụng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    disabled={loading}
                    min={formData.addedDate}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
                {formData.addedDate && formData.expiryDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Thời hạn: {Math.ceil((new Date(formData.expiryDate) - new Date(formData.addedDate)) / (1000 * 60 * 60 * 24))} ngày
                  </p>
                )}
              </div>
            </div>

            {expiryStatus && (
              <div className={`p-4 rounded-lg flex items-center space-x-3 ${expiryStatus.color === 'red'
                  ? 'bg-red-50 border border-red-200'
                  : expiryStatus.color === 'yellow'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-green-50 border border-green-200'
                }`}>
                {expiryStatus.color === 'red' ? (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                ) : expiryStatus.color === 'yellow' ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-medium ${expiryStatus.color === 'red' ? 'text-red-800'
                      : expiryStatus.color === 'yellow' ? 'text-yellow-800'
                        : 'text-green-800'
                    }`}>
                    {expiryStatus.message}
                  </p>
                  <p className={`text-sm ${expiryStatus.color === 'red' ? 'text-red-600'
                      : expiryStatus.color === 'yellow' ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                    {expiryStatus.type === 'expired'
                      ? 'Sản phẩm này đã quá hạn sử dụng'
                      : expiryStatus.type === 'expiring'
                        ? 'Cần ưu tiên sử dụng sớm'
                        : 'Sản phẩm có thể được lưu trữ và sử dụng bình thường'
                    }
                  </p>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || (expiryStatus?.type === 'expired')}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>{inventory ? 'Cập nhật kho máu' : 'Thêm vào kho'}</span>
                )}
              </button>
            </div>

            {expiryStatus?.type === 'expired' && (
              <div className="text-center">
                <p className="text-sm text-red-600">
                  Không thể lưu sản phẩm đã hết hạn. Vui lòng kiểm tra lại ngày hạn sử dụng.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default InventoryFormModal;