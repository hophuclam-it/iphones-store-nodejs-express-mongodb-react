import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { fetchProducts } from "../../services/productService";
import { Spin, Button } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import styles from "./TypeProducts.module.css";

const TypeProductsPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const originalFilter = query.get("filter") || "";
  const typeFilter = originalFilter.toLowerCase();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");

  const sortProducts = (order, products) => {
    const sorted = [...products].sort((a, b) => {
      const priceA = a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.price || 0;
      return order === "asc" ? priceA - priceB : priceB - priceA;
    });
    return sorted;
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        const filtered = allProducts.filter((product) =>
          product.name?.toLowerCase().includes(typeFilter)
        );

        const sorted = sortOrder ? sortProducts(sortOrder, filtered) : filtered;
        setFilteredProducts(sorted);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm theo loại:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [typeFilter, sortOrder]);

  if (loading) {
    return (
      <div>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <Spin size="large" tip="Đang tải sản phẩm..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ margin: "30px 300px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Button className={styles.typeButton}>
              <em>{originalFilter}</em> Series
            </Button>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={() => setSortOrder("asc")}
              className={sortOrder === "asc" ? styles.activeSort : ""}
            >
              {" "}
              <ArrowUpOutlined />
              Giá tăng dần
            </Button>
            <Button
              onClick={() => setSortOrder("desc")}
              className={sortOrder === "desc" ? styles.activeSort : ""}
            >
              {" "}
              <ArrowDownOutlined />
              Giá giảm dần
            </Button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className={styles.products}>
            {filteredProducts.map((product) => (
              <Link
                to="/productdetail"
                state={{ product }}
                key={product._id}
                className={styles.productCard}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <h2 className={styles.productTitle}>{product.name}</h2>
                {product.variants.length > 0 && (
                  <p className={styles.productPrice}>
                    {product.variants[0].price.toLocaleString()} VND
                  </p>
                )}
                <Link
                  to="/productdetail"
                  state={{ product }}
                  className={styles.buyButton}
                >
                  Mua ngay
                </Link>
              </Link>
            ))}
          </div>
        ) : (
          <p>Không có sản phẩm nào thuộc loại này.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TypeProductsPage;
