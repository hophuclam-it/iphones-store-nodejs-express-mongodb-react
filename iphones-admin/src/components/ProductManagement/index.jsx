import React from "react";

const ProductManagement = () => {
  return (
    <iframe
      src="http://localhost:5000/admin/product"
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

export default ProductManagement;
