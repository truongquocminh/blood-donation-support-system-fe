import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, Phone, Mail, User, Calendar, Droplets, Loader2, Users, AlertCircle } from 'lucide-react';
import { searchNearbyStaff } from '../../services/distanceSearchService';
import { getUserById } from '../../services/userService';
import toast from 'react-hot-toast';
import HandleLoading from '../common/HandleLoading';

const DonorSearchModal = ({
  isOpen,
  onClose,
  bloodTypes
}) => {
  const [searchData, setSearchData] = useState({
    bloodTypeId: '',
    latitude: '',
    longitude: ''
  });
  const [donors, setDonors] = useState([]);
  const [donorDetails, setDonorDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchData({
        bloodTypeId: '',
        latitude: '',
        longitude: ''
      });
      setDonors([]);
      setDonorDetails({});
      setErrors({});
      setHasSearched(false);
      getCurrentLocation();
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Lỗi khi lấy vị trí:', error);
          toast.error('Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công.');
        }
      );
    } else {
      toast.error('Trình duyệt không hỗ trợ định vị. Vui lòng nhập tọa độ thủ công.');
    }
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!searchData.bloodTypeId) {
      newErrors.bloodTypeId = 'Vui lòng chọn nhóm máu';
    }

    if (!searchData.latitude || isNaN(parseFloat(searchData.latitude))) {
      newErrors.latitude = 'Vui lòng nhập vĩ độ hợp lệ';
    }

    if (!searchData.longitude || isNaN(parseFloat(searchData.longitude))) {
      newErrors.longitude = 'Vui lòng nhập kinh độ hợp lệ';
    }

    return newErrors;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);

      const payload = {
        bloodTypeId: parseInt(searchData.bloodTypeId),
        latitude: parseFloat(searchData.latitude),
        longitude: parseFloat(searchData.longitude)
      };

      const response = await searchNearbyStaff(payload);

      if (response.status === 200 && response.data.data) {
        setDonors(response.data.data);
        if (response.data.data.length === 0) {
          toast.info('Không tìm thấy người hiến máu phù hợp trong khu vực');
        } else {
          toast.success(`Tìm thấy ${response.data.data.length} người hiến máu phù hợp`);
        }
      } else {
        setDonors([]);
        toast.error('Không thể tìm kiếm người hiến máu');
      }

    } catch (error) {
      console.error('Lỗi khi tìm kiếm người hiến máu:', error);
      setDonors([]);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Dữ liệu tìm kiếm không hợp lệ');
      } else {
        // toast.error('Lỗi khi tìm kiếm người hiến máu');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDonorDetails = async (userId) => {
    if (donorDetails[userId]) return; 

    try {
      setDetailLoading(prev => ({ ...prev, [userId]: true }));
      
      const response = await getUserById(userId);
      
      if (response.status === 200 && response.data.data) {
        setDonorDetails(prev => ({
          ...prev,
          [userId]: response.data.data
        }));
      }
    } catch (error) {
      console.error(`Lỗi khi tải thông tin người dùng ${userId}:`, error);
      toast.error('Không thể tải thông tin chi tiết');
    } finally {
      setDetailLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getBloodTypeName = (bloodTypeId) => {
    const bloodType = bloodTypes.find(type => type.id === bloodTypeId);
    return bloodType ? bloodType.typeName : 'N/A';
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 'MALE': return 'Nam';
      case 'FEMALE': return 'Nữ';
      default: return 'N/A';
    }
  };

  const closeModal = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {loading && <HandleLoading />}

      <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tìm kiếm người hiến máu phù hợp
                </h3>
                <p className="text-sm text-gray-600">
                  Tìm kiếm người hiến máu theo nhóm máu và khu vực
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-700">
                    <p className="font-medium mb-2">Hướng dẫn tìm kiếm:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Chọn nhóm máu cần tìm kiếm</li>
                      <li>• Hệ thống sẽ tự động lấy vị trí hiện tại của bạn</li>
                      <li>• Có thể nhập tọa độ thủ công nếu cần thiết</li>
                      <li>• Kết quả sẽ được sắp xếp theo khoảng cách gần nhất</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhóm máu cần tìm <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={searchData.bloodTypeId}
                    onChange={(e) => handleInputChange('bloodTypeId', e.target.value)}
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.bloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Chọn nhóm máu</option>
                    {bloodTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.typeName}
                      </option>
                    ))}
                  </select>
                  {errors.bloodTypeId && <p className="text-sm text-red-500 mt-1">{errors.bloodTypeId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vĩ độ (Latitude) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      step="any"
                      value={searchData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      disabled={loading}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="VD: 10.762622"
                    />
                  </div>
                  {errors.latitude && <p className="text-sm text-red-500 mt-1">{errors.latitude}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh độ (Longitude) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      step="any"
                      value={searchData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      disabled={loading}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="VD: 106.660172"
                    />
                  </div>
                  {errors.longitude && <p className="text-sm text-red-500 mt-1">{errors.longitude}</p>}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tìm kiếm...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Tìm kiếm người hiến máu</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {hasSearched && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    Kết quả tìm kiếm ({donors.length} người)
                  </h4>
                </div>

                {donors.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Không tìm thấy người hiến máu</p>
                    <p className="text-sm">Thử thay đổi nhóm máu hoặc mở rộng khu vực tìm kiếm</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {donors.map((donor) => {
                      const details = donorDetails[donor.userId];
                      const isLoadingDetail = detailLoading[donor.userId];

                      return (
                        <div key={donor.userId} className="p-6 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-full">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h5 className="text-lg font-medium text-gray-900">{donor.fullName}</h5>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Mail className="w-3 h-3" />
                                      <span>{donor.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{formatDistance(donor.distanceKM)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {details && (
                                <div className="ml-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                  <div className="bg-white p-3 rounded border">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Phone className="w-3 h-3 text-gray-400" />
                                      <span className="text-xs font-medium text-gray-600">Điện thoại</span>
                                    </div>
                                    <p className="text-sm font-medium">{details.phoneNumber || 'N/A'}</p>
                                  </div>

                                  <div className="bg-white p-3 rounded border">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Droplets className="w-3 h-3 text-red-400" />
                                      <span className="text-xs font-medium text-gray-600">Nhóm máu</span>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      {getBloodTypeName(details.bloodTypeId)}
                                    </span>
                                  </div>

                                  <div className="bg-white p-3 rounded border">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Calendar className="w-3 h-3 text-green-400" />
                                      <span className="text-xs font-medium text-gray-600">Tuổi</span>
                                    </div>
                                    <p className="text-sm font-medium">{calculateAge(details.dateOfBirth)} tuổi</p>
                                  </div>

                                  <div className="bg-white p-3 rounded border">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <User className="w-3 h-3 text-purple-400" />
                                      <span className="text-xs font-medium text-gray-600">Giới tính</span>
                                    </div>
                                    <p className="text-sm font-medium">{getGenderText(details.gender)}</p>
                                  </div>

                                  {details.address && (
                                    <div className="bg-white p-3 rounded border md:col-span-2 lg:col-span-4">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <MapPin className="w-3 h-3 text-orange-400" />
                                        <span className="text-xs font-medium text-gray-600">Địa chỉ</span>
                                      </div>
                                      <p className="text-sm">{details.address}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="ml-4">
                              {!details && !isLoadingDetail && (
                                <button
                                  onClick={() => fetchDonorDetails(donor.userId)}
                                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                  Xem chi tiết
                                </button>
                              )}
                              {isLoadingDetail && (
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span className="text-sm">Đang tải...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={closeModal}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonorSearchModal;