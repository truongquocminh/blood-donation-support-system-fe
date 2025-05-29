import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Truy cập bị từ chối
        </h1>
        
        <div className="text-xl text-gray-600 mb-8">
          Bạn không có quyền truy cập vào trang này.
          Vui lòng đăng nhập hoặc liên hệ quản trị viên để được hỗ trợ.
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
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </Button>
        </div>

        <div className="absolute top-1/4 left-8 w-24 h-24 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob"></div>
        <div className="absolute bottom-1/4 right-8 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default Unauthorized; 