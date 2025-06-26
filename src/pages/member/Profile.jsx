import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Droplets, Calendar, Edit3, Save, X, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const BLOOD_TYPES = {
  O_NEGATIVE: 0,
  O_POSITIVE: 1,
  A_NEGATIVE: 2,
  A_POSITIVE: 3,
  B_NEGATIVE: 4,
  B_POSITIVE: 5,
  AB_NEGATIVE: 6,
  AB_POSITIVE: 7,
};

const BLOOD_TYPE_LABELS = {
  0: 'O-',
  1: 'O+',
  2: 'A-',
  3: 'A+',
  4: 'B-',
  5: 'B+',
  6: 'AB-',
  7: 'AB+',
};

const GENDER_OPTIONS = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác'
};

const VIETNAM_PROVINCES = [
  { id: 1, name: 'Hồ Chí Minh' },
  { id: 2, name: 'Hà Nội' },
  { id: 3, name: 'Đà Nẵng' },
  { id: 4, name: 'Cần Thơ' },
  { id: 5, name: 'Hải Phòng' },
];

const MemberProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [member, setMember] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phoneNumber: '+84 123 456 789',
    address: '123 Lê Lợi, Quận 1, Hồ Chí Minh',
    gender: 'MALE',
    bloodTypeId: 3,
    dateOfBirth: '1990-05-15',
    latitude: 10.7769,
    longitude: 106.7009,
    lastDonation: '2024-02-15',
    totalDonations: 8,
    nextEligibleDate: '2024-06-15',
    donationHistory: [
      { date: '2024-02-15', location: 'Ngân hàng máu trung ương', type: 'Máu toàn phần', status: 'Hoàn thành' },
      { date: '2023-10-15', location: 'Xe lưu động - Quận 3', type: 'Huyết tương', status: 'Hoàn thành' },
      { date: '2023-06-15', location: 'Ngân hàng máu trung ương', type: 'Máu toàn phần', status: 'Hoàn thành' },
    ],
  });

  const [editForm, setEditForm] = useState({});
  const [selectedProvince, setSelectedProvince] = useState('');

  useEffect(() => {
    if (isEditing) {
      setEditForm({ ...member });
    }
  }, [isEditing, member]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleSave = () => {
    setMember({ ...member, ...editForm });
    setIsEditing(false);
    toast.success('Cập nhật thông tin thành công!');
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

  const InfoItem = ({ icon: Icon, label, value, isEditing = false, field, type = 'text' }) => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="p-3 bg-red-50 rounded-full">
        <Icon className="w-5 h-5 text-red-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        {isEditing ? (
          <div>
            {type === 'select' && field === 'bloodTypeId' ? (
              <select
                value={editForm[field] || ''}
                onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {Object.entries(BLOOD_TYPE_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            ) : type === 'select' && field === 'gender' ? (
              <select
                value={editForm[field] || ''}
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
          <p className="text-gray-800 font-medium">{value}</p>
        )}
      </div>
    </div>
  );

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
              <h1 className="text-2xl font-bold text-gray-800">{member.fullName}</h1>
              <p className="text-gray-500">Mã thành viên: #123456</p>
              <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                  Nhóm máu: {BLOOD_TYPE_LABELS[member.bloodTypeId]}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                  Người hiến tích cực
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
        />
        <InfoItem 
          icon={Phone} 
          label="Số điện thoại" 
          value={member.phoneNumber}
          isEditing={isEditing}
          field="phoneNumber"
          type="tel"
        />
        <InfoItem 
          icon={Users} 
          label="Giới tính" 
          value={GENDER_OPTIONS[member.gender]}
          isEditing={isEditing}
          field="gender"
          type="select"
        />
        <InfoItem 
          icon={Droplets} 
          label="Nhóm máu" 
          value={BLOOD_TYPE_LABELS[member.bloodTypeId]}
          isEditing={isEditing}
          field="bloodTypeId"
          type="select"
        />
        <InfoItem 
          icon={Calendar} 
          label="Ngày sinh" 
          value={new Date(member.dateOfBirth).toLocaleDateString('vi-VN')}
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
                      onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={editForm.longitude || ''}
                      onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
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
                  {member.latitude?.toFixed(6)}, {member.longitude?.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-50 rounded-full">
              <Droplets className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số lần hiến</p>
              <p className="text-gray-800 font-medium">{member.totalDonations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-full">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lần hiến cuối</p>
              <p className="text-gray-800 font-medium">{new Date(member.lastDonation).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Có thể hiến tiếp</p>
              <p className="text-gray-800 font-medium">{new Date(member.nextEligibleDate).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch sử hiến máu</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {member.donationHistory.map((donation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donation.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;