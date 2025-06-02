// const Cart = require('../models/Cart');

// // 🟢 Tạo giỏ hàng mới (thường chỉ cần 1 lần, khi user đăng ký hoặc lần đầu mua)
// exports.createCart = async (req, res) => {
//   try {
//     const existingCart = await Cart.findOne({ user: req.body.user });
//     if (existingCart) return res.status(400).json({ message: 'Cart already exists for this user' });

//     const cart = new Cart(req.body);
//     const savedCart = await cart.save();
//     res.status(201).json(savedCart);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // 🔵 Lấy giỏ hàng của người dùng
// exports.getCartByUser = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });
//     res.status(200).json(cart);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // 🟠 Cập nhật giỏ hàng (ví dụ: thêm, sửa, xoá sản phẩm)
// exports.updateCart = async (req, res) => {
//   try {
//     const updatedCart = await Cart.findOneAndUpdate(
//       { user: req.params.userId },
//       { ...req.body, updatedAt: Date.now() },
//       { new: true }
//     );
//     if (!updatedCart) return res.status(404).json({ message: 'Cart not found' });
//     res.status(200).json(updatedCart);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // 🔴 Xoá giỏ hàng của người dùng (ví dụ khi đặt hàng xong)
// exports.deleteCart = async (req, res) => {
//   try {
//     const deletedCart = await Cart.findOneAndDelete({ user: req.params.userId });
//     if (!deletedCart) return res.status(404).json({ message: 'Cart not found' });
//     res.status(200).json({ message: 'Cart deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



const Cart = require('../models/Cart');

// 🟢 POST - Tạo giỏ hàng mới
exports.createCart = async (req, res) => {
  try {
    const { user, items } = req.body;

    // Kiểm tra nếu user đã có cart
    const existingCart = await Cart.findOne({ user });
    if (existingCart) {
      return res.status(400).json({ message: 'User already has a cart.' });
    }

    // Tạo mới cart
    const newCart = new Cart({
      user,
      items: items || [],
      updatedAt: Date.now()
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 🔵 GET - Lấy giỏ hàng của một người dùng (theo userId)
exports.getCartByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Ghi log để debug nếu cần
    console.log("📥 Đang tìm giỏ hàng cho user ID:", userId);

    // Tìm giỏ hàng theo user
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng cho người dùng này.' });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", err.message);
    res.status(500).json({ error: err.message });
  }
};
