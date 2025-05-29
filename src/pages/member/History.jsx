import React, { useState } from 'react';
import { 
  Heart, Calendar, MapPin, Download, Filter, Search, 
  Clock, User, Award, TrendingUp, FileText, Eye,
  ChevronLeft, ChevronRight, Star, Trophy, Gift
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const MemberHistory = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const itemsPerPage = 10;

  const donationHistory = [
    {
      id: 1,
      date: '2025-05-20',
      time: '09:30',
      location: 'Bệnh viện Chợ Rẫy',
      address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM',
      type: 'whole_blood',
      volume: 450,
      bloodType: 'O+',
      status: 'completed',
      staff: 'Y tá Nguyễn Thị A',
      preCheckup: {
        weight: 70,
        bloodPressure: '120/80',
        pulse: 72,
        temperature: 36.5,
        hemoglobin: 14.2
      },
      postCheckup: {
        condition: 'Tốt',
        advice: 'Nghỉ ngơi 15 phút, uống nhiều nước'
      },
      certificate: 'GCN-2025-001234',
      points: 100,
      notes: 'Quy trình diễn ra suôn sẻ, người hiến máu có tinh thần tốt'
    },
    {
      id: 2,
      date: '2025-01-15',
      time: '14:00',
      location: 'Trung tâm Y tế Quận 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      type: 'platelet',
      volume: 250,
      bloodType: 'O+',
      status: 'completed',
      staff: 'Y tá Trần Văn B',
      preCheckup: {
        weight: 72,
        bloodPressure: '118/75',
        pulse: 68,
        temperature: 36.8,
        hemoglobin: 13.8
      },
      postCheckup: {
        condition: 'Tốt',
        advice: 'Bổ sung thêm protein và vitamin'
      },
      certificate: 'GCN-2025-000892',
      points: 150,
      notes: 'Hiến tiểu cầu thành công, không có biến chứng'
    },
    {
      id: 3,
      date: '2024-09-10',
      time: '10:15',
      location: 'Bệnh viện Từ Dũ',
      address: '284 Cống Quỳnh, Quận 1, TP.HCM',
      type: 'whole_blood',
      volume: 450,
      bloodType: 'O+',
      status: 'completed',
      staff: 'Y tá Lê Thị C',
      preCheckup: {
        weight: 69,
        bloodPressure: '125/82',
        pulse: 75,
        temperature: 36.3,
        hemoglobin: 14.5
      },
      postCheckup: {
        condition: 'Rất tốt',
        advice: 'Tiếp tục duy trì chế độ ăn uống lành mạnh'
      },
      certificate: 'GCN-2024-003456',
      points: 100,
      notes: 'Lần hiến máu thứ 10, người hiến máu có kinh nghiệm'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Người hiến máu đầu tiên',
      description: 'Hoàn thành lần hiến máu đầu tiên',
      icon: '🩸',
      date: '2022-03-15',
      points: 50
    },
    {
      id: 2,
      title: 'Người hiến máu tích cực',
      description: 'Hiến máu 5 lần trong năm',
      icon: '⭐',
      date: '2023-12-20',
      points: 200
    },
    {
      id: 3,
      title: 'Người hiến máu thường xuyên',
      description: 'Hiến máu 10 lần',
      icon: '🏆',
      date: '2024-09-10',
      points: 500
    },
    {
      id: 4,
      title: 'Người hiến tiểu cầu',
      description: 'Hiến tiểu cầu lần đầu',
      icon: '💎',
      date: '2025-01-15',
      points: 300
    }
  ];

  const stats = {
    totalDonations: 12,
    totalVolume: 5850, 
    totalPoints: 1250,
    lifeSaved: 36,
    longestStreak: 8, 
    avgInterval: 4.2 
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'whole_blood': return 'Máu toàn phần';
      case 'platelet': return 'Tiểu cầu';
      case 'plasma': return 'Huyết tương';
      default: return 'Khác';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'pending': return 'Chờ xử lý';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredHistory = donationHistory.filter(donation => {
    const yearMatch = selectedYear === 'all' || donation.date.startsWith(selectedYear);
    const statusMatch = selectedStatus === 'all' || donation.status === selectedStatus;
    return yearMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentItems = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = (donation) => {
    setSelectedDonation(donation);
    setShowDetailModal(true);
  };

  const downloadCertificate = (donation) => {
    console.log('Downloading certificate:', donation.certificate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử hiến máu</h1>
          <p className="text-gray-600 mt-1">Theo dõi hành trình hiến máu của bạn</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" icon={<Download />}>
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-red-600 mb-1">{stats.totalDonations}</div>
          <div className="text-sm text-gray-600">Tổng lần hiến</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalVolume.toLocaleString()}</div>
          <div className="text-sm text-gray-600">ml máu (tổng)</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.lifeSaved}</div>
          <div className="text-sm text-gray-600">Người được cứu</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.totalPoints}</div>
          <div className="text-sm text-gray-600">Điểm tích lũy</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.longestStreak}</div>
          <div className="text-sm text-gray-600">Tháng dài nhất</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.avgInterval}</div>
          <div className="text-sm text-gray-600">Tháng/lần TB</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 text-red-500 mr-2" />
                  Lịch sử chi tiết
                </CardTitle>
                
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">Tất cả năm</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="pending">Chờ xử lý</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {currentItems.map((donation) => (
                  <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {formatDate(donation.date)} - {donation.time}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {donation.location}
                            </span>
                            <span className="font-medium text-red-600">{donation.bloodType}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          {getStatusText(donation.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Loại hiến máu</div>
                        <div className="font-medium">{getTypeText(donation.type)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Thể tích</div>
                        <div className="font-medium">{donation.volume} ml</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Nhân viên</div>
                        <div className="font-medium">{donation.staff}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Điểm thưởng</div>
                        <div className="font-medium text-green-600">+{donation.points}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Mã GCN: <span className="font-medium">{donation.certificate}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetail(donation)}
                          icon={<Eye />}
                        >
                          Chi tiết
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadCertificate(donation)}
                          icon={<Download />}
                        >
                          Giấy chứng nhận
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    icon={<ChevronLeft />}
                  >
                    Trước
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-red-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    icon={<ChevronRight />}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                Thành tích
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{formatDate(achievement.date)}</span>
                          <span className="text-xs font-medium text-green-600">+{achievement.points} điểm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Thống kê nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lần hiến gần nhất:</span>
                  <span className="font-semibold">20/05/2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Có thể hiến lại:</span>
                  <span className="font-semibold text-green-600">20/09/2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Điểm còn lại:</span>
                  <span className="font-semibold text-yellow-600">{stats.totalPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Xếp hạng:</span>
                  <span className="font-semibold text-purple-600">Vàng</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 text-pink-500 mr-2" />
                Phần thưởng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Bạn có {stats.totalPoints} điểm để đổi quà
                </p>
                <Button variant="primary" size="sm" fullWidth>
                  Xem quà tặng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedDonation && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Chi tiết lần hiến máu"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày giờ:</span>
                    <span>{formatDate(selectedDonation.date)} - {selectedDonation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Địa điểm:</span>
                    <span>{selectedDonation.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loại:</span>
                    <span>{getTypeText(selectedDonation.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thể tích:</span>
                    <span>{selectedDonation.volume} ml</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nhân viên:</span>
                    <span>{selectedDonation.staff}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Khám trước hiến máu</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cân nặng:</span>
                    <span>{selectedDonation.preCheckup.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Huyết áp:</span>
                    <span>{selectedDonation.preCheckup.bloodPressure} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mạch:</span>
                    <span>{selectedDonation.preCheckup.pulse} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nhiệt độ:</span>
                    <span>{selectedDonation.preCheckup.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hemoglobin:</span>
                    <span>{selectedDonation.preCheckup.hemoglobin} g/dL</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Khám sau hiến máu</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Tình trạng:</span>
                  <span className="text-sm font-semibold text-green-600">{selectedDonation.postCheckup.condition}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Lời khuyên:</span>
                  <p className="text-sm text-gray-600 mt-1">{selectedDonation.postCheckup.advice}</p>
                </div>
              </div>
            </div>

            {selectedDonation.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Ghi chú</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">{selectedDonation.notes}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => downloadCertificate(selectedDonation)}
                icon={<Download />}
              >
                Tải giấy chứng nhận
              </Button>
              <Button onClick={() => setShowDetailModal(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MemberHistory;