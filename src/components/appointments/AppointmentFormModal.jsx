import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Info,
  Clock,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";
import { createAppointment } from "../../services/appointmentService";
import { createHealthDeclaration } from "../../services/healthDeclarationService";
import { getCurrentUser } from "../../services/userService";

const AppointmentFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
  });
  const [healthData, setHealthData] = useState({
    hasBloodTransmittedDisease: false,
    hasChronicDisease: false,
    currentMedications: "",
    hasTattooAcupuncture: false,
    hasRecentVaccine: false,
    hasTravelAbroad: false,
    hasUnsafeSex: false,
    isFirstBlood: false,
    isPregnantOrBreastfeeding: false,
    isMenstruating: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getCurrentUser()
        .then((res) => {
          if (res?.status === 200) {
            setUserData(res.data.data);
          }
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin user:", err);
        });
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleHealthChange = (field, value) => {
    setHealthData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Vui lòng chọn ngày hẹn";
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.appointmentDate = "Ngày hẹn không thể trong quá khứ";
      }

      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      if (selectedDate > threeMonthsLater) {
        newErrors.appointmentDate =
          "Chỉ có thể đặt lịch trong vòng 3 tháng tới";
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Vui lòng chọn giờ hẹn";
    } else {
      const [hours] = formData.appointmentTime.split(":").map(Number);
      if (hours < 8 || hours >= 17) {
        newErrors.appointmentTime = "Giờ hẹn phải trong khung 8:00 - 17:00";
      }
    }

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!healthData.currentMedications.trim()) {
      newErrors.currentMedications =
        'Vui lòng nhập thông tin thuốc đang sử dụng (nhập "Không" nếu không dùng thuốc)';
    }

    return newErrors;
  };

  const handleNextStep = () => {
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      handleNextStep();
      return;
    }

    const validationErrors = validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentDateTime = new Date(
        `${formData.appointmentDate}T${formData.appointmentTime}:00`
      );

      const appointmentResponse = await createAppointment({
        appointmentDate: appointmentDateTime.toISOString(),
      });
      if (
        appointmentResponse.status === 200 ||
        appointmentResponse.status === 201
      ) {
        const appointmentId = appointmentResponse.data.data.appointmentId;
        const healthDeclarationData = {
          appointmentId: appointmentId,
          hasBloodTransmittedDisease: healthData.hasBloodTransmittedDisease,
          hasChronicDisease: healthData.hasChronicDisease,
          currentMedications: healthData.currentMedications.trim(),
          hasTattooAcupuncture: healthData.hasTattooAcupuncture,
          hasRecentVaccine: healthData.hasRecentVaccine,
          hasTravelAbroad: healthData.hasTravelAbroad,
          hasUnsafeSex: healthData.hasUnsafeSex,
          isFirstBlood: healthData.isFirstBlood,
          isPregnantOrBreastfeeding:
            userData?.gender === "FEMALE"
              ? healthData.isPregnantOrBreastfeeding
              : null,
          isMenstruating:
            userData?.gender === "FEMALE" ? healthData.isMenstruating : null,
        };

        const healthResponse = await createHealthDeclaration(
          healthDeclarationData
        );

        if (healthResponse.status === 200 || healthResponse.status === 201) {
          toast.success("Đặt lịch hẹn thành công!");
          handleClose();
          if (onSubmit) onSubmit();
        } else {
          toast.error("Có lỗi xảy ra khi tạo khai báo y tế");
        }
      } else {
        toast.error("Có lỗi xảy ra khi đặt lịch hẹn");
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("Có lỗi xảy ra khi đặt lịch hẹn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCurrentStep(1);
      setFormData({
        appointmentDate: "",
        appointmentTime: "",
      });
      setHealthData({
        hasBloodTransmittedDisease: false,
        hasChronicDisease: false,
        currentMedications: "",
        hasTattooAcupuncture: false,
        hasRecentVaccine: false,
        hasTravelAbroad: false,
        hasUnsafeSex: false,
        isFirstBlood: true,
        isPregnantOrBreastfeeding: false,
        isMenstruating: false,
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  const timeSlots = [];
  for (let hour = 8; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            {currentStep === 1 ? (
              <Calendar className="w-5 h-5 text-blue-600" />
            ) : (
              <Heart className="w-5 h-5 text-red-600" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStep === 1
                  ? "Bước 1: Chọn thời gian"
                  : "Bước 2: Khai báo y tế"}
              </h3>
              <p className="text-sm text-gray-500">
                {currentStep === 1
                  ? "Chọn ngày và giờ hẹn"
                  : "Khai báo tình trạng sức khỏe"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                  }`}
              >
                1
              </div>
              <div
                className={`h-1 w-12 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
                  }`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                  }`}
              >
                2
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                      <div className="space-y-0.5">
                        <div>• Giờ làm việc: 8:00 - 17:00 (T2-CN)</div>
                        <div>• Nhân viên y tế sẽ tư vấn khi bạn đến</div>
                        <div>• Vui lòng đến đúng giờ hẹn</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) =>
                        handleInputChange("appointmentDate", e.target.value)
                      }
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.appointmentDate
                          ? "border-red-500"
                          : "border-gray-300"
                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      min={new Date().toISOString().split("T")[0]}
                      max={
                        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                    {errors.appointmentDate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.appointmentDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giờ hẹn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.appointmentTime}
                      onChange={(e) =>
                        handleInputChange("appointmentTime", e.target.value)
                      }
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.appointmentTime
                          ? "border-red-500"
                          : "border-gray-300"
                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <option value="">Chọn giờ</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {errors.appointmentTime && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.appointmentTime}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-2">
                    <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium mb-1">Khai báo y tế:</p>
                      <p>
                        Vui lòng khai báo trung thực để đảm bảo an toàn cho
                        người hiến và người nhận máu.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    💉 Tiền sử bệnh lý:
                  </h4>

                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={healthData.hasBloodTransmittedDisease}
                        onChange={(e) =>
                          handleHealthChange(
                            "hasBloodTransmittedDisease",
                            e.target.checked
                          )
                        }
                        className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Bạn có từng mắc các bệnh lây qua đường máu không? (HIV,
                        viêm gan B/C, giang mai…)
                      </span>
                    </label>

                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={healthData.hasChronicDisease}
                        onChange={(e) =>
                          handleHealthChange(
                            "hasChronicDisease",
                            e.target.checked
                          )
                        }
                        className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Bạn có đang điều trị bệnh mãn tính (tim mạch, tiểu
                        đường, huyết áp cao...) không?
                      </span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bạn có đang dùng thuốc không? (ghi rõ loại){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={healthData.currentMedications}
                        onChange={(e) =>
                          handleHealthChange(
                            "currentMedications",
                            e.target.value
                          )
                        }
                        placeholder="Nhập loại thuốc hoặc 'Không' nếu không dùng thuốc"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${errors.currentMedications
                            ? "border-red-500"
                            : "border-gray-300"
                          }`}
                      />
                      {errors.currentMedications && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.currentMedications}
                        </p>
                      )}
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 pt-4">
                    🏥 Hoạt động/tiền sử gần đây:
                  </h4>

                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={healthData.hasTattooAcupuncture}
                        onChange={(e) =>
                          handleHealthChange(
                            "hasTattooAcupuncture",
                            e.target.checked
                          )
                        }
                        className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Bạn có xăm mình, châm cứu, nhổ răng, phẫu thuật trong 6
                        tháng qua không?
                      </span>
                    </label>

                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={healthData.hasRecentVaccine}
                        onChange={(e) =>
                          handleHealthChange(
                            "hasRecentVaccine",
                            e.target.checked
                          )
                        }
                        className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Bạn có tiêm vaccine gần đây không?
                      </span>
                    </label>

                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={healthData.hasTravelAbroad}
                        onChange={(e) =>
                          handleHealthChange(
                            "hasTravelAbroad",
                            e.target.checked
                          )
                        }
                        className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Bạn có đi ra nước ngoài trong vòng 1 năm qua không?
                      </span>
                    </label>

                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={healthData.hasUnsafeSex}
                        onChange={(e) =>
                          handleHealthChange("hasUnsafeSex", e.target.checked)
                        }
                        className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Bạn có hành vi tình dục không an toàn không?
                      </span>
                    </label>
                  </div>

                  <h4 className="font-medium text-gray-900 pt-4">
                    ℹ️ Những thông tin khác:
                  </h4>

                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={healthData.isFirstBlood}
                        onChange={(e) =>
                          handleHealthChange("isFirstBlood", e.target.checked)
                        }
                        className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Đây có phải là lần đầu tiên hiến máu của bạn không?
                      </span>
                    </label>

                    {userData?.gender === "FEMALE" && (
                      <>
                        <h4 className="font-medium text-gray-900 pt-2">
                          👩 Dành cho phụ nữ:
                        </h4>

                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={healthData.isPregnantOrBreastfeeding}
                            onChange={(e) =>
                              handleHealthChange(
                                "isPregnantOrBreastfeeding",
                                e.target.checked
                              )
                            }
                            className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">
                            Có đang mang thai, cho con bú không?
                          </span>
                        </label>

                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={healthData.isMenstruating}
                            onChange={(e) =>
                              handleHealthChange(
                                "isMenstruating",
                                e.target.checked
                              )
                            }
                            className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">
                            Có đang trong kỳ kinh nguyệt không?
                          </span>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : currentStep === 1 ? (
                  <>
                    <span>Tiếp theo</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Đặt lịch hẹn"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFormModal;
