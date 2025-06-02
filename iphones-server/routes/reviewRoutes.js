const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET - Lấy tất cả đánh giá
router.get('/',reviewController.getReviews);

// GET - Lấy danh sách đánh giá theo sản phẩm
router.get('/product/:productId', reviewController.getReviewsByProduct);


// POST - Đánh giá sản phẩm
router.post('/product/:productId', reviewController.addReview);


// Tạo mới đánh giá
// router.post('/', reviewController.createReview);



// (Tuỳ chọn) Lấy đánh giá theo user
router.get('/user/:userId', reviewController.getReviewsByUser);

// Cập nhật review theo ID
router.put('/:id', reviewController.updateReview);

// Xoá review theo ID
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
