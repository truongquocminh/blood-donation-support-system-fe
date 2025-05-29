import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Users, MapPin, Phone, Mail, Calendar, Syringe, Shield, Award, Clock,
  UserPlus, LogIn, Menu, X, ChevronRight, Star, ArrowUp, Play, CheckCircle,
  Globe, Zap, Target, TrendingUp, MessageCircle, Facebook, Twitter, Instagram
} from 'lucide-react';

import Button from '../../components/ui/Button';
import { BloodDropLoader } from '../../components/common/LoadingSpinner';

import { useAuth } from '../../hooks/useAuth';

import { ROUTES, CONTACT_INFO, SOCIAL_LINKS } from '../../utils/constants';
import { scrollToElement } from '../../utils/helpers';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    donors: 0,
    bloodUnits: 0,
    livesSaved: 0,
    locations: 0
  });

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const benefitsRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
      setShowScrollTop(scrollTop > 500);

      const sections = [
        { id: 'home', ref: heroRef },
        { id: 'about', ref: aboutRef },
        { id: 'benefits', ref: benefitsRef },
        { id: 'contact', ref: contactRef }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

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
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    scrollToElement(sectionId, -80);
  };

  const handleAuthClick = (type) => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate(type === 'login' ? ROUTES.LOGIN : ROUTES.REGISTER);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <BloodDropLoader size="lg" message="Đang tải trang..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-red-100'
          : 'bg-transparent'
        }`}>
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="relative">
                <Heart className="w-8 h-8 text-red-500 transition-transform hover:scale-110" fill="currentColor" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold gradient-text">
                BloodConnect
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {[
                { id: 'home', label: 'Trang chủ' },
                { id: 'about', label: 'Giới thiệu' },
                { id: 'benefits', label: 'Lợi ích' },
                { id: 'contact', label: 'Liên hệ' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`font-medium transition-colors hover:text-red-600 ${activeSection === item.id ? 'text-red-600' : 'text-gray-700'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="secondary"
                icon={<LogIn />}
                onClick={() => handleAuthClick('login')}
                size="sm"
              >
                {isAuthenticated ? 'Dashboard' : 'Đăng nhập'}
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="primary"
                  icon={<UserPlus />}
                  onClick={() => handleAuthClick('register')}
                  size="sm"
                >
                  Đăng ký
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              icon={isMenuOpen ? <X /> : <Menu />}
            />
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-fade-in">
              <nav className="flex flex-col space-y-3 mt-4">
                {[
                  { id: 'home', label: 'Trang chủ' },
                  { id: 'about', label: 'Giới thiệu' },
                  { id: 'benefits', label: 'Lợi ích' },
                  { id: 'contact', label: 'Liên hệ' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left font-medium py-2 transition-colors hover:text-red-600 ${activeSection === item.id ? 'text-red-600' : 'text-gray-700'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="flex flex-col space-y-2 mt-4">
                  <Button
                    variant="secondary"
                    icon={<LogIn />}
                    fullWidth
                    onClick={() => handleAuthClick('login')}
                  >
                    {isAuthenticated ? 'Dashboard' : 'Đăng nhập'}
                  </Button>
                  {!isAuthenticated && (
                    <Button
                      variant="primary"
                      icon={<UserPlus />}
                      fullWidth
                      onClick={() => handleAuthClick('register')}
                    >
                      Đăng ký
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <section
        id="home"
        ref={heroRef}
        className="hero-bg min-h-screen flex items-center justify-center pt-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="glass-effect inline-flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg mb-8 border border-red-100 animate-slide-up">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span className="text-sm font-medium text-gray-700">Cứu sống hàng nghìn người mỗi năm</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              <span className="gradient-text">
                Hiến Máu
              </span>
              <br />
              <span className="text-gray-800">Cứu Người</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto animate-slide-up">
              Mỗi giọt máu của bạn có thể mang lại hy vọng sống cho những người đang cần.
              Hãy cùng chúng tôi lan tỏa yêu thương.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate-slide-up">
              <Button
                size="lg"
                icon={<Heart />}
                iconPosition="left"
                onClick={() => handleAuthClick('register')}
                className="group"
              >
                Đăng ký hiến máu
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={<MapPin />}
                onClick={() => handleNavClick('contact')}
              >
                Tìm điểm hiến máu
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { number: `${stats.donors.toLocaleString()}+`, label: 'Người hiến máu', icon: Users },
                { number: `${stats.bloodUnits.toLocaleString()}+`, label: 'Đơn vị máu', icon: Syringe },
                { number: `${stats.livesSaved.toLocaleString()}+`, label: 'Người được cứu', icon: Heart },
                { number: `${stats.locations}+`, label: 'Điểm hiến máu', icon: MapPin }
              ].map((stat, index) => (
                <div key={index} className="glass-effect rounded-xl p-4 shadow-lg border border-white/50 hover:scale-105 transition-transform">
                  <stat.icon className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      <section id="about" ref={aboutRef} className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
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
                  { step: "01", title: "Đăng ký", desc: "Điền thông tin cá nhân và đặt lịch hẹn", icon: UserPlus },
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

      <section id="benefits" ref={benefitsRef} className="section-padding bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Lợi ích khi <span className="gradient-text">hiến máu</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hiến máu mang lại những lợi ích tuyệt vời không chỉ cho người nhận mà còn cho chính bạn
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                      <Syringe className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Thống kê ấn tượng</h3>
                    <p className="text-gray-600">Những con số biết nói về hiến máu</p>
                  </div>

                  <div className="space-y-6">
                    {[
                      { label: "Người được cứu mỗi năm", value: `${stats.livesSaved.toLocaleString()}+`, color: "from-red-500 to-pink-500" },
                      { label: "Đơn vị máu thu được", value: `${stats.bloodUnits.toLocaleString()}+`, color: "from-blue-500 to-cyan-500" },
                      { label: "Người hiến máu tích cực", value: `${stats.donors.toLocaleString()}+`, color: "from-green-500 to-emerald-500" },
                      { label: "Điểm hiến máu toàn quốc", value: `${stats.locations}+`, color: "from-purple-500 to-violet-500" }
                    ].map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700 font-medium">{stat.label}</span>
                        <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
              </div>
            </div>

            <div className="mt-20">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Câu chuyện từ <span className="text-red-500">cộng đồng</span>
              </h3>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Nguyễn Văn A",
                    role: "Người hiến máu 20 lần",
                    content: "Hiến máu đã trở thành thói quen tốt của tôi. Cảm giác được giúp đỡ người khác thật tuyệt vời!",
                    avatar: "👨‍💼"
                  },
                  {
                    name: "Trần Thị B",
                    role: "Y tá trưởng",
                    content: "Mỗi đơn vị máu đều mang ý nghĩa to lớn. Cảm ơn tất cả những người hiến máu tình nguyện.",
                    avatar: "👩‍⚕️"
                  },
                  {
                    name: "Lê Văn C",
                    role: "Bệnh nhân được cứu",
                    content: "Tôi còn sống đến hôm nay nhờ những người hiến máu tốt bụng. Cảm ơn các bạn rất nhiều!",
                    avatar: "👨‍🦳"
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="card p-6 text-center">
                    <div className="text-4xl mb-4">{testimonial.avatar}</div>
                    <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" ref={contactRef} className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Liên hệ với <span className="gradient-text">chúng tôi</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Có câu hỏi về hiến máu? Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Phone,
                  title: "Hotline 24/7",
                  info: CONTACT_INFO.HOTLINE,
                  description: "Gọi ngay để được tư vấn",
                  color: "from-green-500 to-emerald-500",
                  action: () => window.open(`tel:${CONTACT_INFO.HOTLINE}`)
                },
                {
                  icon: Mail,
                  title: "Email hỗ trợ",
                  info: CONTACT_INFO.EMAIL,
                  description: "Gửi câu hỏi qua email",
                  color: "from-blue-500 to-cyan-500",
                  action: () => window.open(`mailto:${CONTACT_INFO.EMAIL}`)
                },
                {
                  icon: MapPin,
                  title: "Địa chỉ trung tâm",
                  info: CONTACT_INFO.ADDRESS,
                  description: "Đến trực tiếp để hiến máu",
                  color: "from-red-500 to-pink-500",
                  action: () => window.open(`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.ADDRESS)}`)
                }
              ].map((contact, index) => (
                <div
                  key={index}
                  className="card card-hover group p-6 cursor-pointer"
                  onClick={contact.action}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.title}</h3>
                  <p className="text-lg font-semibold text-red-600 mb-2">{contact.info}</p>
                  <p className="text-gray-600">{contact.description}</p>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="card p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gửi tin nhắn cho chúng tôi</h3>
                <ContactForm />
              </div>
            </div>

            <div className="mt-16 gradient-bg rounded-2xl p-8 text-center text-white relative overflow-hidden">
              <div className="relative z-10">
                <Heart className="w-12 h-12 mx-auto mb-4" fill="currentColor" />
                <h3 className="text-2xl font-bold mb-4">Cần máu khẩn cấp?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Liên hệ ngay với chúng tôi để được hỗ trợ tìm kiếm máu khẩn cấp
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => window.open(`tel:${CONTACT_INFO.HOTLINE}`)}
                >
                  Gọi ngay: {CONTACT_INFO.HOTLINE}
                </Button>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            <div className="mt-20">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Câu hỏi <span className="text-red-500">thường gặp</span>
              </h3>
              <FAQ />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
                  <span className="text-xl font-bold">BloodConnect</span>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Kết nối những trái tim nhân ái, mang lại hy vọng sống cho những người đang cần.
                  Cùng nhau xây dựng một cộng đồng yêu thương và chia sẻ.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, href: SOCIAL_LINKS.FACEBOOK, color: 'hover:bg-blue-600' },
                    { icon: Twitter, href: SOCIAL_LINKS.TWITTER, color: 'hover:bg-blue-400' },
                    { icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, color: 'hover:bg-pink-600' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center ${social.color} transition-colors`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4">Liên kết nhanh</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Trang chủ', action: () => handleNavClick('home') },
                    { label: 'Giới thiệu', action: () => handleNavClick('about') },
                    { label: 'Đăng ký hiến máu', action: () => handleAuthClick('register') },
                    { label: 'Tìm điểm hiến máu', action: () => handleNavClick('contact') },
                    { label: 'Câu hỏi thường gặp', action: () => handleNavClick('contact') }
                  ].map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={link.action}
                        className="text-gray-400 hover:text-white transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4">Liên hệ</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-gray-400">{CONTACT_INFO.HOTLINE}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-gray-400 break-all">{CONTACT_INFO.EMAIL}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-400">{CONTACT_INFO.ADDRESS}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-gray-400">{CONTACT_INFO.WORKING_HOURS}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-sm">
                © 2025 BloodConnect. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {[
                  'Chính sách bảo mật',
                  'Điều khoản sử dụng',
                  'Hỗ trợ'
                ].map((link, index) => (
                  <button
                    key={index}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                    onClick={() => console.log(`Navigate to ${link}`)}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 gradient-bg rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-40 animate-fade-in"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <a
        href={`https://wa.me/${CONTACT_INFO.HOTLINE.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-40 animate-pulse"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Họ tên là bắt buộc';
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.subject.trim()) newErrors.subject = 'Chủ đề là bắt buộc';
    if (!formData.message.trim()) newErrors.message = 'Tin nhắn là bắt buộc';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Nhập họ và tên"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Nhập email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chủ đề *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
            placeholder="Nhập chủ đề"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tin nhắn *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`input-field ${errors.message ? 'border-red-500' : ''}`}
          placeholder="Nhập tin nhắn của bạn..."
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <div className="text-center">
        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          icon={<Mail />}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
        </Button>
      </div>
    </form>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Ai có thể hiến máu?",
      answer: "Người từ 18-60 tuổi, cân nặng từ 45kg trở lên, có sức khỏe tốt và không mắc các bệnh lý nguy hiểm có thể hiến máu."
    },
    {
      question: "Bao lâu tôi có thể hiến máu một lần?",
      answer: "Nam giới có thể hiến máu 4 tháng/lần, nữ giới 6 tháng/lần. Điều này đảm bảo cơ thể có đủ thời gian phục hồi."
    },
    {
      question: "Hiến máu có đau không?",
      answer: "Quá trình hiến máu chỉ gây đau nhẹ khi kim châm vào da, tương tự như tiêm thuốc thông thường. Sau đó bạn sẽ không cảm thấy đau."
    },
    {
      question: "Tôi có thể hiến máu khi đang uống thuốc không?",
      answer: "Tùy thuộc vào loại thuốc. Một số thuốc không ảnh hưởng, nhưng bạn nên thông báo với bác sĩ để được tư vấn cụ thể."
    },
    {
      question: "Sau khi hiến máu, tôi cần chú ý gì?",
      answer: "Nghỉ ngơi 10-15 phút, uống nhiều nước, tránh vận động mạnh trong 24h đầu và ăn đủ chất dinh dưỡng."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="card overflow-hidden">
          <button
            className="w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-between"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span>{faq.question}</span>
            <ChevronRight
              className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-90' : ''
                }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-6 pb-4 text-gray-600 animate-slide-up">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Landing;