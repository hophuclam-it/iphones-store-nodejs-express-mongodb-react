import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import styles from "./Products.module.css";
import { fetchProducts } from "../../services/productService";
import { Pagination, Button, Spin } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [randomizedProducts, setRandomizedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState(null);

  const pageSize = 15;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  useEffect(() => {
    let filtered = [];

    if (filter === "Tất cả") {
      const shuffled = shuffleArray([...products]);
      setRandomizedProducts(shuffled);
      filtered = shuffled;
    } else {
      filtered = products.filter((p) =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedProducts(filtered.slice(startIndex, endIndex));
  }, [products, currentPage, filter, sortOrder]);

  useEffect(() => {
    if (filter === "Tất cả") {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      let filtered = [...randomizedProducts];

      if (sortOrder === "asc") {
        filtered.sort((a, b) => a.variants[0].price - b.variants[0].price);
      } else if (sortOrder === "desc") {
        filtered.sort((a, b) => b.variants[0].price - a.variants[0].price);
      }

      setDisplayedProducts(filtered.slice(startIndex, endIndex));
    }
  }, [randomizedProducts, currentPage, sortOrder, filter]);

  if (loading) {
    return (
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
    );
  }
  if (error) return <div>{error}</div>;

  const totalProducts =
    filter === "Tất cả"
      ? randomizedProducts.length
      : products.filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase())
        ).length;

  const handleFilter = (type) => {
    setFilter(type);
    setCurrentPage(1);

    if (type === "Tất cả") {
      const shuffled = shuffleArray([...products]);
      setRandomizedProducts(shuffled);
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <div className={styles.productsPage}>
      <Header />

      <div
        className={styles.controls}
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div
          className={styles.filterButtons}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          {[
            "Tất cả",
            "iPhone 11",
            "iPhone 12",
            "iPhone 13",
            "iPhone 14",
            "iPhone 15",
            "iPhone 16",
          ].map((type) => (
            <Button
              key={type}
              onClick={() => handleFilter(type)}
              type={filter === type ? "primary" : "default"}
              className={`${styles.customButton} ${
                filter === type ? styles.active : ""
              }`}
            >
              {type}
            </Button>
          ))}
        </div>

        <div
          className={styles.sortButtons}
          style={{ display: "flex", gap: "10px" }}
        >
          <Button
            onClick={() => handleSort("asc")}
            type={sortOrder === "asc" ? "primary" : "default"}
            className={styles.customButton}
          >
            <ArrowUpOutlined />
            Giá tăng dần
          </Button>
          <Button
            onClick={() => handleSort("desc")}
            type={sortOrder === "desc" ? "primary" : "default"}
            className={styles.customButton}
          >
            <ArrowDownOutlined />
            Giá giảm dần
          </Button>
        </div>
      </div>

      <div className={styles.products}>
        {displayedProducts.map((product) => (
          <Link
            to={"/productdetail"}
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
              to={"/productdetail"}
              state={{ product }}
              className={styles.buyButton}
            >
              Mua ngay
            </Link>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: "center", margin: "30px 300px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalProducts}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
