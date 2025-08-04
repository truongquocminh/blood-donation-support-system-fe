import React from 'react';
import { CheckCircle, XCircle, Droplets, AlertCircle } from 'lucide-react';

const ComponentCompatibilityList = ({ filteredTypes, filteredComponents, isCompatible, getComponentDisplayName }) => {
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

export default ComponentCompatibilityList;