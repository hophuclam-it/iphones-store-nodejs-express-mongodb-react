import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CartContext } from "../../contexts/CartContext";
import styles from "./Checkout.module.css";
import axios from "axios";

const CheckOutPage = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zip: "",
      country: "Việt Nam",
    },
    paymentMethod: "COD",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState(null);

  const calculateTotalPrice = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );
    return total - (total * discount) / 100;
  };

  const totalPrice = calculateTotalPrice();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "zip", "country"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setToastMessage("Vui lòng nhập mã giảm giá.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/coupons");
      const coupons = response.data;

      const foundCoupon = coupons.find(
        (coupon) =>
          coupon.code.toLowerCase() === couponCode.toLowerCase() &&
          new Date(coupon.expiresAt) > new Date()
      );

      if (foundCoupon) {
        setDiscount(foundCoupon.discount);
        setCouponId(foundCoupon._id);
        setToastMessage(`Áp dụng thành công mã ${foundCoupon.code}!`);
      } else {
        setDiscount(0);
        setCouponId(null);
        setToastMessage("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra mã giảm giá:", error);
      setToastMessage("Không thể kiểm tra mã giảm giá lúc này.");
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handlePlaceOrder = async () => {
    const userOrder = JSON.parse(localStorage.getItem("user"));

    if (!userOrder || !userOrder.id) {
      setToastMessage("Vui lòng đăng nhập trước khi đặt hàng.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    if (cartItems.length === 0) {
      setToastMessage("Giỏ hàng của bạn đang trống.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    const { name, email, phone, address } = form;
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.zip.trim() ||
      !address.country.trim()
    ) {
      setToastMessage("Vui lòng điền đầy đủ thông tin giao hàng.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    try {
      const orderData = {
        user: userOrder.id,
        phone: form.phone,
        totalPrice,
        status: "pending",
        paymentMethod: form.paymentMethod,
        shippingAddress: {
          street: form.address.street,
          city: form.address.city,
          zip: form.address.zip,
          country: form.address.country,
        },
        orderItems: cartItems.map((item) => ({
          product: item._id,
          variantSku: item.variant.sku,
          quantity: item.quantity,
        })),
        coupon: couponId, // Gửi kèm mã giảm giá nếu có
      };
      console.log("Order data: ", orderData);


      const orderResponse = await axios.post("http://localhost:5000/api/orders", orderData);

      if (form.paymentMethod === "MoMo") {
        const momoResponse = await axios.post(
          "http://localhost:5000/api/payments/momo",
          {
            amount: totalPrice,
            orderId: orderResponse.data._id,
            orderInfo: `${name} - ${phone} - Thanh toán đơn hàng tại iPhone Store`,
            returnUrl: "http://localhost:3000/payment-success",
            notifyUrl: "http://localhost:5000/api/payments/momo-notify",
          }
        );

        window.location.href = momoResponse.data.payUrl;
      } else {
        setToastMessage("🎉 Đơn hàng của bạn đã được đặt thành công!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);

        localStorage.removeItem("cart");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      setToastMessage("❌ Đặt hàng thất bại. Vui lòng thử lại!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <>
      {showToast && (
        <div className={`${styles.toast} ${styles.show}`}>{toastMessage}</div>
      )}
      <Header />
      <div className={styles.checkoutWrapper}>
        <div className={styles.checkoutLeft}>
          <div className={styles.form}>
            <h2>Thông tin giao hàng</h2>
            <div className={styles.row}>
              <input
                name="name"
                placeholder="Họ và tên"
                value={form.name}
                onChange={handleChange}
              />
              <input
                name="phone"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className={styles.row}>
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <input
                name="street"
                placeholder="Địa chỉ (số nhà, đường, phường...)"
                value={form.address.street}
                onChange={handleChange}
              />
            </div>
            <div className={styles.row}>
              <input
                name="city"
                placeholder="Tỉnh/Thành phố"
                value={form.address.city}
                onChange={handleChange}
              />
              <input
                name="zip"
                placeholder="Mã bưu chính"
                value={form.address.zip}
                onChange={handleChange}
              />
              <input
                name="country"
                placeholder="Quốc gia"
                value={form.address.country}
                onChange={handleChange}
              />
            </div>

            <h2>Phương thức thanh toán</h2>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === "COD"}
                  onChange={handleChange}
                />{" "}
                Thanh toán khi nhận hàng (COD)
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BankTransfer"
                  checked={form.paymentMethod === "BankTransfer"}
                  onChange={handleChange}
                />{" "}
                Chuyển khoản ngân hàng
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="MoMo"
                  checked={form.paymentMethod === "MoMo"}
                  onChange={handleChange}
                />{" "}
                Thanh toán qua MoMo
              </label>
            </div>
          </div>
        </div>

        <div className={styles.checkoutRight}>
          <h2>Đơn hàng</h2>
          {cartItems.map((item) => (
            <div key={item.variant.sku} className={styles.cartItem}>
              <p>
                {item.name} - {item.variant.color} - {item.variant.storage}
              </p>
              <p>Số lượng: {item.quantity}</p>
              <p>
                Giá: {(item.variant.price * item.quantity).toLocaleString()}đ
              </p>
            </div>
          ))}

          <div className={styles.couponArea}>
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className={styles.couponInput}
            />
            <button onClick={handleApplyCoupon} className={styles.applyCouponBtn}>
              Áp dụng
            </button>
          </div>

          {discount > 0 && (
            <p>
              <strong>Đã áp dụng:</strong> Giảm {discount}%
            </p>
          )}
          <p>
            <strong>Tổng tiền:</strong> {totalPrice.toLocaleString()}đ
          </p>
          <button className={styles.submitBtn} onClick={handlePlaceOrder}>
            Đặt hàng ngay
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckOutPage;
