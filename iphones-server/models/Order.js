const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  variantSku: String,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    zip: String,
    country: String
  },
  phone: String,
  status: { type: String, default: 'pending' },
  totalPrice: Number,
  paymentMethod: {
    type: String,
    enum: ['COD', 'BankTransfer', 'MoMo'], // Thêm MoMo
    required: true
  },
  paymentResult: {
    orderId: String,
    requestId: String,
    resultCode: Number,
    message: String,
    responseTime: String
  },
  paymentStatus: { // Thêm trường paymentStatus
    type: String,
    enum: ['unpaid', 'paid', 'failed', 'cancelled'], // Thêm 'failed' và 'cancelled'
    default: 'unpaid', // Mặc định là chưa thanh toán
  },
  paidAt : Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);