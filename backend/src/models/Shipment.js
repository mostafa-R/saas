const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'الوصف مطلوب'],
    },
    origin: {
      type: String,
      required: [true, 'مكان الانطلاق مطلوب'],
    },
    destination: {
      type: String,
      required: [true, 'مكان الوصول مطلوب'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-Transit', 'delivered'],
      default: 'pending',
    },
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
