import React from 'react';
import { CheckCircle, XCircle, Droplets, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const BloodTypeCompatibilityList = ({ filteredTypes, isCompatible }) => {
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
        const canDonateTo = filteredTypes.filter(recipientType => 
          isCompatible(bloodType, recipientType)
        );
        
        const canReceiveFrom = filteredTypes.filter(donorType => 
          isCompatible(donorType, bloodType)
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
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Cho: {canDonateTo.length} nhóm máu</div>
                    <div>Nhận: {canReceiveFrom.length} nhóm máu</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-600" />
                  Có thể cho máu cho:
                </h4>
                {canDonateTo.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {canDonateTo.map(recipientType => (
                      <div key={recipientType.id} className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium text-green-900">{recipientType.typeName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <XCircle className="w-8 h-8 mx-auto text-red-300 mb-2" />
                    <p className="text-gray-500 text-sm">Không thể cho máu cho nhóm máu nào</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2 text-blue-600" />
                  Có thể nhận máu từ:
                </h4>
                {canReceiveFrom.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {canReceiveFrom.map(donorType => (
                      <div key={donorType.id} className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium text-blue-900">{donorType.typeName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <XCircle className="w-8 h-8 mx-auto text-red-300 mb-2" />
                    <p className="text-gray-500 text-sm">Không thể nhận máu từ nhóm máu nào</p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-600">!</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</h5>
                    <p className="text-xs text-yellow-700 mt-1">
                      Thông tin này chỉ mang tính chất tham khảo. Trong thực tế, việc truyền máu phải được thực hiện 
                      bởi chuyên gia y tế và cần kiểm tra cross-match trước khi truyền.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BloodTypeCompatibilityList;