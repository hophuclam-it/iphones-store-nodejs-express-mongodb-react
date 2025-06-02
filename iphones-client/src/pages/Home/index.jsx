import React, { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./Home.module.css";
import { PhoneOutlined, AppleOutlined } from "@ant-design/icons";
import { Card, Row, Col, Spin } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../services/productService";

import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";
import banner4 from "../../assets/images/banner4.png";
import banner5 from "../../assets/images/banner5.png";
import momo from "../../assets/images/momo.png";
import tragop from "../../assets/images/tragop.png";
import baohanh from "../../assets/images/baohanh.png";
import about from "../../assets/images/about.png";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const shuffledProducts = useMemo(() => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
  }, [products]);

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

  const promoData = [
    {
      title: "Giảm 5% khi thanh toán qua MoMo",
      description: "Áp dụng cho đơn hàng từ 10 triệu trở lên.",
      img: momo,
    },
    {
      title: "Trả góp 0% lãi suất",
      description: "Duyệt hồ sơ online nhanh chóng, nhận máy tại nhà.",
      img: tragop,
    },
    {
      title: "Bảo hành chính hãng 24 tháng",
      description: "Hỗ trợ đổi mới trong 7 ngày đầu nếu lỗi phần cứng.",
      img: baohanh,
    },
  ];

  const commitData = [
    {
      title: "Hàng chính hãng 100%",
      description:
        "Cam kết sản phẩm Apple chính hãng, nguyên seal, đầy đủ VAT.",
    },
    {
      title: "Giao hàng toàn quốc",
      description: "Miễn phí nội thành, hỗ trợ giao siêu tốc trong ngày.",
    },
    {
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ tư vấn và kỹ thuật hỗ trợ mọi lúc qua hotline & chat.",
    },
  ];

  return (
    <>
      <div className={styles.home}>
        <Header />

        <div className={styles.container}>
          <div className={styles.sidebar}>
            <h2 className={styles.sectionTitle}>Danh sách sản phẩm</h2>
            <ul className={styles.productList}>
              {[
                "iPhone 11",
                "iPhone 12",
                "iPhone 13",
                "iPhone 14",
                "iPhone 15",
                "iPhone 16",
              ].map((series) => (
                <li key={series}>
                  <Link
                    to={`/typeproducts?filter=${encodeURIComponent(series)}`}
                    className={styles.productLink}
                  >
                    {series} Series
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.topBar}>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="Bạn đang tìm gì?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <button
                  className={styles.searchButton}
                  onClick={() => {
                    if (searchTerm.trim()) {
                      navigate(
                        `/searchproducts?search=${encodeURIComponent(
                          searchTerm
                        )}`
                      );
                    }
                  }}
                >
                  TÌM KIẾM
                </button>
              </div>

              <div className={styles.contactInfo}>
                <PhoneOutlined className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <span className={styles.phone}>0866.791.305</span>
                  <span className={styles.support}>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>

            <div className={styles.adSection}>
              <div className={styles.textSection}>
                <h1>LẦN ĐẦU TIÊN CÓ GIÁ NÀY!</h1>
                <p>iPhone 16 Series chỉ từ 22.490.000</p>
                <button
                  className={styles.buyButton}
                  onClick={() =>
                    window.scrollBy({ top: 600, behavior: "smooth" })
                  }
                >
                  MUA NGAY
                </button>
              </div>

              <div className={styles.imageSection}>
                <Swiper
                  spaceBetween={10}
                  centeredSlides={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  modules={[Autoplay, Pagination, Navigation]}
                  className={styles.adSwiper}
                >
                  <SwiperSlide>
                    <img
                      src={banner1}
                      alt="Banner 1"
                      className={styles.adSwiper__image}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src={banner2}
                      alt="Banner 2"
                      className={styles.adSwiper__image}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src={banner3}
                      alt="Banner 3"
                      className={styles.adSwiper__image}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src={banner4}
                      alt="Banner 4"
                      className={styles.adSwiper__image}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src={banner5}
                      alt="Banner 5"
                      className={styles.adSwiper__image}
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.titleProducts}>
          <AppleOutlined className={styles.titleProductsIcon} />
          <h1 className={styles.titleProductsText}>iPhone</h1>
        </div>
        <div className={styles.products}>
          {shuffledProducts.map((product) => (
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

        <div className={styles.viewAllWrapper}>
          <Link to="/products" className={styles.viewAllButton}>
            Xem tất cả iPhone
          </Link>
        </div>

        <div className={styles.promoSection}>
          <h2 className={styles.promoTitle}>🎁 Ưu đãi & Khuyến mãi</h2>
          <Row gutter={[24, 24]} justify="center">
            {promoData.map((item, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  hoverable
                  className={styles.promoCard}
                  cover={
                    <img
                      alt={item.title}
                      src={item.img}
                      className={styles.promoImage}
                    />
                  }
                >
                  <Card.Meta
                    title={item.title}
                    description={item.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className={styles.commitSection}>
          <h2 className={styles.commitTitle}>
            ✅ Cam kết khi mua hàng tại cửa hàng
          </h2>
          <Row gutter={[24, 24]} justify="center">
            {commitData.map((item, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <div className={styles.commitCard}>
                  <h3 className={styles.commitCardTitle}>{item.title}</h3>
                  <p className={styles.commitCardDescription}>
                    {item.description}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div className={styles.aboutSection}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={10}>
              <img
                src={about}
                alt="iPhones Store"
                className={styles.aboutImage}
              />
            </Col>
            <Col xs={24} md={14}>
              <h2 className={styles.aboutTitle}>📱 iPhones Store</h2>
              <p className={styles.aboutDescription}>
                Chào mừng bạn đến với <strong>iPhones Store</strong> – nơi
                chuyên cung cấp các sản phẩm Apple chính hãng như iPhone, iPad,
                MacBook, và phụ kiện chất lượng cao. Chúng tôi cam kết mang đến
                dịch vụ tư vấn tận tâm, giá cả hợp lý và chính sách hậu mãi uy
                tín. iPhones Store – lựa chọn đáng tin cậy của bạn!
              </p>
            </Col>
          </Row>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
