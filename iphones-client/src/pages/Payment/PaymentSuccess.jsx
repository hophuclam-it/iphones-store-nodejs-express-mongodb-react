import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PaymentSuccess.module.css"; // Đảm bảo bạn tạo file CSS này

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const navigate = useNavigate();

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    const orderId = searchParams.get("orderId");

    const updateOrderStatus = async (status) => {
      try {
        const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/paid`, { status });
        if (status === "cancelled") {
          setMessage("❌ Thanh toán thất bại và đơn hàng đã bị hủy.");
        } else {
          setMessage("🎉 Thanh toán thành công và đơn hàng đang được xử lý giao hàng.");
        }
        localStorage.removeItem("cart");
        console.log(response);
        

        // Chuyển hướng sau 5 giây
        setTimeout(() => {
          navigate(`/orderdetail/${orderId}`);
        }, 5000);

      } catch (error) {
        setMessage("❌ Lỗi khi cập nhật trạng thái đơn hàng.");
        console.error("Lỗi cập nhật đơn hàng:", error.response?.data || error.message);
      }
    };

    if (resultCode === "0") {
      // Thành công
      updateOrderStatus("confirmed");
      localStorage.removeItem("cart");
    } else {
      // Thất bại, hủy đơn
      updateOrderStatus("cancelled");
      localStorage.removeItem("cart");
    }
  }, [searchParams, navigate]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Kết quả thanh toán</h2>
        <p className={`${styles.message} ${message.includes("thành công") ? styles.success : styles.error}`}>
          {message}
        </p>

        <div className={styles.countdown}>
          <p>Bạn sẽ được chuyển hướng đến trang chi tiết đơn hàng sau 5 giây...</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
