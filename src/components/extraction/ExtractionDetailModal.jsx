import React, { useState, useEffect } from 'react';
import { X, Package, Droplets, Syringe, Calendar, FileText, Hash, Loader2, AlertTriangle } from 'lucide-react';
import { getInventoryById } from '../../services/inventoryService';
import { formatVietnamTime } from '../../utils/formatters';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ExtractionDetailModal = ({
  isOpen,
  onClose,
  extraction,
  extractionDetails
}) => {
  const [inventoryDetails, setInventoryDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && extractionDetails.length > 0) {
      fetchInventoryDetails();
    }
  }, [isOpen, extractionDetails]);

  const fetchInventoryDetails = async () => {
    try {
      setLoading(true);
      const inventoryPromises = extractionDetails.map(detail =>
        getInventoryById(detail.inventoryId)
      );

      const inventoryResponses = await Promise.all(inventoryPromises);
      const inventoryData = {};

      inventoryResponses.forEach((response, index) => {
        if (response.status === 200 && response.data.data) {
          const inventoryId = extractionDetails[index].inventoryId;
          inventoryData[inventoryId] = response.data.data;
        }
      });

      setInventoryDetails(inventoryData);
    } catch (error) {
      console.error('Lỗi khi tải thông tin inventory:', error);
      toast.error('Không thể tải thông tin chi tiết kho máu');
    } finally {
      setLoading(false);
    }
  };

  const getInventoryInfo = (inventoryId) => {
    return inventoryDetails[inventoryId] || null;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const getStatusBadge = (inventory) => {
    if (!inventory) return null;

    if (isExpired(inventory.expiryDate)) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Đã hết hạn
        </span>
      );
    }

    if (isExpiringSoon(inventory.expiryDate)) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Sắp hết hạn
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Bình thường
      </span>
    );
  };

  if (!isOpen || !extraction) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Syringe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết trích xuất #{extraction.extractionId}
              </h3>
              <p className="text-sm text-gray-600">
                Thông tin chi tiết và danh sách kho máu được trích xuất
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Droplets className="w-5 h-5 text-blue-600 mr-2" />
              Thông tin trích xuất
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-600">Nhóm máu</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {extraction.bloodTypeName}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Thành phần</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {extraction.bloodComponentName}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Syringe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Tổng thể tích</span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {extraction.totalVolumeExtraction} ml
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">Thời gian trích xuất</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {extraction.extractedAt
                    ? dayjs(extraction.extractedAt).format('DD/MM/YYYY HH:mm')
                    : 'N/A'
                  }
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg md:col-span-2">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Ghi chú</span>
                </div>
                <p className="text-sm text-gray-900">
                  {extraction.notes || 'Không có ghi chú'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="w-5 h-5 text-green-600 mr-2" />
                Danh sách kho máu được trích xuất ({extractionDetails.length})
              </h4>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Đang tải thông tin chi tiết...</p>
              </div>
            ) : extractionDetails.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Không có dữ liệu chi tiết</p>
                <p className="text-sm">Chưa có thông tin về kho máu được trích xuất</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Kho
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lô
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng trích xuất
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày nhập
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hạn sử dụng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {extractionDetails.map((detail) => {
                      const inventory = getInventoryInfo(detail.inventoryId);
                      return (
                        <tr key={detail.inventoryId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{detail.inventoryId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {inventory?.batchNumber || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Syringe className="w-3 h-3 text-blue-400" />
                              <span className="font-medium text-blue-600">
                                {detail.volumeExtracted} ml
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span>
                                {inventory?.addedDate
                                  ? formatVietnamTime(inventory.addedDate, 'DD/MM/YYYY')
                                  : 'N/A'
                                }
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className={
                                inventory && isExpired(inventory.expiryDate)
                                  ? "text-red-600 font-medium"
                                  : inventory && isExpiringSoon(inventory.expiryDate)
                                    ? "text-yellow-600 font-medium"
                                    : ""
                              }>
                                {inventory?.expiryDate
                                  ? formatVietnamTime(inventory.expiryDate, 'DD/MM/YYYY')
                                  : 'N/A'
                                }
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(inventory)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {extractionDetails.reduce((sum, detail) => sum + detail.volumeExtracted, 0)} ml
                  </p>
                  <p className="text-xs text-gray-600">Tổng thể tích thực tế</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {extractionDetails.length}
                  </p>
                  <p className="text-xs text-gray-600">Số lô được sử dụng</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Trích xuất hoàn tất lúc
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {extraction.extractedAt
                    ? dayjs(extraction.extractedAt).format('DD/MM/YYYY HH:mm')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtractionDetailModal;