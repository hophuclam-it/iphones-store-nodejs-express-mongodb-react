import React from "react";

const CouponPage = () => {
  return (
    <iframe
      src="http://localhost:5000/admin/coupon"
      title="Quản lý sản phẩm"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        overflow: "hidden",
      }}
    />
  );
};

export default CouponPage;