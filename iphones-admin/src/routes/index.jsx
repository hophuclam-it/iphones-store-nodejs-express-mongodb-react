import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import CateroryPage from "../components/Caterory";
import ProductManagement from "../components/ProductManagement";
import OrdersPage from "../components/Orders";
import UsersPage from "../components/Users";

const RoutesApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<HomePage />} />
        <Route path="/caterory" element={<CateroryPage />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </Router>
  );
};

export default RoutesApp;
