import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import {
  Drawer,
  Typography,
  Button,
  Space,
  List,
  Image,
  Dropdown,
  Menu,
} from "antd";
import logo from "../../assets/images/logo.png";
import styles from "./Header.module.css";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";

const Header = () => {
  const [openCart, setOpenCart] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { cartItems, setCartItems } = useContext(CartContext);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const showCart = () => {
    setOpenCart(true);
  };

  const closeCart = () => {
    setOpenCart(false);
  };

  const handleGoToCart = () => {
    navigate("/cart");
    closeCart();
  };

  const handleGoToCheckout = () => {
    navigate("/checkout");
    closeCart();
  };

  const handleRemove = (sku) => {
    const updatedCart = cartItems.filter((item) => item.variant.sku !== sku);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleLogout = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login-register";
    setUser(null);
  };

  return (
    <>
      <div className={styles.header}>
        <NavLink to="/" className={styles.logo}>
          <img src={logo} alt="iPhones Store" className={styles.logo__image} />
          <h1 className={styles.logo__title}>iPhones Store</h1>
        </NavLink>

        <div className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? `${styles.nav__item} ${styles.active}`
                : styles.nav__item
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? `${styles.nav__item} ${styles.active}`
                : styles.nav__item
            }
          >
            Sản phẩm
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? `${styles.nav__item} ${styles.active}`
                : styles.nav__item
            }
          >
            Giỏ hàng
          </NavLink>
          <NavLink
            to="/checkout"
            className={({ isActive }) =>
              isActive
                ? `${styles.nav__item} ${styles.active}`
                : styles.nav__item
            }
          >
            Thanh toán
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive
                ? `${styles.nav__item} ${styles.active}`
                : styles.nav__item
            }
          >
            Đơn hàng
          </NavLink>
        </div>

        <div className={styles.headerIcons}>
          <button className={styles.iconButton} onClick={showCart}>
            <ShoppingCartOutlined className={styles.icon} />
            {totalQuantity > 0 && (
              <span className={styles.cartBadge}>{totalQuantity}</span>
            )}
          </button>
          {user ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="profile" onClick={() => navigate("/profile")}>
                    Thông tin cá nhân
                  </Menu.Item>
                  <Menu.Item
                    key="change-password"
                    onClick={() => navigate("/change-password")}
                  >
                    Đổi mật khẩu
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="logout" onClick={handleLogout}>
                    Đăng xuất
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              trigger={["click"]}
            >
              <button className={styles.userDropdown}>{user.name}</button>
            </Dropdown>
          ) : (
            <NavLink to="/login-register" className={styles.iconLink}>
              <UserOutlined className={styles.icon} />
            </NavLink>
          )}
        </div>
      </div>

      <Drawer
        title={
          <Typography.Text strong className={styles.cartTitle}>
            Giỏ hàng
          </Typography.Text>
        }
        placement="right"
        onClose={closeCart}
        open={openCart}
        footer={
          <Space style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              className={styles.drawerButtonSecondary}
              onClick={handleGoToCart}
            >
              Xem giỏ hàng
            </Button>
            <Button
              type="primary"
              className={styles.drawerButtonPrimary}
              onClick={handleGoToCheckout}
              disabled={cartItems.length === 0}
            >
              Thanh toán
            </Button>
          </Space>
        }
      >
        {cartItems.length === 0 ? (
          <p className={styles.cartContent}>Chưa có sản phẩm trong giỏ hàng.</p>
        ) : (
          <List
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => handleRemove(item.variant.sku)}
                    style={{ color: "red" }}
                  >
                    Xóa
                  </Button>,
                ]}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover", marginRight: 16 }}
                  />
                  <div style={{ flex: 1 }}>
                    <Typography.Text strong>{item.name}</Typography.Text>
                    <br />
                    <Typography.Text>
                      {item.variant.color} - {item.variant.storage}
                    </Typography.Text>
                    <br />
                    <Typography.Text>Số lượng: {item.quantity}</Typography.Text>
                    <br />
                    <Typography.Text>
                      Giá:{" "}
                      {(item.variant.price * item.quantity).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </Typography.Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
};

export default Header;
