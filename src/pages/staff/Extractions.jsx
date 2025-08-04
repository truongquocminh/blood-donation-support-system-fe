import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import ExtractionStats from '../../components/extraction/ExtractionStats';
import ExtractionTable from '../../components/extraction/ExtractionTable';
import ExtractionFormModal from '../../components/extraction/ExtractionFormModal';
import ExtractionDetailModal from '../../components/extraction/ExtractionDetailModal';
import { getAllExtractions, getExtractionDetails } from '../../services/extractionService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getBloodComponents } from '../../services/bloodComponentService';
import toast from 'react-hot-toast';

const Extraction = () => {
  const [extractions, setExtractions] = useState([]);
  console.log('Extractions:', extractions);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExtraction, setSelectedExtraction] = useState(null);
  const [extractionDetails, setExtractionDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterComponent, setFilterComponent] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchExtractions();
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchBloodData();
  }, []);

  const fetchBloodData = async () => {
    try {
      const [typesRes, componentsRes] = await Promise.all([
        getBloodTypes(),
        getBloodComponents()
      ]);

      if (typesRes.status === 200 && typesRes.data.data?.content) {
        setBloodTypes(typesRes.data.data.content);
      } else {
        toast.error('Không thể tải danh sách nhóm máu');
      }

      if (componentsRes.status === 200 && componentsRes.data.data?.content) {
        setBloodComponents(componentsRes.data.data.content);
      } else {
        toast.error('Không thể tải danh sách thành phần máu');
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu máu:', error);
      toast.error('Lỗi khi gọi API nhóm máu hoặc thành phần máu');
    }
  };

  const fetchExtractions = async () => {
    try {
      setLoading(true);
      const res = await getAllExtractions(currentPage, pageSize);
      if (res.status === 200 && res.data.data) {
        const { content, totalPages, totalElements } = res.data.data;
        setExtractions(content);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
      } else {
        setExtractions([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách trích xuất:", error);
      toast.error("Không thể tải danh sách trích xuất");
      setExtractions([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExtraction = async () => {
    await fetchExtractions();
  };

  const openAddModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleViewDetail = async (extraction) => {
    try {
      setActionLoading(true);
      const res = await getExtractionDetails(extraction.extractionId);
      
      if (res.status === 200 && res.data.data) {
        setSelectedExtraction(extraction);
        setExtractionDetails(res.data.data);
        setIsDetailModalOpen(true);
      } else {
        toast.error('Không thể tải chi tiết trích xuất');
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết trích xuất:', error);
      toast.error('Lỗi khi tải chi tiết trích xuất');
    } finally {
      setActionLoading(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedExtraction(null);
    setExtractionDetails([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý trích xuất</h1>
          <p className="text-gray-600">Theo dõi và quản lý các lần trích xuất máu</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo trích xuất</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo nhóm máu, thành phần, ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo nhóm máu
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả nhóm máu</option>
                  {bloodTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo thành phần
                </label>
                <select
                  value={filterComponent}
                  onChange={(e) => setFilterComponent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả thành phần</option>
                  {bloodComponents.map(component => (
                    <option key={component.componentId} value={component.componentId}>
                      {component.componentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <ExtractionStats extractions={extractions} />

      <ExtractionTable
        extractions={extractions}
        onViewDetail={handleViewDetail}
        searchTerm={searchTerm}
        filterType={filterType}
        filterComponent={filterComponent}
        loading={loading}
        actionLoading={actionLoading}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Hiển thị {currentPage * pageSize + 1} – {Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số {totalElements} bản ghi
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 border rounded ${i === currentPage ? 'bg-blue-500 text-white' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setCurrentPage(0);
            }}
            className="ml-4 border px-2 py-1 rounded"
          >
            <option value={5}>5/trang</option>
            <option value={10}>10/trang</option>
            <option value={20}>20/trang</option>
          </select>
        </div>
      )}

      <ExtractionFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSubmit={handleAddExtraction}
        bloodTypes={bloodTypes}
        bloodComponents={bloodComponents}
        onRefresh={fetchExtractions}
      />

      <ExtractionDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        extraction={selectedExtraction}
        extractionDetails={extractionDetails}
      />
    </div>
  );
};

export default Extraction;