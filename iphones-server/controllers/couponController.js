const Coupon = require('../models/CouponModel');

// [POST] Tạo mới coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, expiresAt } = req.body;
    const coupon = new Coupon({ code, discount, expiresAt });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server khi tạo mã giảm giá' });
  }
};

// [GET] Lấy tất cả coupon
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ expiresAt: -1 });;
    res.json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server khi lấy danh sách mã giảm giá' });
  }
};

// [GET] Lấy 1 coupon theo id
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
    }
    res.json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server khi lấy mã giảm giá' });
  }
};

// [PUT] Cập nhật coupon theo id
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expiresAt } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discount, expiresAt },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Không tìm thấy mã giảm giá để cập nhật' });
    }

    res.json(updatedCoupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server khi cập nhật mã giảm giá' });
  }
};

// [DELETE] Xóa coupon theo id
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Không tìm thấy mã giảm giá để xóa' });
    }

    res.json({ message: 'Xóa mã giảm giá thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server khi xóa mã giảm giá' });
  }
};

// [POST] Kiểm tra mã giảm giá hợp lệ (xác minh code)
exports.verifyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(400).json({ message: 'Mã giảm giá không hợp lệ' });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
    }

    res.json({ discount: coupon.discount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server khi kiểm tra mã giảm giá' });
  }
};


