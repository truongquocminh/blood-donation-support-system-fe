import React from "react";
import {
  Eye,
  Droplets,
  Syringe,
  Calendar,
  FileText,
  Loader2
} from "lucide-react";
import { formatVietnamTime } from "../../utils/formatters";

const ExtractionTable = ({
  extractions,
  onViewDetail,
  searchTerm,
  filterType,
  filterComponent,
  loading = false,
  actionLoading = false,
}) => {
  const filteredExtractions = extractions.filter((extraction) => {
    const matchesSearch =
      searchTerm === "" ||
      extraction.bloodTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extraction.bloodComponentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (extraction.notes && extraction.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === "" || extraction.bloodTypeId?.toString() === filterType;
    const matchesComponent =
      filterComponent === "" ||
      extraction.bloodComponentId?.toString() === filterComponent;

    return matchesSearch && matchesType && matchesComponent;
  });

  const LoadingSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-8 w-8 bg-gray-200 rounded-lg mx-auto"></div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Danh sách trích xuất {!loading && `(${filteredExtractions.length})`}
        </h3>
        {loading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhóm máu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thành phần
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thể tích trích xuất
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày trích xuất
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ghi chú
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }, (_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : filteredExtractions.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <Syringe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    Không tìm thấy trích xuất nào
                  </p>
                  <p className="text-sm">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </td>
              </tr>
            ) : (
              filteredExtractions.map((extraction) => (
                <tr key={extraction.extractionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{extraction.extractionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Droplets className="w-3 h-3 mr-1" />
                      {extraction.bloodTypeName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {extraction.bloodComponentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Syringe className="w-3 h-3 text-gray-400" />
                      <span className="font-medium text-blue-600">
                        {extraction.totalVolumeExtraction} ml
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>
                        {extraction.extractedAt 
                          ? formatVietnamTime(extraction.extractedAt, 'DD/MM/YYYY HH:mm') 
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1 max-w-xs">
                      <FileText className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate" title={extraction.notes || 'Không có ghi chú'}>
                        {extraction.notes || 'Không có ghi chú'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetail(extraction)}
                      disabled={actionLoading}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Xem chi tiết"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExtractionTable;