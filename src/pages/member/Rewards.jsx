import React, { useState } from 'react';
import { 
  Gift, Star, Award, Crown, Heart, ShoppingCart, 
  Coffee, Book, Shirt, Smartphone, Headphones, 
  Trophy, TrendingUp, Calendar, CheckCircle, Clock,
  ArrowRight, Zap, Target, Medal
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal, { ConfirmModal, AlertModal } from '../../components/ui/Modal';

const MemberRewards = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedReward, setSelectedReward] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const userPoints = {
    current: 1250,
    total: 3850,
    thisMonth: 250,
    rank: 'Gold',
    nextRank: 'Platinum',
    pointsToNextRank: 750
  };

  const availableRewards = [
    {
      id: 1,
      name: 'Voucher Cà phê Highlands',
      description: 'Voucher giảm giá 50k cho đồ uống tại Highlands Coffee',
      points: 200,
      category: 'food',
      icon: Coffee,
      image: '☕',
      availability: 'Có sẵn',
      validUntil: '2025-12-31',
      terms: 'Áp dụng cho tất cả cửa hàng trên toàn quốc'
    },
    {
      id: 2,
      name: 'Áo thun BloodConnect',
      description: 'Áo thun cotton cao cấp với logo BloodConnect',
      points: 300,
      category: 'apparel',
      icon: Shirt,
      image: '👕',
      availability: 'Có sẵn',
      validUntil: '2025-12-31',
      terms: 'Size M, L, XL. Màu đỏ và trắng'
    },
    {
      id: 3,
      name: 'Sách "Hiến máu cứu người"',
      description: 'Cuốn sách hướng dẫn về hiến máu và sức khỏe',
      points: 150,
      category: 'books',
      icon: Book,
      image: '📚',
      availability: 'Có sẵn',
      validUntil: '2025-12-31',
      terms: 'Sách bìa mềm, 200 trang'
    },
    {
      id: 4,
      name: 'Tai nghe Bluetooth',
      description: 'Tai nghe không dây chất lượng cao',
      points: 800,
      category: 'electronics',
      icon: Headphones,
      image: '🎧',
      availability: 'Còn 5 suất',
      validUntil: '2025-12-31',
      terms: 'Bảo hành 12 tháng'
    },
    {
      id: 5,
      name: 'Ốp lưng điện thoại',
      description: 'Ốp lưng silicon cao cấp với thiết kế BloodConnect',
      points: 100,
      category: 'accessories',
      icon: Smartphone,
      image: '📱',
      availability: 'Có sẵn',
      validUntil: '2025-12-31',
      terms: 'Nhiều model khác nhau'
    },
    {
      id: 6,
      name: 'Voucher mua sắm 200k',
      description: 'Voucher mua sắm tại các siêu thị lớn',
      points: 500,
      category: 'shopping',
      icon: ShoppingCart,
      image: '🛒',
      availability: 'Có sẵn',
      validUntil: '2025-12-31',
      terms: 'Áp dụng tại Big C, Lotte Mart, Coopmart'
    }
  ];

  const redeemedRewards = [
    {
      id: 7,
      name: 'Voucher Cà phê Highlands',
      description: 'Voucher giảm giá 50k cho đồ uống tại Highlands Coffee',
      points: 200,
      redeemedDate: '2025-05-15',
      status: 'used',
      code: 'HC2025051501'
    },
    {
      id: 8,
      name: 'Áo thun BloodConnect',
      description: 'Áo thun cotton cao cấp với logo BloodConnect',
      points: 300,
      redeemedDate: '2025-04-20',
      status: 'delivered',
      trackingCode: 'BC2025042001'
    },
    {
      id: 9,
      name: 'Sách "Hiến máu cứu người"',
      description: 'Cuốn sách hướng dẫn về hiến máu và sức khỏe',
      points: 150,
      redeemedDate: '2025-03-10',
      status: 'used',
      code: null
    }
  ];

  const achievements = [
    {
      id: 1,
      name: 'Người mới bắt đầu',
      description: 'Tích lũy được 100 điểm đầu tiên',
      icon: '🌟',
      unlocked: true,
      unlockedDate: '2024-03-15',
      points: 50
    },
    {
      id: 2,
      name: 'Người tích cực',
      description: 'Tích lũy được 500 điểm',
      icon: '⭐',
      unlocked: true,
      unlockedDate: '2024-08-22',
      points: 100
    },
    {
      id: 3,
      name: 'Người hiến máu thường xuyên',
      description: 'Hiến máu 10 lần',
      icon: '🏆',
      unlocked: true,
      unlockedDate: '2024-12-05',
      points: 200
    },
    {
      id: 4,
      name: 'Người thu thập',
      description: 'Tích lũy được 2000 điểm',
      icon: '💎',
      unlocked: false,
      progress: 62.5, 
      points: 300
    },
    {
      id: 5,
      name: 'Huyền thoại',
      description: 'Hiến máu 50 lần',
      icon: '👑',
      unlocked: false,
      progress: 24, 
      points: 500
    }
  ];

  const pointsHistory = [
    {
      id: 1,
      date: '2025-05-20',
      description: 'Hiến máu toàn phần',
      points: '+100',
      type: 'earn'
    },
    {
      id: 2,
      date: '2025-05-15',
      description: 'Đổi Voucher Cà phê Highlands',
      points: '-200',
      type: 'redeem'
    },
    {
      id: 3,
      date: '2025-04-25',
      description: 'Hoàn thành thành tích "Người hiến máu thường xuyên"',
      points: '+200',
      type: 'achievement'
    },
    {
      id: 4,
      date: '2025-04-20',
      description: 'Đổi Áo thun BloodConnect',
      points: '-300',
      type: 'redeem'
    },
    {
      id: 5,
      date: '2025-04-15',
      description: 'Hiến tiểu cầu',
      points: '+150',
      type: 'earn'
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return Coffee;
      case 'apparel': return Shirt;
      case 'books': return Book;
      case 'electronics': return Headphones;
      case 'accessories': return Smartphone;
      case 'shopping': return ShoppingCart;
      default: return Gift;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipping': return 'text-blue-600 bg-blue-100';
      case 'used': return 'text-gray-600 bg-gray-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Đã giao';
      case 'shipping': return 'Đang giao';
      case 'used': return 'Đã sử dụng';
      case 'expired': return 'Hết hạn';
      default: return 'Đã đổi';
    }
  };

  const getPointsTypeColor = (type) => {
    switch (type) {
      case 'earn': return 'text-green-600';
      case 'redeem': return 'text-red-600';
      case 'achievement': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Bronze': return 'text-orange-600 bg-orange-100';
      case 'Silver': return 'text-gray-600 bg-gray-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Platinum': return 'text-purple-600 bg-purple-100';
      case 'Diamond': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    setShowRedeemModal(false);
    setShowSuccessModal(true);
    setSelectedReward(null);
  };

  const progressToNextRank = (userPoints.current / (userPoints.current + userPoints.pointsToNextRank)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Điểm thưởng & Quà tặng</h1>
          <p className="text-gray-600 mt-1">Đổi điểm thưởng lấy quà tặng hấp dẫn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{userPoints.current.toLocaleString()}</h2>
                <p className="text-gray-600">Điểm hiện tại</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" fill="currentColor" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-lg font-semibold text-gray-900">{userPoints.total.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Tổng điểm tích lũy</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">+{userPoints.thisMonth}</div>
                <div className="text-sm text-gray-600">Điểm tháng này</div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRankColor(userPoints.rank)}`}>
                  {userPoints.rank}
                </span>
                <span className="text-sm text-gray-600">
                  Còn {userPoints.pointsToNextRank} điểm để đạt {userPoints.nextRank}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressToNextRank}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              Hành động nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="primary" size="sm" fullWidth icon={<Heart />}>
                Hiến máu để tích điểm
              </Button>
              <Button variant="outline" size="sm" fullWidth icon={<Gift />}>
                Xem quà hot nhất
              </Button>
              <Button variant="outline" size="sm" fullWidth icon={<Trophy />}>
                Xem thành tích
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'available', label: 'Quà có thể đổi', count: availableRewards.length },
            { key: 'redeemed', label: 'Đã đổi', count: redeemedRewards.length },
            { key: 'achievements', label: 'Thành tích', count: achievements.filter(a => a.unlocked).length },
            { key: 'history', label: 'Lịch sử điểm', count: null }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRewards.map((reward) => {
            const IconComponent = getCategoryIcon(reward.category);
            const canAfford = userPoints.current >= reward.points;
            
            return (
              <Card key={reward.id} className={`relative overflow-hidden ${canAfford ? 'hover:shadow-lg transition-shadow' : 'opacity-75'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{reward.image}</div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      canAfford ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${canAfford ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{reward.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{reward.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                      <span className="font-semibold text-gray-900">{reward.points} điểm</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">{reward.availability}</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    <p>Hạn đổi: {formatDate(reward.validUntil)}</p>
                    <p>{reward.terms}</p>
                  </div>

                  <Button
                    variant={canAfford ? "primary" : "outline"}
                    size="sm"
                    fullWidth
                    disabled={!canAfford}
                    onClick={() => handleRedeem(reward)}
                    icon={<Gift />}
                  >
                    {canAfford ? 'Đổi ngay' : `Cần thêm ${reward.points - userPoints.current} điểm`}
                  </Button>
                </CardContent>

                {!canAfford && (
                  <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    Không đủ điểm
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'redeemed' && (
        <div className="space-y-4">
          {redeemedRewards.map((reward) => (
            <Card key={reward.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Gift className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Đổi ngày: {formatDate(reward.redeemedDate)}</span>
                        <span>Điểm: {reward.points}</span>
                        {reward.code && <span>Mã: {reward.code}</span>}
                        {reward.trackingCode && <span>Tracking: {reward.trackingCode}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reward.status)}`}>
                    {getStatusText(reward.status)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`relative ${achievement.unlocked ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.unlocked ? (
                      <div className="flex items-center space-x-2 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">
                          Đạt được: {formatDate(achievement.unlockedDate)}
                        </span>
                        <span className="text-sm font-medium text-yellow-600">
                          +{achievement.points} điểm
                        </span>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>Tiến độ</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Medal className="w-6 h-6 text-yellow-500" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
              Lịch sử điểm thưởng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pointsHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === 'earn' ? 'bg-green-100' :
                      item.type === 'redeem' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {item.type === 'earn' && <TrendingUp className="w-5 h-5 text-green-600" />}
                      {item.type === 'redeem' && <Gift className="w-5 h-5 text-red-600" />}
                      {item.type === 'achievement' && <Trophy className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.description}</h4>
                      <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  
                  <span className={`font-semibold ${getPointsTypeColor(item.type)}`}>
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        onConfirm={confirmRedeem}
        title="Xác nhận đổi quà"
        message={
          selectedReward 
            ? `Bạn có chắc chắn muốn đổi "${selectedReward.name}" với ${selectedReward.points} điểm?`
            : ''
        }
        confirmText="Đổi quà"
        cancelText="Hủy"
        variant="warning"
      />

      <AlertModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Đổi quà thành công!"
        message="Quà tặng của bạn đã được đổi thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
        buttonText="Tuyệt vời"
      />
    </div>
  );
};

export default MemberRewards;