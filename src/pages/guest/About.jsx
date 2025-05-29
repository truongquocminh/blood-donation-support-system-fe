import React, { useState, useEffect } from 'react';
import {
  Heart, Shield, Award, Clock, Syringe, Users, Star,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const [stats, setStats] = useState({
    donors: 0,
    bloodUnits: 0,
    livesSaved: 0,
    locations: 0
  });

  useEffect(() => {
    const finalStats = { donors: 10000, bloodUnits: 50000, livesSaved: 25000, locations: 100 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setStats({
        donors: Math.floor(finalStats.donors * easeOut),
        bloodUnits: Math.floor(finalStats.bloodUnits * easeOut),
        livesSaved: Math.floor(finalStats.livesSaved * easeOut),
        locations: Math.floor(finalStats.locations * easeOut)
      });

      if (step >= steps) {
        clearInterval(interval);
        setStats(finalStats);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-16 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Về <span className="gradient-text">BloodConnect</span>
            </h1>
            <p className="text-xl text-gray-600">
              Kết nối những trái tim nhân ái, mang lại hy vọng sống cho những người đang cần.
              Cùng nhau xây dựng một cộng đồng yêu thương và chia sẻ.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Tại sao <span className="gradient-text">hiến máu</span> lại quan trọng?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hiến máu không chỉ cứu sống người khác mà còn mang lại nhiều lợi ích tuyệt vời cho chính bạn
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: Heart,
                  title: "Cứu sống sinh mệnh",
                  description: "Mỗi lần hiến máu có thể cứu sống đến 3 người. Bạn là anh hùng thầm lặng của nhiều gia đình.",
                  color: "from-red-500 to-pink-500"
                },
                {
                  icon: Shield,
                  title: "Kiểm tra sức khỏe miễn phí",
                  description: "Được kiểm tra các chỉ số sức khỏe cơ bản, phát hiện sớm các vấn đề tiềm ẩn.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Award,
                  title: "Tái tạo máu mới",
                  description: "Cơ thể sẽ tự tái tạo máu mới, giúp tuần hoàn máu tốt hơn và cải thiện sức khỏe.",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: Users,
                  title: "Cộng đồng yêu thương",
                  description: "Tham gia vào cộng đồng người hiến máu, kết nối với những con người tốt bụng.",
                  color: "from-purple-500 to-violet-500"
                },
                {
                  icon: Clock,
                  title: "Tiết kiệm thời gian",
                  description: "Quy trình hiến máu nhanh chóng, chỉ mất 10-15 phút cho toàn bộ quá trình.",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: Syringe,
                  title: "An toàn tuyệt đối",
                  description: "Sử dụng dụng cụ y tế vô trùng một lần, đảm bảo an toàn 100% cho người hiến.",
                  color: "from-teal-500 to-blue-500"
                }
              ].map((feature, index) => (
                <div key={index} className="card card-hover group p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-12">
                Quy trình hiến máu <span className="text-red-500">đơn giản</span>
              </h3>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: "01", title: "Đăng ký", desc: "Điền thông tin cá nhân và đặt lịch hẹn", icon: Users },
                  { step: "02", title: "Khám sàng lọc", desc: "Kiểm tra sức khỏe và các chỉ số cơ bản", icon: Shield },
                  { step: "03", title: "Hiến máu", desc: "Quy trình hiến máu an toàn, nhanh chóng", icon: Syringe },
                  { step: "04", title: "Nghỉ ngơi", desc: "Thư giãn và nhận quà cảm ơn từ chúng tôi", icon: Heart }
                ].map((process, index) => (
                  <div key={index} className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                        <process.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-100">
                        <span className="text-sm font-bold text-red-500">{process.step}</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{process.title}</h4>
                    <p className="text-gray-600 text-sm">{process.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Những con số <span className="gradient-text">ấn tượng</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Mỗi con số đều là một câu chuyện về sự sống được cứu giúp và tình người được trao gửi
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Người được cứu mỗi năm", value: `${stats.livesSaved.toLocaleString()}+`, color: "from-red-500 to-pink-500", icon: Heart },
                { label: "Đơn vị máu thu được", value: `${stats.bloodUnits.toLocaleString()}+`, color: "from-blue-500 to-cyan-500", icon: Syringe },
                { label: "Người hiến máu tích cực", value: `${stats.donors.toLocaleString()}+`, color: "from-green-500 to-emerald-500", icon: Users },
                { label: "Điểm hiến máu toàn quốc", value: `${stats.locations}+`, color: "from-purple-500 to-violet-500", icon: Shield }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Lợi ích khi <span className="gradient-text">hiến máu</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hiến máu mang lại những lợi ích tuyệt vời không chỉ cho người nhận mà còn cho chính bạn
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {[
                  {
                    title: "Cải thiện sức khỏe tim mạch",
                    description: "Hiến máu định kỳ giúp giảm nguy cơ mắc các bệnh tim mạch, đột quỵ và huyết áp cao.",
                    icon: Heart,
                    color: "text-red-500"
                  },
                  {
                    title: "Tăng cường hệ miễn dịch",
                    description: "Cơ thể sẽ tự động tái tạo máu mới, giúp tăng cường hệ miễn dịch và sức đề kháng.",
                    icon: Shield,
                    color: "text-green-500"
                  },
                  {
                    title: "Kiểm tra sức khỏe miễn phí",
                    description: "Được kiểm tra các chỉ số máu, phát hiện sớm các bệnh lý tiềm ẩn một cách hoàn toàn miễn phí.",
                    icon: Award,
                    color: "text-blue-500"
                  },
                  {
                    title: "Cảm giác hạnh phúc",
                    description: "Việc giúp đỡ người khác sẽ mang lại cảm giác hạnh phúc và ý nghĩa trong cuộc sống.",
                    icon: Star,
                    color: "text-yellow-500"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className={`w-12 h-12 ${benefit.color} bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <benefit.icon className="w-6 h-6" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="card p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Ai có thể hiến máu?</h3>
                    <p className="text-gray-600">Những điều kiện cơ bản để có thể hiến máu</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Tuổi từ 18-60",
                      "Cân nặng trên 45kg",
                      "Không mắc các bệnh truyền nhiễm",
                      "Không trong thời gian dùng thuốc kháng sinh",
                      "Đủ thời gian giữa 2 lần hiến máu",
                      "Tình trạng sức khỏe tốt"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;