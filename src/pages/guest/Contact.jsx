import React, { useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, Heart,
  ChevronRight, MessageCircle
} from 'lucide-react';

import Button from '../../components/ui/Button';

import { CONTACT_INFO } from '../../utils/constants';

const Contact = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-16 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Liên hệ với <span className="gradient-text">chúng tôi</span>
            </h1>
            <p className="text-xl text-gray-600">
              Có câu hỏi về hiến máu? Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
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
              <div className="max-w-3xl mx-auto space-y-4">
                {[
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
                ].map((faq, index) => (
                  <div key={index} className="card overflow-hidden">
                    <button
                      className="w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    >
                      <span>{faq.question}</span>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${openFaqIndex === index ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-6 pb-4 text-gray-600 animate-slide-up">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default Contact;