import React from "react";

const CateroryPage = () => {
  return (
    <iframe
      src="http://localhost:5000/admin/category"
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

export default CateroryPage;