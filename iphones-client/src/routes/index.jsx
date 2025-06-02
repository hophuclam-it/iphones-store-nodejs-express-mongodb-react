import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home";
import ProductsPage from "../pages/Products";
import SearchProductsPage from "../pages/SearchProducts";
import TypeProductsPage from "../pages/TypeProducts";
import ProductDetailPage from "../pages/ProductDetail";
import CartPage from "../pages/Cart";
import CheckOutPage from "../pages/Checkout";
import OrdersPage from "../pages/Orders";
import LoginRegisterPage from "../pages/Login_Register";
import ProfilePage from "../pages/Profile";
import ChangePasswordPage from "../pages/ChangePassword";
import PaymentSuccess from "../pages/Payment/PaymentSuccess"; // Import component thanh toán thành công
import OrderDetailPage from "../pages/Orders/OrderDetailPage";
const RoutesApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/searchproducts" element={<SearchProductsPage />} />
        <Route path="/typeproducts" element={<TypeProductsPage />} />
        <Route path="/productdetail" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/login-register" element={<LoginRegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} /> {/* Thêm route mới */}
        <Route path="/orderdetail/:id" element={<OrderDetailPage />} />
      </Routes>
    </Router>
  );
};

export default RoutesApp;
