import React, { useState, useEffect } from 'react';
import { X, Heart, CheckCircle, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAppointmentHealthDeclaration } from '../../services/healthDeclarationService';
import { formatVietnamTime } from '../../utils/formatters';

const HealthDeclarationModal = ({ isOpen, onClose, appointmentId }) => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchHealthDeclaration();
    }
  }, [isOpen, appointmentId]);

  const fetchHealthDeclaration = async () => {
    try {
      setLoading(true);
      const response = await getAppointmentHealthDeclaration(appointmentId);
      
      if (response.status === 200 && response.data.data) {
        setHealthData(response.data.data);
      } else {
        toast.error('Không thể tải thông tin khai báo y tế');
      }
    } catch (error) {
      console.error('Error fetching health declaration:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin khai báo y tế');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setHealthData(null);
    onClose();
  };

  if (!isOpen) return null;

  const InfoRow = ({ icon: Icon, label, value, isBoolean = false }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
        {isBoolean ? (
          <div className="flex items-center space-x-2">
            {value ? (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600 font-medium">Có</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Không</span>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-900">{value || 'Không có thông tin'}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Khai báo y tế</h3>
              <p className="text-sm text-gray-500">Lịch hẹn #{appointmentId}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Đang tải thông tin...</span>
            </div>
          ) : healthData ? (
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium mb-1">Thông tin khai báo y tế:</p>
                    <p>Đây là thông tin đã được khai báo khi đặt lịch hẹn.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>💉</span>
                    <span>Tiền sử bệnh lý</span>
                  </h4>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <InfoRow
                      icon={Heart}
                      label="Bệnh lây qua đường máu"
                      value={healthData.hasBloodTransmittedDisease}
                      isBoolean={true}
                    />
                    
                    <InfoRow
                      icon={Heart}
                      label="Bệnh mãn tính"
                      value={healthData.hasChronicDisease}
                      isBoolean={true}
                    />
                    
                    <InfoRow
                      icon={FileText}
                      label="Thuốc đang sử dụng"
                      value={healthData.currentMedications}
                    />
                  </div>

                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2 pt-4">
                    <span>🏥</span>
                    <span>Hoạt động/tiền sử gần đây</span>
                  </h4>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <InfoRow
                      icon={Heart}
                      label="Xăm mình, châm cứu, phẫu thuật"
                      value={healthData.hasTattooAcupuncture}
                      isBoolean={true}
                    />
                    
                    <InfoRow
                      icon={Heart}
                      label="Tiêm vaccine gần đây"
                      value={healthData.hasRecentVaccine}
                      isBoolean={true}
                    />
                    
                    <InfoRow
                      icon={Heart}
                      label="Đi ra nước ngoài"
                      value={healthData.hasTravelAbroad}
                      isBoolean={true}
                    />
                    
                    <InfoRow
                      icon={Heart}
                      label="Hành vi tình dục không an toàn"
                      value={healthData.hasUnsafeSex}
                      isBoolean={true}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>ℹ️</span>
                    <span>Thông tin khác</span>
                  </h4>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <InfoRow
                      icon={Heart}
                      label="Lần đầu hiến máu"
                      value={healthData.isFirstBlood}
                      isBoolean={true}
                    />
                  </div>

                  {(healthData.isPregnantOrBreastfeeding !== null || healthData.isMenstruating !== null) && (
                    <>
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2 pt-4">
                        <span>👩</span>
                        <span>Dành cho phụ nữ</span>
                      </h4>
                      
                      <div className="bg-pink-50 rounded-lg p-4 space-y-3">
                        {healthData.isPregnantOrBreastfeeding !== null && (
                          <InfoRow
                            icon={Heart}
                            label="Mang thai, cho con bú"
                            value={healthData.isPregnantOrBreastfeeding}
                            isBoolean={true}
                          />
                        )}
                        
                        {healthData.isMenstruating !== null && (
                          <InfoRow
                            icon={Heart}
                            label="Đang trong kỳ kinh nguyệt"
                            value={healthData.isMenstruating}
                            isBoolean={true}
                          />
                        )}
                      </div>
                    </>
                  )}

                  {healthData.createdAt && (
                    <>
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2 pt-4">
                        <span>📅</span>
                        <span>Thông tin hệ thống</span>
                      </h4>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <InfoRow
                          icon={FileText}
                          label="Thời gian khai báo"
                          value={formatVietnamTime(healthData.createdAt)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <p>Thông tin này đã được sử dụng để đánh giá tình trạng sức khỏe của bạn. Nếu có thay đổi về tình trạng sức khỏe, vui lòng thông báo với nhân viên y tế khi đến hiến máu.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông tin khai báo</h3>
              <p className="text-gray-500">Không tìm thấy thông tin khai báo y tế cho lịch hẹn này.</p>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDeclarationModal;