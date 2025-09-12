const Shipment = require('../models/Shipment');

// إنشاء شحنة (للشاحن فقط)
exports.createShipment = async (req, res) => {
  try {
    const { description, origin, destination } = req.body;

    const shipment = await Shipment.create({
      description,
      origin,
      destination,
      shipper: req.user._id, // المستخدم الحالي هو الشاحن
    });

    res.status(201).json({ success: true, shipment });
  } catch (err) {
    console.error('❌ Create Shipment error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// جلب كل الشحنات (Admin يشوف الكل - Carrier يشوف اللي معاه - Shipper يشوف بتاعته)
exports.getShipments = async (req, res) => {
  try {
    let shipments;

    if (req.user.role === 'admin') {
      shipments = await Shipment.find().populate('shipper carrier', 'name email role');
    } else if (req.user.role === 'carrier') {
      shipments = await Shipment.find({ carrier: req.user._id }).populate('shipper carrier', 'name email role');
    } else if (req.user.role === 'shipper') {
      shipments = await Shipment.find({ shipper: req.user._id }).populate('shipper carrier', 'name email role');
    }

    res.json({ success: true, shipments });
  } catch (err) {
    console.error('❌ Get Shipments error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// جلب شحنة معينة بالتفصيل
exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('shipper', 'name email role')
      .populate('carrier', 'name email role');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: `Shipment with ID ${req.params.id} not found`
      });
    }

    res.json({ success: true, shipment });
  } catch (err) {
    console.error('❌ Get Shipment By ID error:', err);

    // لو الـ ObjectId مش صحيح
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipment ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// إسناد شحنة لناقل (Admin فقط)
exports.assignCarrier = async (req, res) => {
  try {
    const { shipmentId, carrierId } = req.body;

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'الشحنة غير موجودة' });
    }

    // التحقق إن الشحنة لسه مش متخصصة لناقل
    if (shipment.carrier) {
      return res.status(400).json({ success: false, message: 'تم إسناد هذه الشحنة بالفعل لناقل' });
    }

    shipment.carrier = carrierId;
    shipment.status = 'in-progress';
    await shipment.save();

    res.json({ success: true, message: 'تم إسناد الشحنة للناقل بنجاح', shipment });
  } catch (err) {
    console.error('❌ Assign Carrier error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
// تحديث حالة الشحنة (Carrier و Admin)
exports.updateShipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // تحقق إن فيه status
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    // قيم الحالات المسموح بيها
    const allowedStatuses = ['pending', 'in-Transit', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // البحث عن الشحنة
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // التحقق من الصلاحيات (carrier المخصص أو admin)
    if (
      req.user.role === 'carrier' &&
      (!shipment.carrier || shipment.carrier.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بتحديث حالة هذه الشحنة' });
    }

    // تحديث الحالة
    shipment.status = status;
    await shipment.save();

    res.json({ success: true, message: 'Shipment status updated', shipment });
  } catch (err) {
    console.error('❌ Update Shipment Status error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


// حذف شحنة (Admin فقط)
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }
    await shipment.remove();                            
    res.json({ success: true, message: 'Shipment deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Shipment error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
