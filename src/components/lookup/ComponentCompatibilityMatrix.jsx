import React from 'react';
import { CheckCircle, XCircle, Droplets, AlertCircle } from 'lucide-react';

const ComponentCompatibilityMatrix = ({ filteredTypes, filteredComponents, isCompatible, getComponentDisplayName }) => {
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
        <h2 className="text-lg font-medium text-gray-900">Ma trận tương thích máu - thành phần</h2>
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

export default ComponentCompatibilityMatrix;