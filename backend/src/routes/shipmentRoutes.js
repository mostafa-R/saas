const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createShipment,
  getShipments,
  assignCarrier,
  updateShipmentStatus,
  getShipmentById
} = require('../controllers/shipmentController');

// 1️⃣ إنشاء شحنة (فقط للشاحن Shipper)
router.post('/', protect, authorize('shipper'), createShipment);

// 2️⃣ جلب الشحنات (Shippe/Carrier/Admin كل واحد حسب صلاحياته داخل الكنترولر)
router.get('/', protect, getShipments);

// جلب شحنة معينة بالتفصيل
router.get('/:id', protect, getShipmentById);

// 3️⃣ إسناد شحنة لناقل (فقط للأدمن Admin)
router.put('/assign', protect, authorize('admin'), assignCarrier);

// 4️⃣ تحديث حالة الشحنة (Carrier assigned أو Admin)
router.put('/:id/status', protect, authorize('carrier', 'admin'), updateShipmentStatus);

module.exports = router;
