const Review = require('../models/Review');
const Product = require('../models/Product');
const updateAverageRating = require('../utils/updateAverageRating');

// GET - Trang đánh giá sản phẩm
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error: err.message });
  }
};


// // POST - Thêm đánh giá mới cho sản phẩm
// exports.addReview = async (req, res) => {
//   try {
//     // console.log('Body:', req.body); // Log body của request
//     // console.log('Product ID:', req.params.productId); // Log productId từ URL

//     const { rating, comment } = req.body;
//     const productId = req.params.productId; // Lấy productId từ URL
//     const userId = req.user.id || ""; // Lấy userId từ token (giả định bạn sử dụng xác thực)
//     // const userId = "67f61e7d56be44ba459da576"; // giả định

//     // Kiểm tra xem sản phẩm có tồn tại không
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
//     }

//     // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
//     const existingReview = await Review.findOne({ product: productId, user: userId });
//     if (existingReview) {
//       return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi.' });
//     }

//     // Tạo review mới
//     const review = await Review.create({
//       product: productId,
//       user: userId,
//       rating,
//       comment
//     });

//     // Thêm review vào mảng reviews của sản phẩm
//     await Product.findByIdAndUpdate(productId, {
//       $push: { reviews: review._id }
//     });

//     // Cập nhật điểm đánh giá trung bình và số lượng đánh giá
//     await updateAverageRating(productId);

//     res.status(201).json({ message: 'Đánh giá đã được thêm', review });
//   } catch (err) {
//     console.error('Lỗi khi thêm đánh giá:', err);
//     res.status(500).json({ message: 'Lỗi server', error: err.message });
//   }
// };

// // POST - Thêm đánh giá mới cho sản phẩm
// exports.addReview = async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const productId = req.params.productId;

//     // Kiểm tra dữ liệu đầu vào
//     if (!rating || !comment) {
//       return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin đánh giá.' });
//     }

//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({ message: 'Đánh giá phải nằm trong khoảng từ 1 đến 5 sao.' });
//     }

//     // Lấy userId từ token hoặc gán giá trị mặc định cho người dùng ẩn danh
//     const userId = req.user?.id || null; // Nếu không có user, gán null

//     // Kiểm tra xem sản phẩm có tồn tại không
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
//     }

//     // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
//     const existingReview = await Review.findOne({ product: productId, user: userId });
//     if (existingReview) {
//       return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi.' });
//     }

//     // Tạo review mới
//     const review = new Review({
//       product: productId,
//       user: userId,
//       rating,
//       comment,
//     });
//     await review.save();

//     // Thêm review vào mảng reviews của sản phẩm
//     product.reviews.push(review._id);
//     await product.save();

//     // Cập nhật điểm đánh giá trung bình và số lượng đánh giá
//     await updateAverageRating(productId);

//     res.status(201).json({ message: 'Đánh giá đã được thêm thành công.', review });
//   } catch (err) {
//     console.error('Lỗi khi thêm đánh giá:', err);
//     res.status(500).json({ message: 'Lỗi server.', error: err.message });
//   }
// };

// POST - Thêm đánh giá mới cho sản phẩm
exports.addReview = async (req, res) => {
  try {
    const { rating, comment, userId } = req.body; // Nhận thêm userId từ body
    const productId = req.params.productId;

    // Kiểm tra dữ liệu đầu vào
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin đánh giá.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Đánh giá phải nằm trong khoảng từ 1 đến 5 sao.' });
    }

    // Kiểm tra xem token có tồn tại không, nếu không có thì sử dụng userId trong body
    const user = req.user || { id: userId }; // Nếu có token, lấy từ token, nếu không thì lấy từ body

    if (!user.id) {
      return res.status(400).json({ message: 'Không có thông tin người dùng để thêm đánh giá.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await Review.findOne({ product: productId, user: user.id });
    if (existingReview) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi.' });
    }

    // Tạo review mới
    const review = new Review({
      product: productId,
      user: user.id, // Lưu userId vào review
      rating,
      comment,
    });
    await review.save();

    // Thêm review vào mảng reviews của sản phẩm
    product.reviews.push(review._id);
    await product.save();

    // Cập nhật điểm đánh giá trung bình và số lượng đánh giá
    await updateAverageRating(productId);

    // Populate thông tin người dùng vào review
    await review.populate('user', 'name'); // chỉ lấy trường name của user

    // Trả về review đã tạo
    res.status(201).json(review); // Trả thẳng review populated
  } catch (err) {
    console.error('Lỗi khi thêm đánh giá:', err);
    res.status(500).json({ message: 'Lỗi server.', error: err.message });
  }
};







// Lấy tất cả review của một sản phẩm
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name'); // lấy tên người dùng

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
    }

    // Chỉ chủ review hoặc admin được sửa
    if (review.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa đánh giá này.' });
    }

    const { rating, comment } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();

    await updateAverageRating(review.product);

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xoá review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
    }

    // Chỉ chủ review hoặc admin được xóa
    if (review.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xoá đánh giá này.' });
    }

    await Review.findByIdAndDelete(review._id);

    // Gỡ review ra khỏi product
    await Product.findByIdAndUpdate(review.product, {
      $pull: { reviews: review._id }
    });

    await updateAverageRating(review.product);

    res.status(200).json({ message: 'Đã xoá đánh giá.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// (Tuỳ chọn) Lấy tất cả review của một user
exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('product', 'name');

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};