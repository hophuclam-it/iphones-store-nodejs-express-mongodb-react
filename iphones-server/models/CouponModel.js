const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,  // Đảm bảo rằng trường 'code' là bắt buộc
  },
  discount: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
