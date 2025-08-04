import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Droplets, Activity, Grid3X3, List, AlertCircle, Info, Users } from 'lucide-react';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getBloodComponents } from '../../services/bloodComponentService';
import toast from 'react-hot-toast';
import ComponentCompatibilityMatrix from './ComponentCompatibilityMatrix';
import ComponentCompatibilityList from './ComponentCompatibilityList';
import BloodTypeCompatibilityMatrix from './BloodTypeCompatibilityMatrix';
import BloodTypeCompatibilityList from './BloodTypeCompatibilityList';
import CompatibilitySearchWidget from './CompatibilitySearchWidget';

const BloodCompatibilityLookup = () => {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [filterComponent, setFilterComponent] = useState('');
  const [viewMode, setViewMode] = useState('matrix');
  const [compatibilityType, setCompatibilityType] = useState('component');
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

  const isComponentCompatible = (bloodType, component) => {
    if (!bloodType.components || !Array.isArray(bloodType.components)) return false;
    return bloodType.components.some(comp => comp.componentId === component.componentId);
  };

  const isBloodTypeCompatible = (donorType, recipientType) => {
    if (!donorType.canDonateTo) return false;
    return donorType.canDonateTo.split(',').some(id => id.trim() === String(recipientType.id));
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
      filteredComponents = bloodComponents.filter(bc => bc.componentId.toString() === filterComponent);
    }

    return { filteredTypes, filteredComponents };
  };

  const getCompatibilityStats = () => {
    const { filteredTypes, filteredComponents } = getFilteredData();

    if (compatibilityType === 'component') {
      let totalCompatible = 0;
      let totalCombinations = filteredTypes.length * filteredComponents.length;

      filteredTypes.forEach(bloodType => {
        filteredComponents.forEach(component => {
          if (isComponentCompatible(bloodType, component)) {
            totalCompatible++;
          }
        });
      });

      return {
        totalCompatible,
        totalCombinations,
        compatibilityRate: totalCombinations > 0 ? Math.round((totalCompatible / totalCombinations) * 100) : 0
      };
    } else {
      let totalCompatible = 0;
      let totalCombinations = filteredTypes.length * filteredTypes.length;

      filteredTypes.forEach(donorType => {
        filteredTypes.forEach(recipientType => {
          if (isBloodTypeCompatible(donorType, recipientType)) {
            totalCompatible++;
          }
        });
      });

      return {
        totalCompatible,
        totalCombinations,
        compatibilityRate: totalCombinations > 0 ? Math.round((totalCompatible / totalCombinations) * 100) : 0
      };
    }
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

  const renderCompatibilityView = () => {
    if (compatibilityType === 'component') {
      return viewMode === 'matrix' ? (
        <ComponentCompatibilityMatrix
          filteredTypes={filteredTypes}
          filteredComponents={filteredComponents}
          isCompatible={isComponentCompatible}
          getComponentDisplayName={getComponentDisplayName}
        />
      ) : (
        <ComponentCompatibilityList
          filteredTypes={filteredTypes}
          filteredComponents={filteredComponents}
          isCompatible={isComponentCompatible}
          getComponentDisplayName={getComponentDisplayName}
        />
      );
    } else {
      return viewMode === 'matrix' ? (
        <BloodTypeCompatibilityMatrix
          filteredTypes={filteredTypes}
          isCompatible={isBloodTypeCompatible}
        />
      ) : (
        <BloodTypeCompatibilityList
          filteredTypes={filteredTypes}
          isCompatible={isBloodTypeCompatible}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-col lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tra cứu tương thích truyền máu
              </h1>
              <p className="text-gray-600">
                Kiểm tra độ tương thích giữa các nhóm máu và thành phần máu
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCompatibilityType('component')}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${compatibilityType === 'component'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Máu - Thành phần</span>
                </button>
                <button
                  onClick={() => setCompatibilityType('bloodtype')}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${compatibilityType === 'bloodtype'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Truyền máu</span>
                </button>
              </div>

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
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'matrix'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Ma trận</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={compatibilityType === 'component'
                    ? "Tìm kiếm theo tên nhóm máu hoặc thành phần máu..."
                    : "Tìm kiếm theo tên nhóm máu..."
                  }
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

                {compatibilityType === 'component' && (
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
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {compatibilityType === 'component'
                    ? `Hiển thị ${filteredTypes.length} nhóm máu và ${filteredComponents.length} thành phần`
                    : `Hiển thị ${filteredTypes.length} nhóm máu`
                  }
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

          {compatibilityType === 'component' && (
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
          )}

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

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <CompatibilitySearchWidget
              bloodTypes={bloodTypes}
              bloodComponents={bloodComponents}
              compatibilityType={compatibilityType}
              isComponentCompatible={isComponentCompatible}
              isBloodTypeCompatible={isBloodTypeCompatible}
              getComponentDisplayName={getComponentDisplayName}
            />
          </div>
          <div className="lg:col-span-2">
            {renderCompatibilityView()}
          </div>

        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Hướng dẫn sử dụng
              </h3>
              <div className="text-blue-800 space-y-2 text-sm">
                <p>• <strong>Máu - Thành phần:</strong> Xem tương thích giữa nhóm máu và các thành phần máu</p>
                <p>• <strong>Truyền máu:</strong> Xem nguyên tắc truyền máu giữa các nhóm máu</p>
                <p>• <strong>Ma trận:</strong> Xem tổng quan tương thích dưới dạng bảng</p>
                <p>• <strong>Danh sách:</strong> Xem chi tiết từng nhóm máu và các mối quan hệ</p>
                <p>• <strong>Tìm kiếm:</strong> Nhập tên nhóm máu hoặc thành phần để lọc kết quả</p>
                <p>• <strong>Kiểm tra nhanh:</strong> Sử dụng widget bên phải để kiểm tra tương thích cụ thể</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityLookup;