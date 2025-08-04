import React, { useState, useEffect } from 'react';
import { 
  Award, Medal, Star, Download, Calendar, FileText,
  Search, Filter, ChevronDown, Trophy, Crown
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getCertificates } from '../../services/certificateService';
import toast from 'react-hot-toast';

const Certificates = () => {
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
      const res = await getCertificates(currentPage, pageSize);
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
      case 'certificate':
        return Award;
      case 'merit':
        return Medal;
      default:
        return FileText;
    }
  };

  const getCertificateColor = (type) => {
    switch (type) {
      case 'certificate':
        return 'text-blue-600 bg-blue-100';
      case 'merit':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCertificateTypeText = (type) => {
    switch (type) {
      case 'certificate':
        return 'Chứng chỉ';
      case 'merit':
        return 'Bằng khen';
      default:
        return 'Khác';
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
    certificates: certificates.filter(c => c.certificateType === 'certificate').length,
    merits: certificates.filter(c => c.certificateType === 'merit').length
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
                        { value: 'certificate', label: 'Chứng chỉ' },
                        { value: 'merit', label: 'Bằng khen' }
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
            <div className="space-y-4">
              {filteredCertificates.map((certificate) => {
                const IconComponent = getCertificateIcon(certificate.certificateType);
                
                return (
                  <div
                    key={certificate.certificateId}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCertificateColor(certificate.certificateType)}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{certificate.description}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificateColor(certificate.certificateType)}`}>
                              {getCertificateTypeText(certificate.certificateType)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Ngày tạo: {formatDate(certificate.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>ID: {certificate.certificateId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Download />}
                        >
                          Tải xuống
                        </Button>
                      </div>
                    </div>
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