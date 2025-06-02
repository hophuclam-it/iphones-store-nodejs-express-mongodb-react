const express = require('express');
const router = express.Router();
// const Coupon = require('../models/CouponModel');
// const { route } = require('./index.routes');
const couponController = require('../controllers/couponController');

// // [POST] Tạo mã giảm giá mới
// router.post('/', async (req, res) => {
//   try {
//     const { code, discount, expiresAt } = req.body;
//     const newCoupon = new Coupon({ code, discount, expiresAt });
//     await newCoupon.save();
//     res.status(201).json({ message: 'Tạo mã giảm giá thành công', coupon: newCoupon });
//   } catch (error) {
//     res.status(500).json({ message: 'Tạo mã thất bại', error: error.message });
//     console.log(error);
    
//   }
// });

// // [GET] Lấy toàn bộ danh sách mã giảm giá
// router.get('/', async (req, res) => {
//   try {
//     const coupons = await Coupon.find();
//     res.json(coupons);
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server', error: error.message });
//   }
// });

// // [PUT] Cập nhật mã giảm giá theo ID
// router.put('/:id', async (req, res) => {
//   try {
//     const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!coupon) return res.status(404).json({ message: 'Không tìm thấy mã' });
//     res.json({ message: 'Cập nhật thành công', coupon });
//   } catch (error) {
//     res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
//   }
// });

// // [DELETE] Xóa mã giảm giá theo ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const coupon = await Coupon.findByIdAndDelete(req.params.id);
//     if (!coupon) return res.status(404).json({ message: 'Không tìm thấy mã' });
//     res.json({ message: 'Xóa thành công' });
//   } catch (error) {
//     res.status(500).json({ message: 'Xóa thất bại', error: error.message });
//   }
// });

router.get('/', couponController.getAllCoupons );
router.get('/:id', couponController.getCouponById);
router.post('/', couponController.createCoupon);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
