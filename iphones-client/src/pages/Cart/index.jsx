import React, { useEffect, useContext } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import styles from "./Cart.module.css";
import { CartContext } from "../../contexts/CartContext";

const CartPage = () => {
  const { cartItems, setCartItems } = useContext(CartContext);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const handleQuantityChange = (sku, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.variant.sku === sku) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = (sku) => {
    const updatedCart = cartItems.filter((item) => item.variant.sku !== sku);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  return (
    <>
      <Header />
      <div className={styles.cartContainer}>
        <h1 className={styles.title}>GIỎ HÀNG CỦA BẠN</h1>
        <p className={styles.subtitle}>
          Có {cartItems.length} sản phẩm trong giỏ hàng
        </p>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Thông tin</th>
                  <th>Số lượng</th>
                  <th>Giá tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan="5">Chưa có sản phẩm trong giỏ hàng.</td>
                  </tr>
                ) : (
                  cartItems.map((item) => (
                    <tr key={item.variant.sku}>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          className={styles.productImage}
                        />
                      </td>
                      <td>
                        <div>
                          {item.name}
                          <br />- {item.variant.color} - {item.variant.storage}
                        </div>
                      </td>
                      <td className={styles.qtyControl}>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.variant.sku, -1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.variant.sku, 1)
                          }
                        >
                          +
                        </button>
                      </td>
                      <td className={styles.price}>
                        {(item.variant.price * item.quantity).toLocaleString()}đ
                      </td>
                      <td>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleRemove(item.variant.sku)}
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.summary}>
            <h2>Tóm tắt đơn hàng</h2>
            <div className={styles.summaryRow}>
              <span>Tổng tiền hàng:</span>
              <span>{totalPrice.toLocaleString()}đ</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Giảm giá:</span>
              <span>0đ</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tạm tính:</span>
              <span>{totalPrice.toLocaleString()}đ</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Tổng tiền:</span>
              <span className={styles.totalPrice}>
                {totalPrice.toLocaleString()}đ
              </span>
            </div>
            {cartItems.length === 0 ? (
              <span className={`${styles.checkoutButton} ${styles.disabled}`}>
                TIẾN HÀNH THANH TOÁN
              </span>
            ) : (
              <Link to="/checkout" className={styles.checkoutButton}>
                TIẾN HÀNH THANH TOÁN
              </Link>
            )}
            <Link to="/products" className={styles.continueButton}>
              MUA THÊM SẢN PHẨM
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
