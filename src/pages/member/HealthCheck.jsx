import React, { useState, useEffect } from 'react';
import {
    Heart,
    Activity,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
    Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getUserHealthChecks } from '../../services/healthCheckService';
import { createBloodDonation, getBloodDonations } from '../../services/bloodDonationService';
import { getBloodTypes } from '../../services/bloodTypeService';
import DonationFormModal from '../../components/donation/DonationFormModal';

const HealthChecks = () => {
    const { user } = useAuth();
    const [allHealthChecks, setAllHealthChecks] = useState([]);
    const [donations, setDonations] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [selectedHealthCheck, setSelectedHealthCheck] = useState(null);
    const [filters, setFilters] = useState({
        isEligible: '',
        from: '',
        to: ''
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    });

    const fetchHealthChecks = async (page = 0) => {
        try {
            setLoading(true);
            const response = await getUserHealthChecks(user.id, page, pagination.size);
            if (response.status === 200) {
                setAllHealthChecks(response.data.data.content);
                setPagination({
                    page: response.data.data.page.number,
                    size: response.data.data.page.size,
                    totalElements: response.data.data.page.totalElements,
                    totalPages: response.data.data.page.totalPages
                });
            } else {
                toast.error('Không thể tải danh sách kiểm tra sức khỏe');
            }
        } catch (error) {
            console.error('Error fetching health checks:', error);
            toast.error('Có lỗi xảy ra khi tải danh sách kiểm tra sức khỏe');
        } finally {
            setLoading(false);
        }
    };

    const fetchBloodDonations = async () => {
        try {
            const response = await getBloodDonations(0, 100);
            if (response.status === 200 && response.data?.data?.content) {
                const allDonations = response.data.data.content;

                const userDonations = allDonations.filter(donation => {
                    return donation.user === user.id || donation.user?.id === user.id;
                });

                setDonations(userDonations);
            }
        } catch (error) {
            console.error('Error fetching blood donations:', error);
        }
    };


    useEffect(() => {
        if (user?.id) {
            fetchHealthChecks();
            fetchBloodDonations();
            loadBloodTypes();
        }
    }, [user?.id]);

    const loadBloodTypes = async () => {
        try {
            const response = await getBloodTypes();
            if (response.status === 200 && response.data.data?.content) {
                setBloodTypes(response.data.data.content);
            }
        } catch (error) {
            console.error("Error loading blood types:", error);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilters({ isEligible: '', from: '', to: '' });
    };

    const getFilteredHealthChecks = () => {
        return allHealthChecks.filter(healthCheck => {
            if (filters.isEligible !== '') {
                const isEligibleFilter = filters.isEligible === 'true';
                if (healthCheck.isEligible !== isEligibleFilter) {
                    return false;
                }
            }

            const checkDate = new Date(healthCheck.checkedAt);
            checkDate.setHours(0, 0, 0, 0);

            if (filters.from) {
                const fromDate = new Date(filters.from);
                fromDate.setHours(0, 0, 0, 0);
                if (checkDate < fromDate) {
                    return false;
                }
            }

            if (filters.to) {
                const toDate = new Date(filters.to);
                toDate.setHours(23, 59, 59, 999);
                if (checkDate > toDate) {
                    return false;
                }
            }

            return true;
        });
    };

    const filteredHealthChecks = getFilteredHealthChecks();

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            fetchHealthChecks(newPage);
        }
    };

    const getEligibilityBadge = (isEligible) => {
        if (isEligible) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đủ điều kiện
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    <XCircle className="w-3 h-3 mr-1" />
                    Không đủ điều kiện
                </span>
            );
        }
    };

    const getBloodPressureStatus = (bloodPressure) => {
        if (!bloodPressure || bloodPressure === 'string') return 'Chưa xác định';

        try {
            const [systolic, diastolic] = bloodPressure.split('/').map(Number);

            if (systolic >= 140 || diastolic >= 90) {
                return { status: 'Cao', color: 'text-red-600' };
            } else if (systolic >= 120 || diastolic >= 80) {
                return { status: 'Hơi cao', color: 'text-yellow-600' };
            } else {
                return { status: 'Bình thường', color: 'text-green-600' };
            }
        } catch {
            return { status: 'Không xác định', color: 'text-gray-600' };
        }
    };

    const getPulseStatus = (pulse) => {
        if (pulse >= 60 && pulse <= 100) {
            return { status: 'Bình thường', color: 'text-green-600' };
        } else if (pulse < 60) {
            return { status: 'Thấp', color: 'text-blue-600' };
        } else {
            return { status: 'Cao', color: 'text-red-600' };
        }
    };

    const handleDonationClick = (healthCheck) => {
        setSelectedHealthCheck(healthCheck);
        setIsDonationModalOpen(true);
    };

    const handleDonationSubmit = async (donationData) => {
        try {
            const payload = {
                user: user.id,
                donationDate: donationData.donationDate,
                bloodType: donationData.bloodType,
                bloodComponent: donationData.bloodComponent,
                volumeMl: donationData.volumeMl,
                status: "PENDING",
                healthCheck: selectedHealthCheck.healthCheckId
            };

            const response = await createBloodDonation(payload);

            if (response.status === 200 || response.status === 201) {
                toast.success('Đăng ký hiến máu thành công!');
                setIsDonationModalOpen(false);
                setSelectedHealthCheck(null);
            } else {
                toast.error(response.message || 'Không thể đăng ký hiến máu');
            }
        } catch (error) {
            if (error.status === 409) {
                toast.error("Mỗi lần kiểm tra sức khỏe chỉ được đăng ký hiến máu 1 lần!")
            }
            console.error('Error creating blood donation:', error);
            toast.error('Có lỗi xảy ra khi đăng ký hiến máu');
        }
    };

    const totalChecks = allHealthChecks.length;
    const eligibleChecks = allHealthChecks.filter(hc => hc.isEligible).length;
    const recentCheck = allHealthChecks.sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))[0];
    const donatedHealthCheckIds = new Set(donations.map(d => d.healthCheck));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kiểm tra sức khỏe</h1>
                    <p className="text-gray-600">Xem lịch sử và kết quả kiểm tra sức khỏe của bạn</p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Lọc</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng số lần kiểm tra</p>
                            <p className="text-2xl font-bold text-blue-600">{totalChecks}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-100">
                            <Heart className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Đủ điều kiện hiến máu</p>
                            <p className="text-2xl font-bold text-green-600">{eligibleChecks}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {totalChecks > 0 ? Math.round((eligibleChecks / totalChecks) * 100) : 0}% tổng số lần
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-100">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Lần kiểm tra gần nhất</p>
                            <p className="text-lg font-bold text-purple-600">
                                {recentCheck ? new Date(recentCheck.checkedAt).toLocaleDateString('vi-VN') : 'Chưa có'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {recentCheck ? (recentCheck.isEligible ? 'Đủ điều kiện' : 'Không đủ điều kiện') : ''}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-100">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kết quả kiểm tra
                            </label>
                            <select
                                value={filters.isEligible}
                                onChange={(e) => handleFilterChange('isEligible', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="">Tất cả kết quả</option>
                                <option value="true">Đủ điều kiện</option>
                                <option value="false">Không đủ điều kiện</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                value={filters.from}
                                onChange={(e) => handleFilterChange('from', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                value={filters.to}
                                onChange={(e) => handleFilterChange('to', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                min={filters.from}
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                title="Xóa bộ lọc"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {(filters.isEligible || filters.from || filters.to) && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center flex-wrap gap-2">
                                <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>

                                {filters.isEligible && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Kết quả: {filters.isEligible === 'true' ? 'Đủ điều kiện' : 'Không đủ điều kiện'}
                                        <button
                                            onClick={() => handleFilterChange('isEligible', '')}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}

                                {filters.from && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Từ: {new Date(filters.from).toLocaleDateString('vi-VN')}
                                        <button
                                            onClick={() => handleFilterChange('from', '')}
                                            className="ml-1 text-green-600 hover:text-green-800"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}

                                {filters.to && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        Đến: {new Date(filters.to).toLocaleDateString('vi-VN')}
                                        <button
                                            onClick={() => handleFilterChange('to', '')}
                                            className="ml-1 text-purple-600 hover:text-purple-800"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}

                                <span className="text-xs text-gray-500">
                                    ({filteredHealthChecks.length} kết quả)
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Lịch sử kiểm tra ({filteredHealthChecks.length})
                    </h3>
                </div>

                {filteredHealthChecks.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử kiểm tra</h3>
                        <p className="text-gray-500">Hãy đặt lịch hẹn để kiểm tra sức khỏe lần đầu!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredHealthChecks.map((healthCheck) => (
                            <div key={healthCheck.healthCheckId} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                Kiểm tra sức khỏe #{healthCheck.healthCheckId}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(healthCheck.checkedAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                    {getEligibilityBadge(healthCheck.isEligible)}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Activity className="w-5 h-5 text-red-500" />
                                        <div>
                                            <p className="text-xs text-gray-600">Nhịp tim</p>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium">{healthCheck.pulse} bpm</p>
                                                <span className={`text-xs ${getPulseStatus(healthCheck.pulse).color}`}>
                                                    {getPulseStatus(healthCheck.pulse).status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Heart className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-gray-600">Huyết áp</p>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium">
                                                    {healthCheck.bloodPressure && healthCheck.bloodPressure !== 'string'
                                                        ? healthCheck.bloodPressure
                                                        : 'Chưa đo'}
                                                </p>
                                                {healthCheck.bloodPressure && healthCheck.bloodPressure !== 'string' && (
                                                    <span className={`text-xs ${getBloodPressureStatus(healthCheck.bloodPressure).color}`}>
                                                        {getBloodPressureStatus(healthCheck.bloodPressure).status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {healthCheck.bloodTypeName && (
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">B</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Nhóm máu</p>
                                                <p className="text-sm font-medium">{healthCheck.bloodTypeName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={`p-4 rounded-lg ${healthCheck.isEligible
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            {healthCheck.isEligible ? (
                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <h5 className={`text-sm font-medium mb-1 ${healthCheck.isEligible ? 'text-green-800' : 'text-red-800'
                                                    }`}>
                                                    Kết quả kiểm tra
                                                </h5>
                                                <p className={`text-sm ${healthCheck.isEligible ? 'text-green-700' : 'text-red-700'
                                                    }`}>
                                                    {healthCheck.resultSummary && healthCheck.resultSummary !== 'string'
                                                        ? healthCheck.resultSummary
                                                        : 'Chưa có kết quả chi tiết'}
                                                </p>

                                                {!healthCheck.isEligible && healthCheck.ineligibleReason && healthCheck.ineligibleReason !== 'string' && (
                                                    <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                                                        <strong>Lý do không đủ điều kiện:</strong> {healthCheck.ineligibleReason}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                       
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages - 1}
                            className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Hiển thị{' '}
                                <span className="font-medium">{pagination.page * pagination.size + 1}</span>
                                {' '}-{' '}
                                <span className="font-medium">
                                    {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}
                                </span>
                                {' '}trong{' '}
                                <span className="font-medium">{pagination.totalElements}</span>
                                {' '}kết quả
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 0}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                {Array.from({ length: pagination.totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${i === pagination.page
                                            ? 'z-10 bg-red-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages - 1}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <DonationFormModal
                isOpen={isDonationModalOpen}
                onClose={() => {
                    setIsDonationModalOpen(false);
                    setSelectedHealthCheck(null);
                }}
                onSubmit={handleDonationSubmit}
                bloodTypes={bloodTypes}
                bloodComponents={[]}
                healthCheck={selectedHealthCheck}
            />
        </div>
    );
};

export default HealthChecks;