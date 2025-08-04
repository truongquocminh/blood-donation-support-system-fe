import React, { useState } from 'react';
import { Save, X, CheckCircle, AlertTriangle, Edit3, Grid3X3, List, Loader2, ArrowRight, ArrowLeft, ArrowDown } from 'lucide-react';
import { updateBloodType } from '../../services/bloodTypeService';
import toast from 'react-hot-toast';
import HandleLoading from '../common/HandleLoading';

const BloodTypeCompatibilityManager = ({ bloodTypes, onUpdate }) => {
    const [editingType, setEditingType] = useState(null);
    const [editingDonateIds, setEditingDonateIds] = useState([]);
    const [editingReceiveIds, setEditingReceiveIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [savingType, setSavingType] = useState(null);

    const handleEditType = (bloodType) => {
        setEditingType(bloodType.id);

        const currentDonateIds = bloodType.canDonateTo
            ? bloodType.canDonateTo.split(',').filter(id => id.trim() !== '')
            : [];
        const currentReceiveIds = bloodType.canReceiveFrom
            ? bloodType.canReceiveFrom.split(',').filter(id => id.trim() !== '')
            : [];

        setEditingDonateIds(currentDonateIds);
        setEditingReceiveIds(currentReceiveIds);
    };

    const handleCancelEdit = () => {
        setEditingType(null);
        setEditingDonateIds([]);
        setEditingReceiveIds([]);
    };

    const handleDonateToggle = (bloodTypeId) => {
        const bloodTypeIdStr = String(bloodTypeId);
        setEditingDonateIds(prev => {
            const isCurrentlySelected = prev.includes(bloodTypeIdStr);
            if (isCurrentlySelected) {
                return prev.filter(id => id !== bloodTypeIdStr);
            } else {
                return [...prev, bloodTypeIdStr];
            }
        });
    };

    const handleReceiveToggle = (bloodTypeId) => {
        const bloodTypeIdStr = String(bloodTypeId);
        setEditingReceiveIds(prev => {
            const isCurrentlySelected = prev.includes(bloodTypeIdStr);
            if (isCurrentlySelected) {
                return prev.filter(id => id !== bloodTypeIdStr);
            } else {
                return [...prev, bloodTypeIdStr];
            }
        });
    };

    const handleSaveCompatibility = async (bloodType) => {
        try {
            setLoading(true);
            setSavingType(bloodType.id);

            const donateToString = editingDonateIds.join(',');
            const receiveFromString = editingReceiveIds.join(',');

            const updateData = {
                typeName: bloodType.typeName,
                componentIds: bloodType.components?.map(component => component.componentId) || [],
                canDonateTo: donateToString || null,
                canReceiveFrom: receiveFromString || null,
            };

            const response = await updateBloodType(bloodType.id, updateData);

            if (response.status === 200) {
                toast.success('Cập nhật tương thích thành công!');
                setEditingType(null);
                setEditingDonateIds([]);
                setEditingReceiveIds([]);

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

    const getBloodTypeById = (id) => {
        return bloodTypes.find(bt => bt.id === id);
    };

    return (
        <div className="space-y-6">
            {loading && <HandleLoading />}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Bảng tương thích giữa các loại máu
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Quản lý khả năng cho và nhận máu giữa các nhóm máu
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                {bloodTypes.length} nhóm máu
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
                        <div className="mb-4 px-6 pt-4">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Ma trận tương thích truyền máu</h4>
                            <p className="text-sm text-gray-500">
                                <span className="font-medium">Hàng ngang:</span> Người hiến máu |
                                <span className="font-medium ml-2">Hàng dọc:</span> Người nhận máu
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                                            <div className="text-center">
                                                <div className='text-blue-600 flex items-center justify-center space-x-2'>
                                                    <ArrowRight className="w-4 h-4 " />
                                                    <p className=" font-semibold">Người hiến</p>
                                                </div>
                                                <div className="text-green-500 flex items-center justify-center space-x-2 mt-1">
                                                    <ArrowDown className="w-4 h-4 " />
                                                    <p className='text-xs mt-1'>Người nhận</p>
                                                </div>
                                            </div>
                                        </th>
                                        {bloodTypes.map(bloodType => (
                                            <th
                                                key={bloodType.id}
                                                className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider min-w-[100px] bg-blue-50"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {bloodType.typeName}
                                                    </span>
                                                    <span className="text-xs text-blue-600 mt-1">Nhận</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bloodTypes.map(donorType => (
                                        <tr key={donorType.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-green-50 z-10 border-r border-gray-200">
                                                <div className="flex items-center justify-center">
                                                    <div className="text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {donorType.typeName}
                                                        </span>
                                                        <div className="text-xs text-green-600 mt-1">Hiến</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {bloodTypes.map(recipientType => {
                                                const canDonate = donorType.canDonateTo &&
                                                    donorType.canDonateTo.split(',').some(id => id.trim() === String(recipientType.id));

                                                return (
                                                    <td key={`${donorType.id}-${recipientType.id}`} className="px-4 py-3 text-center">
                                                        {canDonate ? (
                                                            <div className="w-8 h-8 bg-green-100 border-2 border-green-300 rounded-full mx-auto flex items-center justify-center">
                                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 bg-red-100 border-2 border-red-300 rounded-full mx-auto flex items-center justify-center">
                                                                <X className="w-5 h-5 text-red-500" />
                                                            </div>
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
                                        <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-gray-600">Có thể truyền máu</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded-full flex items-center justify-center">
                                            <X className="w-4 h-4 text-red-500" />
                                        </div>
                                        <span className="text-gray-600">Không được truyền</span>
                                    </div>

                                </div>
                                <div className="text-sm text-gray-500">
                                    <div>Nguyên tắc: Hàng ngang (hiến) → Hàng dọc (nhận)</div>
                                    <div className="mt-1">Tổng: {bloodTypes.length} nhóm máu × {bloodTypes.length} mối quan hệ</div>
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
                                    Có thể cho máu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Có thể nhận máu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thống kê
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bloodTypes.map((bloodType) => (
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
                                                <div className="grid grid-cols-4 gap-2">
                                                    {bloodTypes.map(bt => (
                                                        <label
                                                            key={bt.id}
                                                            className={`flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 ${loading ? 'pointer-events-none opacity-50' : ''}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={editingDonateIds.includes(String(bt.id))}
                                                                onChange={() => handleDonateToggle(bt.id)}
                                                                disabled={loading}
                                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50"
                                                            />
                                                            <span className="text-sm text-gray-700">
                                                                {bt.typeName}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Đã chọn: {editingDonateIds.length} nhóm máu
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {bloodType.canDonateTo ? (
                                                    bloodType.canDonateTo.split(',').filter(id => id.trim() !== '').map((btId) => {
                                                        const bt = bloodTypes.find(type => type.id === parseInt(btId.trim()));
                                                        return bt ? (
                                                            <span key={btId} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                                <ArrowRight className="w-3 h-3 mr-1" />
                                                                {bt.typeName}
                                                            </span>
                                                        ) : null;
                                                    })
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">
                                                        Không có nhóm máu nào
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingType === bloodType.id ? (
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {bloodTypes.map(bt => (
                                                        <label
                                                            key={bt.id}
                                                            className={`flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 ${loading ? 'pointer-events-none opacity-50' : ''}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={editingReceiveIds.includes(String(bt.id))}
                                                                onChange={() => handleReceiveToggle(bt.id)}
                                                                disabled={loading}
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                                            />
                                                            <span className="text-sm text-gray-700">
                                                                {bt.typeName}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Đã chọn: {editingReceiveIds.length} nhóm máu
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {bloodType.canReceiveFrom ? (
                                                    bloodType.canReceiveFrom.split(',').filter(id => id.trim() !== '').map((btId) => {
                                                        const bt = bloodTypes.find(type => type.id === parseInt(btId.trim()));
                                                        return bt ? (
                                                            <span key={btId} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                                                <ArrowLeft className="w-3 h-3 mr-1" />
                                                                {bt.typeName}
                                                            </span>
                                                        ) : null;
                                                    })
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">
                                                        Không có nhóm máu nào
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            {editingType === bloodType.id ? (
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <div>Cho: {editingDonateIds.length}</div>
                                                    <div>Nhận: {editingReceiveIds.length}</div>
                                                </div>
                                            ) : (
                                                <div className="text-sm space-y-1">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 mr-2">Cho:</span>
                                                        <span className="font-medium text-green-700">
                                                            {bloodType.canDonateTo ? bloodType.canDonateTo.split(',').filter(id => id.trim() !== '').length : 0}
                                                        </span>
                                                        {bloodType.canDonateTo && bloodType.canDonateTo.split(',').filter(id => id.trim() !== '').length > 0 ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500 ml-1" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-yellow-500 ml-1" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 mr-2">Nhận:</span>
                                                        <span className="font-medium text-blue-700">
                                                            {bloodType.canReceiveFrom ? bloodType.canReceiveFrom.split(',').filter(id => id.trim() !== '').length : 0}
                                                        </span>
                                                        {bloodType.canReceiveFrom && bloodType.canReceiveFrom.split(',').filter(id => id.trim() !== '').length > 0 ? (
                                                            <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-yellow-500 ml-1" />
                                                        )}
                                                    </div>
                                                </div>
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
        </div>
    );
};

export default BloodTypeCompatibilityManager;