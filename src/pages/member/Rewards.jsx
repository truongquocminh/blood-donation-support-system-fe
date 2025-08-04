import React, { useState, useEffect } from 'react';
import {
  Award, Medal, Star, Download, Calendar, FileText,
  Search, Filter, ChevronDown, Trophy, Crown
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getUserCertificates } from '../../services/certificateService';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  useEffect(() => {
    fetchCertificates();
  }, [currentPage, pageSize]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const res = await getUserCertificates(user.id, currentPage, pageSize);
        if (res.status === 200 && res.data.data) {
          const { content, totalPages, totalElements } = res.data.data;
          setCertificates(content);
          setTotalPages(totalPages);
          setTotalElements(totalElements);
        } else {
          setCertificates([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải chứng chỉ:", error);
      toast.error("Không thể tải chứng chỉ");
      setCertificates([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const getCertificateIcon = (type) => {
    switch (type) {
      case 'CERTIFICATE':
        return Award;
      case 'MERIT':
        return Medal;
      default:
        return FileText;
    }
  };

  const getCertificateDesign = (type) => {
    switch (type) {
      case 'CERTIFICATE':
        return {
          bgGradient: 'bg-gradient-to-br from-blue-50 via-white to-blue-50',
          borderColor: 'border-blue-200',
          headerBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
          iconColor: 'text-blue-600',
          pattern: 'certificate'
        };
      case 'MERIT':
        return {
          bgGradient: 'bg-gradient-to-br from-yellow-50 via-white to-amber-50',
          borderColor: 'border-yellow-200',
          headerBg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
          iconColor: 'text-yellow-600',
          pattern: 'merit'
        };
      default:
        return {
          bgGradient: 'bg-gradient-to-br from-gray-50 via-white to-gray-50',
          borderColor: 'border-gray-200',
          headerBg: 'bg-gradient-to-r from-gray-600 to-gray-700',
          iconColor: 'text-gray-600',
          pattern: 'default'
        };
    }
  };

  const getCertificateTypeText = (type) => {
    switch (type) {
      case 'CERTIFICATE':
        return 'CHỨNG CHỈ';
      case 'MERIT':
        return 'BẰNG KHEN';
      default:
        return 'KHÁC';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || cert.certificateType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const certificateStats = {
    total: totalElements,
    certificates: certificates.filter(c => c.certificateType === 'CERTIFICATE').length,
    merits: certificates.filter(c => c.certificateType === 'MERIT').length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chứng chỉ & Bằng khen</h1>
          <p className="text-gray-600 mt-1">Quản lý các chứng chỉ và bằng khen của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{certificateStats.total}</p>
                <p className="text-gray-600">Tổng số</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{certificateStats.certificates}</p>
                <p className="text-gray-600">Chứng chỉ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{certificateStats.merits}</p>
                <p className="text-gray-600">Bằng khen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Danh sách chứng chỉ
            </CardTitle>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chứng chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  <span>{filterType === 'all' ? 'Tất cả' : getCertificateTypeText(filterType)}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      {[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'CERTIFICATE', label: 'Chứng chỉ' },
                        { value: 'MERIT', label: 'Bằng khen' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilterType(option.value);
                            setShowFilterDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không có chứng chỉ nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCertificates.map((certificate) => {
                const IconComponent = getCertificateIcon(certificate.certificateType);
                const design = getCertificateDesign(certificate.certificateType);

                return (
                  <div
                    key={certificate.certificateId}
                    className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${design.bgGradient} ${design.borderColor} border-2`}
                    style={{ aspectRatio: '4/3', minHeight: '300px' }}
                  >
                    <div className={`absolute inset-0 opacity-5`}>
                      <div className="absolute top-4 left-4 w-32 h-32 border-8 border-current rounded-full opacity-20"></div>
                      <div className="absolute bottom-4 right-4 w-24 h-24 border-4 border-current rounded-full opacity-15"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-current rounded-full opacity-10"></div>
                    </div>

                    <div className={`${design.headerBg} px-6 py-4 relative z-10`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-sm tracking-wider">
                              {getCertificateTypeText(certificate.certificateType)}
                            </h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <Crown className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 relative z-10 flex flex-col justify-between" style={{ height: 'calc(100% - 72px)' }}>
                      <div className="text-center">
                        <div className="mb-4">
                          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${design.iconColor} bg-white shadow-lg`}>
                            <IconComponent className="w-8 h-8" />
                          </div>
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                          {certificate.description}
                        </h4>
                        
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-4"></div>
                        
                        <div className="mb-6">
                          <p className="text-gray-600 text-xs mb-2">Được trao tặng cho</p>
                          <h5 className="text-xl font-bold text-gray-900 mb-3 tracking-wide">
                            {certificate.userName}
                          </h5>
                          <p className="text-gray-600 text-sm">
                            Vì những đóng góp tích cực trong việc hiến máu cứu người
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(certificate.createAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>#{certificate.certificateId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-2 right-2">
                        <div className={`w-3 h-3 rounded-full ${design.iconColor.replace('text-', 'bg-')} opacity-60`}></div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className={`w-2 h-2 rounded-full ${design.iconColor.replace('text-', 'bg-')} opacity-40`}></div>
                      </div>
                      <div className="absolute top-6 right-6">
                        <div className={`w-1 h-1 rounded-full ${design.iconColor.replace('text-', 'bg-')} opacity-20`}></div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} của {totalElements} kết quả
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trước
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                  if (pageNum >= totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates;