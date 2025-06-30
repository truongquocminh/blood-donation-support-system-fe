import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Droplets, Activity, Grid3X3, List, AlertCircle, Info } from 'lucide-react';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getBloodComponents } from '../../services/bloodComponentService';
import toast from 'react-hot-toast';

const BloodCompatibilityLookup = () => {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [filterComponent, setFilterComponent] = useState('');
  const [viewMode, setViewMode] = useState('matrix'); // 'matrix' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [typesRes, componentsRes] = await Promise.all([
        getBloodTypes(),
        getBloodComponents()
      ]);

      if (typesRes.status === 200 && typesRes.data.data?.content) {
        setBloodTypes(typesRes.data.data.content);
      } else {
        toast.error('Không thể tải danh sách nhóm máu');
      }

      if (componentsRes.status === 200 && componentsRes.data.data?.content) {
        setBloodComponents(componentsRes.data.data.content);
      } else {
        toast.error('Không thể tải danh sách thành phần máu');
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Lỗi khi tải dữ liệu tương thích');
    } finally {
      setLoading(false);
    }
  };

  const isCompatible = (bloodType, component) => {
    if (!bloodType.components || !Array.isArray(bloodType.components)) return false;
    return bloodType.components.some(comp => comp.componentId === component.componentId);
  };

  const getFilteredData = () => {
    let filteredTypes = bloodTypes;
    let filteredComponents = bloodComponents;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredTypes = bloodTypes.filter(bt => 
        bt.typeName.toLowerCase().includes(searchLower)
      );
      filteredComponents = bloodComponents.filter(bc => 
        bc.componentName.toLowerCase().includes(searchLower)
      );
    }

    if (filterBloodType) {
      filteredTypes = bloodTypes.filter(bt => bt.id.toString() === filterBloodType);
    }

    if (filterComponent) {
      filteredComponents = bloodComponents.filter(bc => bc.id.toString() === filterComponent);
    }

    return { filteredTypes, filteredComponents };
  };

  const getCompatibilityStats = () => {
    const { filteredTypes, filteredComponents } = getFilteredData();
    let totalCompatible = 0;
    let totalCombinations = filteredTypes.length * filteredComponents.length;

    filteredTypes.forEach(bloodType => {
      filteredComponents.forEach(component => {
        if (isCompatible(bloodType, component)) {
          totalCompatible++;
        }
      });
    });

    return {
      totalCompatible,
      totalCombinations,
      compatibilityRate: totalCombinations > 0 ? Math.round((totalCompatible / totalCombinations) * 100) : 0
    };
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

  const { filteredTypes, filteredComponents } = getFilteredData();
  const stats = getCompatibilityStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu tương thích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tra cứu tương thích truyền máu
              </h1>
              <p className="text-gray-600">
                Kiểm tra độ tương thích giữa các nhóm máu và thành phần máu
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Bộ lọc</span>
              </button>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('matrix')}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'matrix' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Ma trận</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Danh sách</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên nhóm máu hoặc thành phần máu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn nhóm máu cụ thể
                  </label>
                  <select
                    value={filterBloodType}
                    onChange={(e) => setFilterBloodType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Tất cả nhóm máu</option>
                    {bloodTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.typeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn thành phần máu cụ thể
                  </label>
                  <select
                    value={filterComponent}
                    onChange={(e) => setFilterComponent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Tất cả thành phần</option>
                    {bloodComponents.map(component => (
                      <option key={component.componentId} value={component.componentId}>
                        {getComponentDisplayName(component.componentName)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Hiển thị {filteredTypes.length} nhóm máu và {filteredComponents.length} thành phần
                </div>
                <button
                  onClick={() => {
                    setFilterBloodType('');
                    setFilterComponent('');
                    setSearchTerm('');
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Droplets className="w-8 h-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nhóm máu</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredTypes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Thành phần</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredComponents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tương thích</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCompatible}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Info className="w-8 h-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tỷ lệ</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.compatibilityRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === 'matrix' ? (
          <MatrixView 
            filteredTypes={filteredTypes} 
            filteredComponents={filteredComponents} 
            isCompatible={isCompatible}
            getComponentDisplayName={getComponentDisplayName}
          />
        ) : (
          <ListView 
            filteredTypes={filteredTypes} 
            filteredComponents={filteredComponents} 
            isCompatible={isCompatible}
            getComponentDisplayName={getComponentDisplayName}
          />
        )}

        {/* Information Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Hướng dẫn sử dụng
              </h3>
              <div className="text-blue-800 space-y-2 text-sm">
                <p>• <strong>Ma trận:</strong> Xem tổng quan tương thích giữa tất cả nhóm máu và thành phần</p>
                <p>• <strong>Danh sách:</strong> Xem chi tiết từng nhóm máu và các thành phần tương thích</p>
                <p>• <strong>Tìm kiếm:</strong> Nhập tên nhóm máu (VD: A_POS) hoặc thành phần (VD: WHOLE_BLOOD)</p>
                <p>• <strong>Bộ lọc:</strong> Chọn nhóm máu hoặc thành phần cụ thể để xem chi tiết</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Matrix View Component
const MatrixView = ({ filteredTypes, filteredComponents, isCompatible, getComponentDisplayName }) => {
  if (filteredTypes.length === 0 || filteredComponents.length === 0) {
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
        <h2 className="text-lg font-medium text-gray-900">Ma trận tương thích</h2>
        <p className="text-sm text-gray-600 mt-1">
          Xem tương thích giữa {filteredTypes.length} nhóm máu và {filteredComponents.length} thành phần
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                Nhóm máu
              </th>
              {filteredComponents.map(component => (
                <th 
                  key={component.componentId} 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  <div className="text-center">
                    <div className="font-semibold">{component.componentName}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getComponentDisplayName(component.componentName)}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTypes.map(bloodType => (
              <tr key={bloodType.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900">{bloodType.typeName}</div>
                      <div className="text-xs text-gray-500">ID: {bloodType.id}</div>
                    </div>
                  </div>
                </td>
                {filteredComponents.map(component => (
                  <td key={`${bloodType.id}-${component.componentId}`} className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      {isCompatible(bloodType, component) ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-xs font-medium">Có</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-400">
                          <XCircle className="w-5 h-5" />
                          <span className="text-xs font-medium">Không</span>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// List View Component
const ListView = ({ filteredTypes, filteredComponents, isCompatible, getComponentDisplayName }) => {
  if (filteredTypes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhóm máu</h3>
        <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTypes.map(bloodType => {
        const compatibleComponents = filteredComponents.filter(component => 
          isCompatible(bloodType, component)
        );
        
        return (
          <div key={bloodType.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Droplets className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{bloodType.typeName}</h3>
                    <p className="text-sm text-gray-500">Nhóm máu ID: {bloodType.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Tương thích với</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {compatibleComponents.length} / {filteredComponents.length} thành phần
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {compatibleComponents.length > 0 ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Thành phần tương thích:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {compatibleComponents.map(component => (
                      <div key={component.componentId} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-green-900">{component.componentName}</div>
                          <div className="text-xs text-green-700">{getComponentDisplayName(component.componentName)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 mx-auto text-red-300 mb-3" />
                  <p className="text-gray-500">Không có thành phần máu tương thích với bộ lọc hiện tại</p>
                </div>
              )}
              
              {filteredComponents.length > compatibleComponents.length && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Thành phần không tương thích:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredComponents
                      .filter(component => !isCompatible(bloodType, component))
                      .map(component => (
                        <div key={component.componentId} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-red-900">{component.componentName}</div>
                            <div className="text-xs text-red-700">{getComponentDisplayName(component.componentName)}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BloodCompatibilityLookup;