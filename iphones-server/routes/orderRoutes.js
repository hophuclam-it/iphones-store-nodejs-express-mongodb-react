// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');

// // CRUD routes cho Order
// router.post('/', orderController.createOrder);         // Tạo đơn hàng
// router.get('/', orderController.getAllOrders);         // Lấy tất cả đơn hàng
// router.get('/:id', orderController.getOrderById);      // Lấy đơn hàng theo ID
// router.get('/user/:userId', orderController.getOrdersByUser); // Lấy đơn theo user
// router.put('/confirm/:id', orderController.confirmOrder);// Admin xác nhận đơn hàng
// router.put('/:id', orderController.updateOrder);       // Cập nhật đơn hàng
// router.delete('/:id', orderController.deleteOrder);    // Xoá đơn hàng


// router.put('/:id/status', orderController.updateOrderStatus); // Cập nhật trạng thái đơn hàng
// router.put('/:id/cancel', orderController.cancelOrder); // hủy đơn hàng



// router.put("/:orderId/paid", orderController.updateOrderStatusToPaidAndDelivering);
// router.put("/:orderId/delivering", orderController.updateOrderStatusToDelivering); // Cập nhật trạng thái đơn hàng thành "delivering"


  
// module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// ======= 1. Tạo đơn hàng =======
router.post('/', orderController.createOrder);

// ======= 2. Lấy đơn hàng =======
// Lấy tất cả đơn hàng (admin)
router.get('/', orderController.getAllOrders);

// Lấy đơn hàng theo ID
router.get('/:id', orderController.getOrderById);

// Lấy đơn hàng theo user ID
router.get('/user/:userId', orderController.getOrdersByUser);

// ======= 3. Cập nhật đơn hàng =======
// Cập nhật toàn bộ đơn hàng (admin)
router.put('/:id', orderController.updateOrder);

// Cập nhật trạng thái đơn hàng (pending → confirmed → delivering → completed)
router.put('/:id/status', orderController.updateOrderStatus);

// Cập nhật trạng thái đơn sau khi thanh toán thành công (MoMo, VNPay)
router.put('/:orderId/paid', orderController.updateOrderStatusToPaidAndDelivering);

// ======= 4. Hủy đơn hàng (nếu đang pending) =======
router.put('/:id/cancel', orderController.cancelOrder);

// ======= 5. Xóa đơn hàng (admin) =======
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
