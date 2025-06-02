const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const path = require('path');
const checkAdmin = require('../middlewares/checkAdmin');



// Hiển thị form thêm danh mục
router.get('/admin/category', (req, res) => {
  try {
    res.render('add-category'); // Trả về file add-category.ejs từ thư mục views
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form thêm danh mục');
  }
});

// Hiển thị fcoupon thêm danh mục
router.get('/admin/coupon', (req, res) => {
  try {
    res.render('add-coupon'); // Trả về file add-category.ejs từ thư mục views
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form thêm danh mục');
  }
});

// Hiển thị login
router.get('/', (req, res) => {
  try {
    res.render('login'); // Trả về file add-category.ejs từ thư mục views
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải trang đăng nhập Admin');
  }
});


// Hiển thị form thêm danh mục
router.get('/admin/category', (req, res) => {
  try {
    res.render('add-category'); // Trả về file add-category.ejs từ thư mục views
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form thêm danh mục');
  }
});

// Hiển thị demo order
router.get('/admin/payment', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'views', 'vnpay.html');
    res.sendFile(filePath); // Trả về file HTML tĩnh
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form thanh toán');
  }
});


// Hiển thị sản phẩm
router.get('/admin/product', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'views', 'products', 'list-product.html');
    res.sendFile(filePath); // Trả về file HTML tĩnh
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form thêm sản phẩm');
  }
});

// Hiển thị form thêm sản phẩm
router.get('/admin/add-product', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'views', 'products', 'add-product.html');
    res.sendFile(filePath); // Trả về file HTML tĩnh
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form thêm sản phẩm');
  }
});

// Hiển thị chi tiết sản phẩm
router.get('/admin/product/:id', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'views', 'products', 'detail-product.html');
    res.sendFile(filePath); // Trả về file HTML tĩnh
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form thêm sản phẩm');
  }
});

// Sửa chi tiết sản phẩm
router.get('/admin/edit-product/:id', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'views', 'products', 'edit-product.html');
    res.sendFile(filePath); // Trả về file HTML tĩnh
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form thêm sản phẩm');
  }
});





module.exports = router;
