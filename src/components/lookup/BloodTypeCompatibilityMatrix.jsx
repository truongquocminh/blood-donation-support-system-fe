import React from 'react';
import { CheckCircle, X, AlertCircle, ArrowRight, ArrowDown } from 'lucide-react';

const BloodTypeCompatibilityMatrix = ({ filteredTypes, isCompatible }) => {
    if (filteredTypes.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Ma trận tương thích truyền máu</h2>
                <p className="text-sm text-gray-600 mt-1">
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
                            {filteredTypes.map(bloodType => (
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
                        {filteredTypes.map(donorType => (
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
                                {filteredTypes.map(recipientType => {
                                    const canDonate = isCompatible(donorType, recipientType);

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
                        <div className="mt-1">Tổng: {filteredTypes.length} nhóm máu × {filteredTypes.length} mối quan hệ</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BloodTypeCompatibilityMatrix;