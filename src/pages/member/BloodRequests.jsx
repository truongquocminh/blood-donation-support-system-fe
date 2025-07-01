import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, FlaskConical, User, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateBloodRequestModal from '../../components/bloodRequest/CreateBloodRequestModal';
import { getBloodRequests, allocateBloodRequest, createBloodRequest } from '../../services/bloodRequestService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getBloodComponents } from '../../services/bloodComponentService';
import { getUserById } from '../../services/userService';
import { URGENCY_LEVELS, BLOOD_REQUEST_STATUS } from '../../utils/constants';

const BloodRequests = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [allocatingRequests, setAllocatingRequests] = useState(new Set());

  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadBloodRequests();
    loadBloodTypes();
    loadBloodComponents();
  }, [currentPage]);

  const loadBloodRequests = async () => {
    try {
      setLoading(true);
      const response = await getBloodRequests(currentPage, pageSize);

      if (response.status === 200 && response.data.data.content) {
        const sortedRequests = response.data.data.content.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBloodRequests(sortedRequests);
        setTotalElements(response.data.data.page.totalElements);
        setTotalPages(response.data.data.page.totalPages);

        const userIds = [...new Set(sortedRequests.map(r => r.createdBy))];
        await loadUsersData(userIds);
      } else {
        setBloodRequests([]);
        toast.error('Không thể tải danh sách yêu cầu máu');
      }
    } catch (error) {
      console.error('Error loading blood requests:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
      setBloodRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBloodTypes = async () => {
    try {
      const response = await getBloodTypes(0, 100);
      if (response.status === 200 && response.data.data.content) {
        setBloodTypes(response.data.data.content);
      }
    } catch (error) {
      console.error('Error loading blood types:', error);
    }
  };

  const loadBloodComponents = async () => {
    try {
      const response = await getBloodComponents(0, 100);
      if (response.status === 200 && response.data.data.content) {
        setBloodComponents(response.data.data.content);
      }
    } catch (error) {
      console.error('Error loading blood components:', error);
    }
  };

  const loadUsersData = async (userIds) => {
    try {
      const userPromises = userIds.map(userId => getUserById(userId));
      const responses = await Promise.all(userPromises);

      const usersMap = {};
      responses.forEach((response, index) => {
        if (response.status === 200) {
          usersMap[userIds[index]] = response.data.data;
        }
      });

      setUsers(usersMap);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const getBloodTypeName = (typeId) => {
    const type = bloodTypes.find(t => t.id === typeId);
    return type ? type.typeName : `Type ${typeId}`;
  };

  const getComponentName = (componentId) => {
    const component = bloodComponents.find(c => c.componentId === componentId);
    return component ? component.componentName : `Component ${componentId}`;
  };

  const getUserInfo = (userId) => {
    const user = users[userId];
    return user ? {
      name: user.fullName,
      email: user.email,
      role: user.role
    } : {
      name: `User ${userId}`,
      email: 'N/A',
      role: 'N/A'
    };
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      [URGENCY_LEVELS.LOW]: 'bg-blue-100 text-blue-800 border-blue-200',
      [URGENCY_LEVELS.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [URGENCY_LEVELS.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
      [URGENCY_LEVELS.CRITICAL]: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[urgency] || colors[URGENCY_LEVELS.LOW];
  };

  const getStatusColor = (status) => {
    const colors = {
      [BLOOD_REQUEST_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [BLOOD_REQUEST_STATUS.ALLOCATED]: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors[BLOOD_REQUEST_STATUS.PENDING];
  };

  const getStatusLabel = (status) => {
    const labels = {
      [BLOOD_REQUEST_STATUS.PENDING]: 'Chờ xử lý',
      [BLOOD_REQUEST_STATUS.ALLOCATED]: 'Đã trích xuất'
    };
    return labels[status] || status;
  };

  const handleAllocateRequest = async (requestId) => {
    try {
      setAllocatingRequests(prev => new Set([...prev, requestId]));

      const response = await allocateBloodRequest(requestId);

      if (response.status === 200) {
        setBloodRequests(prev =>
          prev.map(request =>
            request.requestId === requestId
              ? { ...request, status: BLOOD_REQUEST_STATUS.ALLOCATED }
              : request
          )
        );
        toast.success('Trích xuất máu thành công');
      } else {
        if (response.status === 404 && response.message === 'No inventory available for this blood request') {
          toast.error('Trong kho hiện không còn loại máu cùng với thành phần máu phù hợp');
        } else {
          toast.error('Không thể trích xuất máu. Vui lòng thử lại.');
        }
      }
    } catch (error) {
      console.error('Error allocating blood request:', error);

      if (error.response?.status === 404 &&
        error.response?.data?.message === 'No inventory available for this blood request') {
        toast.error('Trong kho hiện không còn loại máu cùng với thành phần máu phù hợp');
      } else {
        toast.error('Có lỗi xảy ra khi trích xuất máu');
      }
    } finally {
      setAllocatingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    loadBloodRequests();
  };

  const handleCreateRequest = async (formData) => {
    try {
      setIsCreatingRequest(true);
      const response = await createBloodRequest(formData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Tạo yêu cầu máu thành công');
        setIsCreateModalOpen(false);
        loadBloodRequests();
      } else {
        toast.error('Không thể tạo yêu cầu máu. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating blood request:', error);
      toast.error('Có lỗi xảy ra khi tạo yêu cầu máu');
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const filteredRequests = bloodRequests.filter(request => {
    const userInfo = getUserInfo(request.createdBy);

    const matchesSearch = searchTerm === '' ||
      userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestId.toString().includes(searchTerm);

    const matchesStatus = filterStatus === '' || request.status === filterStatus;
    const matchesUrgency = filterUrgency === '' || request.urgencyLevel === filterUrgency;
    const matchesBloodType = filterBloodType === '' || request.bloodTypeId.toString() === filterBloodType;

    return matchesSearch && matchesStatus && matchesUrgency && matchesBloodType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yêu cầu máu</h1>
          <p className="text-gray-600">Quản lý và xử lý các yêu cầu máu từ bệnh viện</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo yêu cầu máu</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên người yêu cầu hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value={BLOOD_REQUEST_STATUS.PENDING}>Chờ xử lý</option>
                <option value={BLOOD_REQUEST_STATUS.ALLOCATED}>Đã trích xuất</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức độ khẩn cấp
              </label>
              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tất cả mức độ</option>
                <option value={URGENCY_LEVELS.LOW}>Thấp</option>
                <option value={URGENCY_LEVELS.MEDIUM}>Trung bình</option>
                <option value={URGENCY_LEVELS.HIGH}>Cao</option>
                <option value={URGENCY_LEVELS.CRITICAL}>Khẩn cấp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm máu
              </label>
              <select
                value={filterBloodType}
                onChange={(e) => setFilterBloodType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tất cả nhóm máu</option>
                {bloodTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('');
                  setFilterUrgency('');
                  setFilterBloodType('');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng yêu cầu</p>
              <p className="text-2xl font-bold text-blue-600">{filteredRequests.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FlaskConical className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredRequests.filter(r => r.status === BLOOD_REQUEST_STATUS.PENDING).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Đã trích xuất</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredRequests.filter(r => r.status === BLOOD_REQUEST_STATUS.ALLOCATED).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <FlaskConical className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Khẩn cấp</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredRequests.filter(r => r.urgencyLevel === URGENCY_LEVELS.CRITICAL).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách yêu cầu máu ({filteredRequests.length})
          </h3>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có yêu cầu nào</h3>
            <p className="text-gray-500">Chưa có yêu cầu máu nào phù hợp với bộ lọc</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID & Người yêu cầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin máu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mức độ & Số lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => {
                  const userInfo = getUserInfo(request.createdBy);
                  const isAllocating = allocatingRequests.has(request.requestId);

                  return (
                    <tr key={request.requestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              #{request.requestId}
                            </div>
                            <div className="text-sm text-gray-900 font-medium">
                              {userInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {userInfo.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              {userInfo.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {getBloodTypeName(request.bloodTypeId)}
                          </div>
                          <div className="text-gray-500">
                            {getComponentName(request.componentId)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgencyLevel)}`}>
                            {request.urgencyLevel}
                          </span>
                          <div className="text-sm text-gray-900">
                            Số lượng: {request.quantity}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleTimeString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateBloodRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRequest}
        bloodTypes={bloodTypes}
        isLoading={isCreatingRequest}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{currentPage * pageSize + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * pageSize, totalElements)}
                </span> trong{' '}
                <span className="font-medium">{totalElements}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === currentPage
                      ? 'z-10 bg-red-50 border-red-500 text-red-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequests;