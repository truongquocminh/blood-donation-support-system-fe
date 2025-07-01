import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, BookOpen, Heart, Users } from 'lucide-react';
import BloodCompatibilityLookup from '../../components/lookup/BloodCompatibilityLookup';
import CompatibilitySearchWidget from '../../components/lookup/CompatibilitySearchWidget';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getBloodComponents } from '../../services/bloodComponentService';
import toast from 'react-hot-toast';

const BloodLookupPage = () => {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('search'); 

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-red-200" />
            <h1 className="text-4xl font-bold mb-4">
              Tra cứu tương thích truyền máu
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Hệ thống tra cứu độ tương thích giữa các nhóm máu và thành phần máu. 
              Hỗ trợ công tác y tế và giáo dục về an toàn truyền máu.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveView('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'search'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Kiểm tra nhanh</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('lookup')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'lookup'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Bảng tương thích đầy đủ</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'search' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CompatibilitySearchWidget 
                  bloodTypes={bloodTypes} 
                  bloodComponents={bloodComponents} 
                />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê hệ thống</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tổng nhóm máu</span>
                      <span className="font-semibold text-gray-900">{bloodTypes.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tổng thành phần</span>
                      <span className="font-semibold text-gray-900">{bloodComponents.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tổng tổ hợp</span>
                      <span className="font-semibold text-gray-900">
                        {bloodTypes.length * bloodComponents.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Truy cập nhanh</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveView('lookup')}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-900">Bảng đầy đủ</div>
                        <div className="text-xs text-gray-500">Xem tất cả tương thích</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={fetchData}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium text-gray-900">Cập nhật dữ liệu</div>
                        <div className="text-xs text-gray-500">Tải lại thông tin mới</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-blue-900">Tại sao cần kiểm tra?</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  Việc kiểm tra tương thích trước khi truyền máu là bắt buộc để đảm bảo an toàn 
                  cho người nhận và tránh các phản ứng bất lợi.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-900">Dành cho ai?</h3>
                </div>
                <p className="text-green-800 text-sm">
                  Hệ thống phục vụ các bác sĩ, điều dưỡng, sinh viên y khoa và những người 
                  quan tâm đến kiến thức về truyền máu.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-medium text-yellow-900">Cách sử dụng</h3>
                </div>
                <p className="text-yellow-800 text-sm">
                  Chọn nhóm máu và thành phần máu để kiểm tra tương thích, hoặc xem bảng 
                  tổng quan để có cái nhìn toàn diện.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <BloodCompatibilityLookup />
        )}
      </div>

      
    </div>
  );
};

export default BloodLookupPage;