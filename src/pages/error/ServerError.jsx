import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Button from '../../components/ui/Button';

const ServerError = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Đã có lỗi xảy ra
        </h1>
        
        <div className="text-xl text-gray-600 mb-8">
          Xin lỗi! Máy chủ đang gặp sự cố.
          Vui lòng thử lại sau hoặc liên hệ với chúng tôi nếu sự cố vẫn tiếp tục.
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            icon={<RefreshCcw />}
            onClick={handleRefresh}
            className="mr-4"
          >
            Tải lại trang
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
          Mã lỗi: 500 - Internal Server Error
        </div>

        <div className="absolute top-1/4 left-8 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob"></div>
        <div className="absolute bottom-1/4 right-8 w-24 h-24 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default ServerError; 