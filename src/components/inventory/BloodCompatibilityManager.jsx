import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, CheckCircle, AlertTriangle, Edit3, Grid3X3, List, Loader2 } from 'lucide-react';
import { updateBloodType, removeComponentFromBloodType } from '../../services/bloodTypeService';
import toast from 'react-hot-toast';
import HandleLoading from '../common/HandleLoading';

const BloodCompatibilityManager = ({
    bloodTypes,
    bloodComponents,
    onUpdate
}) => {
    const [editingType, setEditingType] = useState(null);
    const [editingComponents, setEditingComponents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [confirmModal, setConfirmModal] = useState({ open: false, bloodTypeId: null, componentId: null });
    const [savingType, setSavingType] = useState(null); 
    const [removingComponent, setRemovingComponent] = useState(null); 

    const getCompatibilityMatrix = () => {
        return bloodTypes.map(type => ({
            ...type,
            compatibleComponents: type.components || []
        }));
    };

    const handleEditType = (bloodType) => {
        setEditingType(bloodType.id);
        const currentComponentIds = bloodType.components
            ? bloodType.components.map(c => c.id || c.componentId)
            : [];
        setEditingComponents(currentComponentIds);
    };

    const handleCancelEdit = () => {
        setEditingType(null);
        setEditingComponents([]);
    };

    const handleComponentToggle = (componentId) => {
        setEditingComponents(prev => {
            const isCurrentlySelected = prev.includes(componentId);
            let newComponents;

            if (isCurrentlySelected) {
                newComponents = prev.filter(id => id !== componentId);
            } else {
                newComponents = [...prev, componentId];
            }

            return newComponents;
        });
    };

    const handleSaveCompatibility = async (bloodType) => {
        try {
            setLoading(true);
            setSavingType(bloodType.id); 

            const updateData = {
                bloodTypeId: bloodType.id,
                typeName: bloodType.typeName,
                componentIds: editingComponents
            };

            const response = await updateBloodType(bloodType.id, updateData);

            if (response.status === 200) {
                toast.success('Cập nhật tương thích thành công!');
                setEditingType(null);
                setEditingComponents([]);

                if (onUpdate) {
                    onUpdate();
                }
            } else {
                toast.error('Không thể cập nhật tương thích');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật tương thích:', error);
            toast.error('Lỗi khi cập nhật tương thích');
        } finally {
            setLoading(false);
            setSavingType(null);
        }
    };

    const openConfirmModal = (bloodTypeId, componentId) => {
        setConfirmModal({ open: true, bloodTypeId, componentId });
    };

    const handleConfirmRemove = async () => {
        const { bloodTypeId, componentId } = confirmModal;
        setConfirmModal({ open: false, bloodTypeId: null, componentId: null });

        try {
            setLoading(true);
            setRemovingComponent(`${bloodTypeId}-${componentId}`);
            
            const response = await removeComponentFromBloodType(bloodTypeId, componentId);
            if (response.status === 200) {
                toast.success('Xóa thành phần thành công!');
                if (onUpdate) onUpdate();
            } else {
                toast.error('Không thể xóa thành phần');
            }
        } catch (error) {
            console.error('Lỗi khi xóa thành phần:', error);
            toast.error('Lỗi khi xóa thành phần');
        } finally {
            setLoading(false);
            setRemovingComponent(null);
        }
    };

    const compatibilityMatrix = getCompatibilityMatrix();

    return (
        <div className="space-y-6">
            {loading && (
                <HandleLoading/>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Bảng tương thích truyền máu
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Quản lý thành phần máu tương thích với từng nhóm máu
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                {compatibilityMatrix.length} nhóm máu
                            </div>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    disabled={loading}
                                    className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${viewMode === 'list'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                    <span>Danh sách</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('matrix')}
                                    disabled={loading}
                                    className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${viewMode === 'matrix'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                    <span>Ma trận</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {viewMode === 'matrix' ? (
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                                            Nhóm máu
                                        </th>
                                        {bloodComponents.map(component => (
                                            <th
                                                key={component.id}
                                                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                                            >
                                                <div className="text-center text-xs">
                                                    {component.componentName}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {compatibilityMatrix.map(bloodType => (
                                        <tr key={bloodType.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {bloodType.typeName}
                                                </span>
                                            </td>
                                            {bloodComponents.map(component => {
                                                const isCompatible = bloodType.components && bloodType.components.some(comp => comp.componentId === component.componentId);
                                                return (
                                                    <td key={`${bloodType.id}-${component.componentId}`} className="px-4 py-3 text-center">
                                                        {isCompatible ? (
                                                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                                        ) : (
                                                            <X className="w-5 h-5 text-red-300 mx-auto" />
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-gray-600">Tương thích</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <X className="w-4 h-4 text-red-300" />
                                        <span className="text-gray-600">Không tương thích</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Tổng: {compatibilityMatrix.length} nhóm máu × {bloodComponents.length} thành phần
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nhóm máu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thành phần tương thích
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số lượng
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {compatibilityMatrix.map((bloodType) => (
                                <tr key={bloodType.id} className={`hover:bg-gray-50 ${loading ? 'opacity-75' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {bloodType.typeName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingType === bloodType.id ? (
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {bloodComponents.map(component => {
                                                        return (
                                                            <label
                                                                key={component.componentId}
                                                                className={`flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 ${loading ? 'pointer-events-none opacity-50' : ''}`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    value={component.componentId}
                                                                    checked={editingComponents.includes(component.componentId)}
                                                                    onChange={() => handleComponentToggle(component.componentId)}
                                                                    disabled={loading}
                                                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 disabled:opacity-50"
                                                                />
                                                                <span className="text-sm text-gray-700">
                                                                    {component.componentName}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Đã chọn: {editingComponents.length} thành phần
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {bloodType.compatibleComponents.length > 0 ? (
                                                    bloodType.compatibleComponents.map((component) => (
                                                        <div
                                                            key={component.componentId}
                                                            className="group relative inline-flex items-center"
                                                        >
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                                                {component.componentName}
                                                                <button
                                                                    onClick={() => openConfirmModal(bloodType.id, component.componentId)}
                                                                    disabled={loading}
                                                                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-25"
                                                                    title="Xóa thành phần"
                                                                >
                                                                    {removingComponent === `${bloodType.id}-${component.componentId}` ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : (
                                                                        <X className="w-3 h-3" />
                                                                    )}
                                                                </button>
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">
                                                        Chưa có thành phần tương thích
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {editingType === bloodType.id ? (
                                                <span className="text-sm text-gray-600">
                                                    {editingComponents.length} thành phần
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {bloodType.compatibleComponents.length}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-1">thành phần</span>
                                                    {bloodType.compatibleComponents.length > 0 ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                                    ) : (
                                                        <AlertTriangle className="w-4 h-4 text-yellow-500 ml-2" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {editingType === bloodType.id ? (
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleSaveCompatibility(bloodType)}
                                                    disabled={loading}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Lưu thay đổi"
                                                >
                                                    {savingType === bloodType.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Save className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    disabled={loading}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Hủy"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEditType(bloodType)}
                                                disabled={loading}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Chỉnh sửa tương thích"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {confirmModal.open && (
                <div className="mt-0-important fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận xoá</h2>
                        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xoá thành phần này khỏi nhóm máu?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setConfirmModal({ open: false, bloodTypeId: null, componentId: null })}
                                disabled={loading}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmRemove}
                                disabled={loading}
                                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang xoá...</span>
                                    </>
                                ) : (
                                    <span>Xác nhận</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BloodCompatibilityManager;