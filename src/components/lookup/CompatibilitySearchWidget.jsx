import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Droplets, Activity } from 'lucide-react';

const CompatibilitySearchWidget = ({ bloodTypes, bloodComponents }) => {
    const [selectedBloodType, setSelectedBloodType] = useState('');
    const [selectedComponent, setSelectedComponent] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const checkCompatibility = () => {
        if (!selectedBloodType || !selectedComponent) {
            setSearchResult({ error: 'Vui lòng chọn cả nhóm máu và thành phần máu' });
            return;
        }

        const bloodType = bloodTypes.find(bt => bt.id.toString() === selectedBloodType);
        const component = bloodComponents.find(bc => bc.componentId.toString() === selectedComponent);
        if (!bloodType || !component) {
            setSearchResult({ error: 'Không tìm thấy thông tin' });
            return;
        }

        const isCompatible = bloodType.components &&
            bloodType.components.some(comp => comp.componentId.toString() === selectedComponent);

        setSearchResult({
            bloodType,
            component,
            isCompatible,
            error: null
        });
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Kiểm tra tương thích nhanh
                </h3>
                <p className="text-sm text-gray-600">
                    Chọn nhóm máu và thành phần để kiểm tra độ tương thích
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Droplets className="w-4 h-4 inline mr-1" />
                            Nhóm máu
                        </label>
                        <select
                            value={selectedBloodType}
                            onChange={(e) => setSelectedBloodType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">Chọn nhóm máu</option>
                            {bloodTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.typeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Activity className="w-4 h-4 inline mr-1" />
                            Thành phần máu
                        </label>
                        <select
                            value={selectedComponent}
                            onChange={(e) => setSelectedComponent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">Chọn thành phần</option>
                            {bloodComponents.map(component => (
                                <option key={component.componentId} value={component.componentId}>
                                    {getComponentDisplayName(component.componentName)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={checkCompatibility}
                    disabled={!selectedBloodType || !selectedComponent}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    <Search className="w-4 h-4" />
                    <span>Kiểm tra tương thích</span>
                </button>

                {searchResult && (
                    <div className="mt-4">
                        {searchResult.error ? (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                    <span className="text-sm text-red-600">{searchResult.error}</span>
                                </div>
                            </div>
                        ) : (
                            <div className={`p-4 rounded-lg border ${searchResult.isCompatible
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="flex items-start space-x-3">
                                    {searchResult.isCompatible ? (
                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <div className={`font-medium text-sm ${searchResult.isCompatible ? 'text-green-800' : 'text-red-800'
                                            }`}>
                                            {searchResult.isCompatible ? 'Tương thích' : 'Không tương thích'}
                                        </div>
                                        <div className={`text-sm mt-1 ${searchResult.isCompatible ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                            Nhóm máu <strong>{searchResult.bloodType.typeName}</strong> với{' '}
                                            <strong>{getComponentDisplayName(searchResult.component.componentName)}</strong>
                                        </div>
                                        {!searchResult.isCompatible && (
                                            <div className="text-xs text-red-600 mt-2">
                                                💡 Gợi ý: Kiểm tra cấu hình tương thích trong hệ thống quản lý
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompatibilitySearchWidget;