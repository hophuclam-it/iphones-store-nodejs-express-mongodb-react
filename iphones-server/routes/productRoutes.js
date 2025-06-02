// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const checkAdmin = require('../middlewares/checkAdmin');
const upload = require('../middlewares/upload'); // <- multer middleware

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  searchProductsByName
} = require('../controllers/productController');



// Các route publics

// Lấy danh sách sản phẩm
router.get('/', getAllProducts);

// Lấy sản phẩm theo slug
router.get('/slug/:slug', getProductBySlug);

// Tìm kiếm sản phẩm theo tên
router.get('/search', searchProductsByName);

// Lấy chi tiết sản phẩm
router.get('/:id', getProductById);



//added authJwt and checkAdmin middlewares to protect the routes
// Tạo sản phẩm mới
router.post('/', upload.multiUpload ,createProduct);
// router.post('/', checkAdmin, authJwt , upload.multiUpload ,createProduct);


// Cập nhật sản phẩm
router.put('/:id',upload.multiUpload, updateProduct);
// router.put('/:id', checkAdmin, authJwt ,upload.multiUpload, updateProduct);

// Xóa sản phẩm
router.delete('/:id', deleteProduct);
// router.delete('/:id', checkAdmin, authJwt , deleteProduct);


module.exports = router;
