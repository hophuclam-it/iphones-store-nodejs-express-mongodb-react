import React, { useState } from "react";
import DashboardPage from "../../components/Dashboard";
import CateroryPage from "../../components/Caterory";
import ProductManagement from "../../components/ProductManagement";
import OrdersPage from "../../components/Orders";
import UsersPage from "../../components/Users";
import CouponPage from "../../components/Coupon";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./Home.module.css";

const { Header, Sider, Content } = Layout;

const HomePage = () => {
  const [selectedKey, setSelectedKey] = useState("dashboard");

  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return <DashboardPage setSelectedKey={setSelectedKey} />;
      case "caterory":
        return <CateroryPage />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrdersPage />;
      case "users":
        return <UsersPage />;
        case "coupon":
        return <CouponPage />;
      default:
        return <DashboardPage setSelectedKey={setSelectedKey} />;
    }
  };

  return (
    <Layout className={styles.container}>
      <Sider className={styles.sider} theme="light">
        <div className={styles.logo}>Admin Panel</div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          className={styles.menu}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="caterory" icon={<AppstoreOutlined />}>
            Quản lý danh mục
          </Menu.Item>
          <Menu.Item key="products" icon={<AppstoreOutlined />}>
            Quản lý sản phẩm
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            Quản lý đơn hàng
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Quản lý người dùng
          </Menu.Item>
          <Menu.Item key="coupon" icon={<UserOutlined />}>
            Quản lý mã giảm giá
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className={styles.header}>Trang quản trị</Header>
        <Content className={styles.content}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
