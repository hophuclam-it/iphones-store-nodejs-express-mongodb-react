// utils/updateAverageRating.js
const Product = require('../models/Product');
const Review = require('../models/Review');

const updateAverageRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;
  const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / (numReviews || 1);

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(averageRating.toFixed(1)),//ép kiểu về số với 1 chữ số thập phân
    numReviews
  });
};

// // Hàm cập nhật điểm đánh giá trung bình
// const updateAverageRating = async (productId) => {
//   try {
//     const product = await Product.findById(productId).populate('reviews');
//     if (!product) return;

//     const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
//     const averageRating = totalRatings / product.reviews.length;

//     // Cập nhật điểm đánh giá trung bình và số lượng đánh giá
//     product.averageRating = averageRating;
//     product.reviewCount = product.reviews.length;
//     await product.save();
//   } catch (err) {
//     console.error('Lỗi khi cập nhật điểm đánh giá:', err);
//   }
// };

module.exports = updateAverageRating;
