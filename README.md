# Blood Donation System - API Flow Analysis

## 1. **Luồng Đăng ký & Đăng nhập User**

### Flow: User Registration & Authentication
```
1. authService.register(userData)
   - Input: email, password, fullName, phoneNumber
   
2. authService.login(credentials)  
   - Input: email, password
   
3. authService.getCurrentUser()
   - Lấy thông tin user sau khi đăng nhập
```

---

## 2. **Luồng Tạo Health Check cho User**

### Flow: Health Check Creation
```
1. userService.getCurrentUser()
   - Lấy thông tin user hiện tại
   
2. healthCheckService.createHealthCheck(userId, healthCheckData)
   - Input: pulse, bloodPressure, resultSummary, isEligible, bloodTypeId
   
3. healthCheckService.getUserHealthChecks(userId, page, size)
   - Xem lịch sử health check của user
```

---

## 3. **Luồng Đặt lịch hẹn hiến máu**

### Flow: Appointment Booking
```
1. userService.getCurrentUser()
   - Xác định user hiện tại
   
2. appointmentService.createAppointment(appointmentData)
   - Input: appointmentDate
   
3. appointmentService.getUserAppointments(userId, page, size)
   - Xem danh sách appointments của user
   
4. appointmentService.updateAppointmentStatus(appointmentId, "SCHEDULED")
   - Staff xác nhận lịch hẹn
```

---

## 4. **Luồng Health Check tại Appointment**

### Flow: Pre-Donation Health Check
```
1. appointmentService.getAppointmentById(appointmentId)
   - Lấy thông tin appointment
   
2. appointmentService.createAppointmentHealthCheck(appointmentId, healthCheckData)
   - Tạo health check tại appointment
   - Input: pulse, bloodPressure, isEligible, bloodTypeId
   
3. appointmentService.getAppointmentHealthCheck(appointmentId)
   - Xem kết quả health check
   
4. appointmentService.updateAppointmentStatus(appointmentId, "COMPLETED")
   - Hoàn thành appointment nếu đủ điều kiện
```

---

## 5. **Luồng Hiến máu thực tế**

### Flow: Blood Donation Process
```
1. appointmentService.getAppointmentHealthCheck(appointmentId)
   - Kiểm tra kết quả health check
   
2. bloodDonationService.createBloodDonation(donationData)
   - Input: user, donationDate, bloodType, bloodComponent, volumeMl, healthCheck
   
3. inventoryService.createInventory(inventoryData)
   - Thêm máu vào kho
   - Input: bloodType, bloodComponent, quantity
   
4. bloodDonationService.getBloodDonationById(donationId)
   - Xác nhận donation đã được tạo
```

---

## 6. **Luồng Yêu cầu máu từ bệnh viện**

### Flow: Blood Request Process
```
1. bloodRequestService.createBloodRequest(requestData)
   - Input: bloodTypeId, bloodComponentId, allocations, urgencyLevel
   
2. bloodRequestService.getRequestInventory(requestId, page, size)
   - Kiểm tra inventory có sẵn cho request
   
3. bloodRequestInventoryService.createBloodRequestInventory(requestInventoryData)
   - Liên kết request với inventory cụ thể
   - Input: bloodRequestId, inventoryId, quantity
   
4. bloodRequestService.allocateBloodRequest(requestId)
   - Phân bổ máu cho request
   
5. inventoryService.updateInventory(inventoryId, updatedData)
   - Cập nhật số lượng trong kho sau khi phân bổ
```

---

## 7. **Luồng Tìm kiếm người hiến máu gần đó**

### Flow: Nearby Donor Search
```
1. userService.getCurrentUser()
   - Lấy thông tin user hiện tại
   
2. bloodTypeService.getBloodTypes(page, size)
   - Lấy danh sách blood types để chọn
   
3. distanceSearchService.searchNearbyDonors(searchData)
   - Input: userId, bloodTypeId, latitude, longitude, distanceKM
   
4. distanceSearchService.getUserSearchHistory(userId)
   - Xem lịch sử tìm kiếm
```

---

## 8. **Luồng Quản lý Reminder**

### Flow: Reminder Management
```
1. userService.getCurrentUser()
   - Xác định user
   
2. reminderService.createReminder(reminderData)
   - Input: userId, nextDate, reminderType, message
   
3. reminderService.getUserReminders(userId, page, size)
   - Xem reminders của user
   
4. reminderService.updateReminder(reminderId, reminderData)
   - Cập nhật reminder
   
5. reminderService.deleteReminder(reminderId)
   - Xóa reminder đã hết hạn
```

---

## 9. **Luồng Dashboard & Báo cáo (Admin/Staff)**

### Flow: Administrative Dashboard
```
1. authService.getCurrentUser()
   - Kiểm tra role (Admin/Staff)
   
2. userService.getUsers(page, size)
   - Lấy danh sách users
   
3. bloodDonationService.getBloodDonations(page, size)
   - Thống kê donations
   
4. inventoryService.getInventories(page, size)
   - Kiểm tra tồn kho
   
5. bloodRequestService.getBloodRequests(page, size)
   - Quản lý requests
   
6. appointmentService.filterAppointments(filters)
   - Lọc appointments theo điều kiện
```

---

## 10. **Luồng Quản lý Users gần đó**

### Flow: Nearby User Management
```
1. userService.getCurrentUser()
   - Lấy vị trí user hiện tại
   
2. userService.getNearbyUsers(lat, lon, radiusKm, page, size)
   - Tìm users trong bán kính
   
3. userService.getUserById(userId)
   - Xem chi tiết user cụ thể
```

---

## **Các luồng tích hợp phức tạp:**

### **A. Luồng hoàn chỉnh từ đặt lịch đến hiến máu:**
```
User Registration → Login → Create Appointment → Health Check → Blood Donation → Update Inventory → Create Reminder
```

### **B. Luồng yêu cầu máu khẩn cấp:**
```
Create Emergency Blood Request → Search Nearby Donors → Check Inventory → Allocate Blood → Update Stock
```

### **C. Luồng quản lý định kỳ:**
```
Get User Reminders → Create New Appointments → Filter Pending Appointments → Update Status → Generate Reports
```

---

## **Lưu ý quan trọng:**

1. **Authentication**: Hầu hết APIs cần authentication token
2. **Role-based Access**: Admin/Staff có quyền access nhiều APIs hơn
3. **Error Handling**: Mỗi bước cần xử lý error appropriately
4. **Data Validation**: Validate input trước khi call API
5. **Pagination**: Sử dụng pagination cho lists có nhiều data