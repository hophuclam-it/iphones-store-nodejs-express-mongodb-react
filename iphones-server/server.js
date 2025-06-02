const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/error-handler');
const authJwt = require('./middlewares/authJwt');



dotenv.config();

const app = express();

// Khai báo biến API_URL
const api = (process.env.API_URL || "/api").trim();

// Kết nối database
const connectDB = require('./config/db');
connectDB();

// Middleware chung
app.use(cors({
  origin: '*', // Cho phép tất cả origin, có thể giới hạn nếu cần
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Đang xử lý lỗi phần cập nhật form product
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Load routes
const indexRoutes = require('./routes/index.routes'); // Thêm import cho indexRoutes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // API upload ảnh
const paymentRoutes = require('./routes/paymentRoutes'); // API thanh toán VNPay
const couponRoutes = require('./routes/couponRoutes');

// Sử dụng routes
app.use('/', indexRoutes);                        // Trang chủ EJS

app.use(`${api}/users`, userRoutes);              // API người dùng (đã bảo vệ bằng JWT)
app.use(`${api}/auth`, authRoutes);               // API đăng nhập & đăng ký (login/register)
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/orders`, orderRoutes);
app.use(`${api}/carts`, cartRoutes);
app.use(`${api}/reviews`, reviewRoutes);
app.use(`${api}/payments`, paymentRoutes); // API thanh toán VNPay
app.use(`${api}/coupons`, couponRoutes);

// Phục vụ file tĩnh từ thư mục `uploads/`
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối route upload
app.use(`${api}/uploads`, uploadRoutes);

// Middleware xử lý lỗi (cuối cùng)
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API base URL: ${api}`);
  console.log(`Auth login: ${api}/auth/login`);
  console.log(`Auth register: ${api}/auth/register`);
  console.log(`User API: ${api}/users`);
  console.log(`Category API: ${api}/categories`);
  console.log(`Product API: ${api}/products`);
  console.log(`Orders API: ${api}/orders`);
  console.log(`Carts API: ${api}/carts`);
  console.log(`Reviews API: ${api}/reviews`);
  console.log(`Upload API: ${api}/uploads`);

  console.log(`\nList Products: http://localhost:${PORT}/admin/product`);
  console.log(`Detail Product: http://localhost:${PORT}/admin/product/:id`); // Sửa chính tả và đường dẫn
  console.log(`Add New Product: http://localhost:${PORT}/admin/add-product`);
  console.log(`Edit Product: http://localhost:${PORT}/admin/edit-product/:id`);
  console.log(`Manage Categories: http://localhost:${PORT}/admin/categories`);
  console.log(`Admin Login: http://localhost:${PORT}/admin/login`);

  console.log(`Test payments: http://localhost:${PORT}/api/payments/vnpay`);
  console.log(`Add Coupon: http://localhost:${PORT}/admin/coupon`);

});