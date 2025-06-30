import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Droplets, Calendar, Edit3, Save, X, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getCurrentUser, updateUser } from '../../services/userService';
import { getBloodTypes } from '../../services/bloodTypeService';

const GENDER_OPTIONS = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác'
};

const MemberProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [member, setMember] = useState({
    id: null,
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: null,
    bloodTypeId: null,
    dateOfBirth: '',
    latitude: null,
    longitude: null,
    role: '',
    status: true,
  });
  const [bloodTypes, setBloodTypes] = useState([]);

  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadUserData();
    loadBloodTypes();
  }, []);

  useEffect(() => {
    if (isEditing) {
      setEditForm({
        fullName: member.fullName || '',
        email: member.email || '',
        phoneNumber: member.phoneNumber || '',
        address: member.address || '',
        gender: member.gender || 'MALE',
        bloodTypeId: member.bloodTypeId !== null ? member.bloodTypeId : 0,
        dateOfBirth: member.dateOfBirth || '',
        latitude: member.latitude || 0,
        longitude: member.longitude || 0,
      });
    }
  }, [isEditing, member]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();

      if (response.status === 200 && response.data.data) {
        const userData = response.data.data;
        setMember(prev => ({
          ...prev,
          id: userData.id,
          fullName: userData.fullName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          gender: userData.gender,
          bloodTypeId: userData.bloodType !== null ? userData.bloodType : null,
          dateOfBirth: userData.dateOfBirth || '',
          latitude: userData.latitude,
          longitude: userData.longitude,
          role: userData.role,
          status: userData.status,
        }));
      } else {
        toast.error('Không thể tải thông tin người dùng');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const loadBloodTypes = async () => {
    try {
      const res = await getBloodTypes();
      if (res.status === 200 && res.data.data?.content) {
        setBloodTypes(res.data.data.content);
      } else {
        toast.error("Không thể tải nhóm máu");
      }
    } catch (err) {
      console.error("Lỗi khi tải nhóm máu:", err);
      toast.error("Lỗi khi tải danh sách nhóm máu");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleSave = async () => {
    try {
      setUpdating(true);

      const updateData = {
        fullName: editForm.fullName,
        phoneNumber: editForm.phoneNumber,
        address: editForm.address,
        gender: editForm.gender,
        bloodTypeId: parseInt(editForm.bloodTypeId),
        dateOfBirth: editForm.dateOfBirth,
        latitude: parseFloat(editForm.latitude),
        longitude: parseFloat(editForm.longitude),
      };

      const response = await updateUser(member.id, updateData);

      if (response.status === 200) {
        setMember(prev => ({
          ...prev,
          ...updateData,
          bloodTypeId: updateData.bloodTypeId,
        }));
        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công!');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Đang lấy vị trí hiện tại...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleInputChange('latitude', latitude);
          handleInputChange('longitude', longitude);
          toast.dismiss();
          toast.success(`Đã cập nhật vị trí: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          toast.dismiss();
          toast.error('Không thể lấy vị trí hiện tại');
        }
      );
    } else {
      toast.error('Trình duyệt không hỗ trợ định vị');
    }
  };

  const InfoItem = ({ icon: Icon, label, value, isEditing = false, field, type = 'text', disabled = false }) => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="p-3 bg-red-50 rounded-full">
        <Icon className="w-5 h-5 text-red-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        {isEditing && !disabled ? (
          <div>
            {type === 'select' && field === 'bloodTypeId' ? (
              <select
                value={editForm[field] || 0}
                onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {bloodTypes.map((bt) => (
                  <option key={bt.id} value={bt.id}>
                    {bt.typeName}
                  </option>
                ))}
              </select>
            ) : type === 'select' && field === 'gender' ? (
              <select
                value={editForm[field] || 'MALE'}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {Object.entries(GENDER_OPTIONS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            ) : type === 'date' ? (
              <input
                type="date"
                value={editForm[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            ) : type === 'textarea' ? (
              <textarea
                value={editForm[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="2"
              />
            ) : (
              <input
                type={type}
                value={editForm[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            )}
          </div>
        ) : (
          <p className="text-gray-800 font-medium">{value || 'Chưa cập nhật'}</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{member.fullName || 'Chưa cập nhật'}</h1>
              <p className="text-gray-500">Mã thành viên: #{member.id}</p>
              <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                  Nhóm máu: {bloodTypes.find(bt => bt.id === member.bloodTypeId)?.typeName || 'Chưa cập nhật'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                  {member.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={updating}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{updating ? 'Đang lưu...' : 'Lưu'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <InfoItem
          icon={User}
          label="Họ và tên"
          value={member.fullName}
          isEditing={isEditing}
          field="fullName"
        />
        <InfoItem
          icon={Mail}
          label="Email"
          value={member.email}
          isEditing={isEditing}
          field="email"
          type="email"
          disabled={true}
        />
        <InfoItem
          icon={Phone}
          label="Số điện thoại"
          value={member.phoneNumber}
          isEditing={isEditing}
          field="phoneNumber"
          type="text"
        />
        <InfoItem
          icon={Users}
          label="Giới tính"
          value={member.gender ? GENDER_OPTIONS[member.gender] : 'Chưa cập nhật'}
          isEditing={isEditing}
          field="gender"
          type="select"
        />
        <InfoItem
          icon={Droplets}
          label="Nhóm máu"
          value={bloodTypes.find(bt => bt.id === member.bloodTypeId)?.typeName || 'Chưa cập nhật'}
          isEditing={isEditing}
          field="bloodTypeId"
          type="select"
        />
        <InfoItem
          icon={Calendar}
          label="Ngày sinh"
          value={member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
          isEditing={isEditing}
          field="dateOfBirth"
          type="date"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InfoItem
          icon={MapPin}
          label="Địa chỉ"
          value={member.address}
          isEditing={isEditing}
          field="address"
          type="textarea"
        />
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-50 rounded-full">
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Tọa độ</p>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={editForm.latitude || ''}
                      onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || 0)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={editForm.longitude || ''}
                      onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || 0)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <button
                    onClick={getCurrentLocation}
                    className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    Lấy vị trí hiện tại
                  </button>
                </div>
              ) : (
                <p className="text-gray-800 font-medium">
                  {member.latitude !== null && member.longitude !== null
                    ? `${member.latitude?.toFixed(6)}, ${member.longitude?.toFixed(6)}`
                    : 'Chưa cập nhật'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;