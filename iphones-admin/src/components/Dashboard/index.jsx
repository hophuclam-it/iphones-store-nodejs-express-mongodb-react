import React, { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Spin, Alert } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarCircleOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import styles from "./Dashboard.module.css";

const DashboardPage = ({ setSelectedKey }) => {
  const [data, setData] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await fetch("http://localhost:5000/api/orders");
        if (!orderResponse.ok) throw new Error("Không thể tải đơn hàng.");
        const orderData = await orderResponse.json();
        const totalOrders = orderData.length;
        const totalRevenue = orderData.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );

        setData((prevData) => ({
          ...prevData,
          totalOrders,
          totalRevenue,
        }));
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const userResponse = await fetch("http://localhost:5000/api/users");
        if (!userResponse.ok) throw new Error("Không thể tải người dùng.");
        const userData = await userResponse.json();
        const totalUsers = userData.filter(
          (user) => user.isAdmin === false
        ).length;

        setData((prevData) => ({
          ...prevData,
          totalUsers,
        }));
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const productResponse = await fetch(
          "http://localhost:5000/api/products"
        );
        if (!productResponse.ok) throw new Error("Không thể tải sản phẩm.");
        const productData = await productResponse.json();
        const totalProducts = productData.length;

        setData((prevData) => ({
          ...prevData,
          totalProducts,
        }));
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoryResponse = await fetch(
          "http://localhost:5000/api/categories"
        );
        if (!categoryResponse.ok) throw new Error("Không thể tải danh mục.");
        const categoryData = await categoryResponse.json();
        const totalCategories = categoryData.length;

        setData((prevData) => ({
          ...prevData,
          totalCategories,
        }));
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchOrders(),
        fetchUsers(),
        fetchProducts(),
        fetchCategories(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container}>
        {error && <Alert message={error} type="error" />}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className={styles.card}
              title="Số danh mục"
              onClick={() => setSelectedKey("caterory")}
              bordered={false}
            >
              <Statistic
                value={data.totalCategories}
                valueStyle={{ fontSize: "32px", color: "#3f8600" }}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className={styles.card}
              title="Số sản phẩm"
              onClick={() => setSelectedKey("products")}
              bordered={false}
            >
              <Statistic
                value={data.totalProducts}
                valueStyle={{ fontSize: "32px", color: "#3f8600" }}
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className={styles.card}
              title="Số người dùng"
              onClick={() => setSelectedKey("users")}
              bordered={false}
            >
              <Statistic
                value={data.totalUsers}
                valueStyle={{ fontSize: "32px", color: "#3f8600" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className={styles.card}
              title="Số đơn hàng"
              onClick={() => setSelectedKey("orders")}
              bordered={false}
            >
              <Statistic
                value={data.totalOrders}
                valueStyle={{ fontSize: "32px", color: "#3f8600" }}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className={styles.card}
              title="Tổng doanh thu (VND)"
              bordered={false}
            >
              <Statistic
                value={data.totalRevenue}
                valueStyle={{ fontSize: "32px", color: "#3f8600" }}
                prefix={<DollarCircleOutlined />}
                suffix="VND"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardPage;
