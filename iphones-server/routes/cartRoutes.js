// const express = require('express');
// const router = express.Router();
// const cartController = require('../controllers/cartController');

// // Tạo giỏ hàng mới
// router.post('/', cartController.createCart);

// // Lấy giỏ hàng theo userId
// router.get('/:userId', cartController.getCartByUser);

// // Cập nhật giỏ hàng theo userId
// router.put('/:userId', cartController.updateCart);

// // Xoá giỏ hàng theo userId
// router.delete('/:userId', cartController.deleteCart);

// module.exports = router;
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// Lấy giỏ hàng theo userId
router.get('/:userId', cartController.getCartByUser);
// Tạo giỏ hàng mới
router.post('/', cartController.createCart);

module.exports = router;

