import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Search className="w-12 h-12 text-blue-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Không tìm thấy trang
        </h1>
        
        <div className="text-xl text-gray-600 mb-8">
          Xin lỗi! Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowLeft />}
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            Quay lại
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            icon={<Home />}
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Mã lỗi: 404 - Page Not Found
        </div>

        <div className="absolute top-1/4 left-8 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob"></div>
        <div className="absolute bottom-1/4 right-8 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>

        <div className="relative mt-12">
          <div className="w-full h-px bg-gray-200 absolute top-1/2 left-0"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full absolute top-1/2 left-0 transform -translate-y-1/2"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full absolute top-1/2 left-1/4 transform -translate-y-1/2"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full absolute top-1/2 left-2/4 transform -translate-y-1/2"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full absolute top-1/2 left-3/4 transform -translate-y-1/2"></div>
          <div className="w-3 h-3 bg-red-400 rounded-full absolute top-1/2 right-0 transform -translate-y-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 