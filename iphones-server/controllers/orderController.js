// const Order = require('../models/Order'); // Đường dẫn đến model Order
// const mongoose = require('mongoose');

// // // Tạo đơn hàng
// exports.createOrder = async (req, res) => {
//   try {
//     const { shippingAddress, user, orderItems, phone, status, totalPrice, paymentMethod } = req.body;

//     // Kiểm tra user ID hợp lệ
//     if (!mongoose.Types.ObjectId.isValid(user)) {
//       return res.status(400).json({ error: 'ID người dùng không hợp lệ' });
//     }

//     if (!['COD', 'BankTransfer', 'MoMo'].includes(paymentMethod || 'COD')) {
//       return res.status(400).json({ error: 'Phương thức thanh toán không hợp lệ. Chỉ chấp nhận COD, BankTransfer hoặc MoMo.' });
//     }
    

//     // Kiểm tra từng mục trong orderItems
//     orderItems.forEach((item, index) => {
//       if (!mongoose.Types.ObjectId.isValid(item.product)) {
//         throw new Error(`Sản phẩm tại vị trí ${index} có ID không hợp lệ.`);
//       }
//       if (!item.variantSku || typeof item.variantSku !== 'string') {
//         throw new Error(`Sản phẩm tại vị trí ${index} thiếu SKU hoặc SKU không hợp lệ.`);
//       }
//       if (!item.quantity || typeof item.quantity !== 'number') {
//         throw new Error(`Sản phẩm tại vị trí ${index} thiếu số lượng hoặc số lượng không hợp lệ.`);
//       }
//     });

//     const order = new Order({
//       shippingAddress,
//       user,
//       orderItems,
//       phone,
//       status: status || 'pending',
//       totalPrice,
//       paymentMethod: paymentMethod || 'COD'
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   } catch (err) {
//     console.error('Lỗi khi tạo đơn hàng:', err.message);
//     res.status(500).json({ error: 'Lỗi server: ' + err.message });
//   }
// };

// // 🟢 Xác nhận đơn hàng (admin)
// exports.confirmOrder = async (req, res) => {
//   try {
//     const orderId = req.params.id;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { status: 'confirmed' },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     res.status(200).json(updatedOrder);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // PUT - Cập nhật trạng thái đơn hàng (admin)
// exports.updateOrderStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status: newStatus } = req.body;

//   const order = await Order.findById(id);
//   if (!order) {
//     return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
//   }

//   // Kiểm tra logic chuyển đổi trạng thái
//   const validTransitions = {
//     pending: ["confirmed", "cancelled"],
//     confirmed: ["delivering", "cancelled"],
//     delivering: ["completed"],
//     completed: [],
//     cancelled: [],
//   };

//   if (!validTransitions[order.status]?.includes(newStatus)) {
//     return res.status(400).json({ message: "Chuyển đổi trạng thái không hợp lệ." });
//   }

//   // Cập nhật trạng thái
//   order.status = newStatus;
//   order.updatedAt = Date.now();
//   await order.save();

//   // Populate user trước khi trả về
//   const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

//   res.json(populatedOrder);
// };


// // Hủy đơn hàng (cancel)
// exports.cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
//     }

//     if (order.status === "pending") {
//       order.status = "cancelled"; // Chuyển trạng thái sang hủy
//       await order.save();
//       res.status(200).json({ message: "Đơn hàng đã được hủy." });
//     } else {
//       res.status(400).json({ message: "Không thể hủy đơn hàng đã xử lý." });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server: " + err.message });
//   }
// };



// // 🆕 Lấy tất cả đơn hàng theo ID người dùng
// exports.getOrdersByUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     console.log('Đang lấy đơn hàng cho userId:', userId);

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       console.log('Định dạng userId không hợp lệ:', userId);
//       return res.status(400).json({ error: 'Định dạng ID người dùng không hợp lệ' });
//     }

//     const orders = await Order.find({ user: userId })
//       .populate('orderItems.product', 'name description price')
//       .populate('user', 'name email phone')
//       .sort({ createdAt: -1 });  // Sắp xếp theo thời gian tạo đơn hàng (mới nhất trước)

//     console.log('Số đơn hàng tìm thấy:', orders.length);

//     if (!orders || orders.length === 0) {
//       console.log('Không tìm thấy đơn hàng cho userId:', userId);
//       return res.status(404).json({ message: `Không tìm thấy đơn hàng cho người dùng với ID ${userId}` });
//     }

//     res.status(200).json(orders);
//   } catch (err) {
//     console.error('Lỗi khi lấy đơn hàng:', err.message);
//     res.status(500).json({ error: 'Lỗi server: ' + err.message });
//   }
// };
// // // 🔵 Lấy tất cả đơn hàng
// // exports.getAllOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find().populate('user').populate('orderItems.product');
// //     res.status(200).json(orders);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // 🔵 Lấy tất cả đơn hàng (sắp xếp theo đơn hàng mới nhất)
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('user')
//       .populate('orderItems.product')
//       .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo giảm dần (mới nhất trước)

//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // 🟡 Lấy đơn hàng theo ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('user')
//       .populate('orderItems.product');

//     if (!order) return res.status(404).json({ error: 'Order not found' });

//     res.status(200).json(order);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // 🟠 Cập nhật đơn hàng
// exports.updateOrder = async (req, res) => {
//   try {
//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, updateAt: Date.now() } // Cập nhật thời gian cập nhật

//     );

//     if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

//     res.status(200).json(updatedOrder);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // 🔴 Xoá đơn hàng
// exports.deleteOrder = async (req, res) => {
//   try {
//     const deletedOrder = await Order.findByIdAndDelete(req.params.id);

//     if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });

//     res.status(200).json({ message: 'Order deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // Xử lý cập nhật trạng thái đơn hàng sau khi thanh toán thành công
// exports.updateOrderStatusToPaidAndDelivering = async (req, res) => {
//   const { orderId } = req.params; // Lấy orderId từ URL params

//   try {
//     // Tìm đơn hàng theo orderId
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Đơn hàng không tồn tại!" });
//     }

//     // Kiểm tra trạng thái đơn hàng hiện tại (phải là "pending")
//     if (order.status !== "pending") {
//       return res.status(400).json({ message: "Đơn hàng không trong trạng thái chờ xử lý." });
//     }

//     // Cập nhật trạng thái đơn hàng thành "delivering" và thanh toán thành "paid"
//     order.status = "delivering"; // Cập nhật trạng thái đơn hàng thành "delivering"
//     order.paymentStatus = "paid"; // Cập nhật trạng thái thanh toán thành "paid"
//     order.updatedAt = Date.now(); // Cập nhật thời gian thay đổi

//     // Lưu thay đổi vào cơ sở dữ liệu
//     await order.save();

//     // Trả về kết quả thành công
//     res.status(200).json({ message: "Đơn hàng đã được thanh toán và đang giao!", order });
//   } catch (error) {
//     console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
//     res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng." });
//   }
// };

// // PUT /api/orders/:id/payment
// exports.paymentStatusPaid =  async (req, res) => {
//   const { id } = req.params;
//   try {
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
//     }

//     if (order.paymentStatus === 'paid') {
//       return res.status(400).json({ message: 'Đơn hàng đã được thanh toán trước đó.' });
//     }

//     // Cập nhật trạng thái thanh toán thành "paid"
//     order.paymentStatus = 'paid';
//     order.status = 'confirmed'; // Cập nhật trạng thái đơn hàng thành "confirmed"
//     await order.save();

//     res.status(200).json({ message: 'Thanh toán thành công! Đơn hàng đã được cập nhật thành "paid".', order });
//   } catch (error) {
//     console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
//     res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái thanh toán.' });
//   }
// };



const Order = require('../models/Order');
const mongoose = require('mongoose');

// ✅ Tạo đơn hàng
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, user, orderItems, phone, status, totalPrice, paymentMethod } = req.body;

    // Kiểm tra user hợp lệ
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: 'ID người dùng không hợp lệ' });
    }

    const allowedMethods = ['COD', 'BankTransfer', 'MoMo'];
    if (!allowedMethods.includes(paymentMethod || 'COD')) {
      return res.status(400).json({ error: 'Phương thức thanh toán không hợp lệ.' });
    }

    // Kiểm tra các mục trong đơn hàng
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ error: `Sản phẩm vị trí ${i} có ID không hợp lệ.` });
      }
      if (!item.variantSku || typeof item.variantSku !== 'string') {
        return res.status(400).json({ error: `SKU tại vị trí ${i} không hợp lệ.` });
      }
      if (!item.quantity || typeof item.quantity !== 'number') {
        return res.status(400).json({ error: `Số lượng tại vị trí ${i} không hợp lệ.` });
      }
    }

    const order = new Order({
      shippingAddress,
      user,
      orderItems,
      phone,
      status: status || 'pending',
      totalPrice,
      paymentMethod: paymentMethod || 'COD'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error('Lỗi tạo đơn hàng:', err.message);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
};

// // ✅ Cập nhật trạng thái đơn hàng
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status: newStatus } = req.body;

//     const order = await Order.findById(id);
//     if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

//     const validTransitions = {
//       pending: ['confirmed', 'cancelled'],
//       confirmed: ['delivering', 'cancelled'],
//       delivering: ['completed'],
//       completed: [],
//       cancelled: [],
//     };

//     if (!validTransitions[order.status]?.includes(newStatus)) {
//       return res.status(400).json({ message: 'Chuyển đổi trạng thái không hợp lệ.' });
//     }

//     order.status = newStatus;
//     order.updatedAt = Date.now();
//     await order.save();

//     const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
//     res.json(populatedOrder);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus, paymentStatus, paidAt } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['delivering', 'cancelled'],
      delivering: ['completed'],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(newStatus)) {
      return res.status(400).json({ message: 'Chuyển đổi trạng thái không hợp lệ.' });
    }

    // Cập nhật trạng thái đơn hàng
    order.status = newStatus;

    // Nếu đơn hoàn thành mà chưa thanh toán, cập nhật trạng thái thanh toán
    if (newStatus === 'completed' && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      if (!order.paidAt) {
        order.paidAt = paidAt ? new Date(paidAt) : new Date();
      }
    }

    order.updatedAt = Date.now();
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
    res.json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

    if (order.status === 'pending') {
      order.status = 'cancelled';
      await order.save();
      res.status(200).json({ message: 'Đơn hàng đã được hủy.' });
    } else {
      res.status(400).json({ message: 'Không thể hủy đơn hàng đã xử lý.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server: ' + err.message });
  }
};

// ✅ Lấy đơn hàng theo người dùng
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID người dùng không hợp lệ' });
    }

    const orders = await Order.find({ user: userId })
      .populate('orderItems.product', 'name description price')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: `Không tìm thấy đơn hàng cho người dùng ID ${userId}` });
    }

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
};

// ✅ Lấy tất cả đơn hàng (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('orderItems.product');

    if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Cập nhật đơn hàng (admin)
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Xóa đơn hàng (admin)
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

    res.status(200).json({ message: 'Xóa đơn hàng thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Cập nhật trạng thái sau khi thanh toán MoMo/VNPay thành công
exports.updateOrderStatusToPaidAndDelivering = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;  // 'confirmed' hoặc 'cancelled'

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại!' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Đơn hàng không trong trạng thái chờ xử lý.' });
    }

    // Cập nhật trạng thái đơn hàng theo paymentStatus
    if (status === 'cancelled') {
      order.status = 'cancelled';
      order.paymentStatus = 'failed';  // Đảm bảo paymentStatus là 'failed' khi hủy đơn
    } else if (status === 'confirmed') {
      order.status = 'confirmed';
      order.paymentStatus = 'paid';  // Đảm bảo paymentStatus là 'paid' khi thanh toán thành công
      order.paidAt = Date.now();  // Ghi lại thời gian thanh toán
    } else {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    }

    order.updatedAt = Date.now();

    await order.save();

    res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công!', order });
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err.message);
    res.status(500).json({ message: 'Lỗi server: ' + err.message });
  }
};


