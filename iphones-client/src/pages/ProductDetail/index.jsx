import React, { useState, useContext, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { CartContext } from "../../contexts/CartContext";

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useContext(CartContext);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userReview, setUserReview] = useState("");

  const product = location.state?.product || {};

  const ratingTexts = ["Rất tệ", "Tệ", "Tạm ổn", "Tốt", "Rất tốt"];
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [reviews, setReviews] = useState([]);

  const {
    name = "",
    image = "",
    images = [],
    description = "",
    richDescription = "",
    brand = "",
    variants = [],
    specs = {},
    category = {},
    reviews: productReviews = [],
  } = product;

  const [mainImage, setMainImage] = useState(image);
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || {});

  useEffect(() => {
    setReviews(productReviews);
  }, [productReviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reviews/product/${product._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Không thể tải lại danh sách đánh giá.");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu đánh giá:", error);
      }
    };

    fetchReviews();
  }, [product._id]);

  if (!location.state?.product) {
    return (
      <div className={styles.notFound}>
        <p>Sản phẩm không tồn tại.</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const handleStorageChange = (event) => {
    const newVariant = variants.find((v) => v.storage === event.target.value);
    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  const handleAddToCart = () => {
    const existingItem = cartItems.find(
      (item) => item.variant?.sku === selectedVariant.sku
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.variant?.sku === selectedVariant.sku
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        { ...product, variant: selectedVariant, quantity: 1 },
      ];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = async () => {
    if (userReview && selected) {
      const user = JSON.parse(localStorage.getItem("user"));
      const productId = product._id;

      if (!user || !productId) {
        console.error("Không tìm thấy thông tin người dùng hoặc sản phẩm.");
        return;
      }

      const reviewData = {
        product: productId,
        rating: selected,
        comment: userReview,
        userId: user.id,
      };

      try {
        const response = await fetch(
          `http://localhost:5000/api/reviews/product/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewData),
          }
        );

        if (response.ok) {
          const newReview = {
            ...reviewData,
            user: user,
            createdAt: new Date(),
          };
          setReviews([newReview, ...reviews]);
          setUserReview("");
          setSelected(0);
        } else {
          console.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
      }
    } else {
      console.error("Vui lòng chọn số sao và nhập đánh giá.");
    }
  };

  return (
    <>
      {showToast && (
        <div className={`${styles.toast} ${showToast ? styles.show : ""}`}>
          Đã thêm vào giỏ hàng
        </div>
      )}
      <Header />
      <div className={styles.detailContainer}>
        <div className={styles.mainInfo}>
          <img src={mainImage} alt={name} className={styles.mainImage} />

          <div className={styles.infoBlock}>
            <h1 className={styles.productName}>{name}</h1>
            <p className={styles.price}>
              {selectedVariant.price?.toLocaleString()} VND
            </p>
            <p>
              <strong>Thương hiệu:</strong> {brand}
            </p>
            <p>
              <strong>Màu:</strong> {selectedVariant.color}
            </p>

            <div className={styles.storageSelect}>
              <label>
                <strong>Bộ nhớ:</strong>
              </label>
              <select
                onChange={handleStorageChange}
                value={selectedVariant.storage}
              >
                {variants.map((variant) => (
                  <option key={variant.sku} value={variant.storage}>
                    {variant.storage}
                  </option>
                ))}
              </select>
            </div>

            <p>
              <strong>Còn lại:</strong> {selectedVariant.stock} sản phẩm
            </p>
            <p>
              <strong>Đánh giá:</strong> {product.averageRating}/5 ⭐
            </p>

            <div>
              <button className={styles.buyNow} onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <div className={styles.gallery}>
          {[image, ...images].map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Hình ${idx + 1}`}
              className={`${styles.galleryImage} ${
                mainImage === img ? styles.active : ""
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        <div className={styles.specs}>
          <h2>Cấu hình kỹ thuật</h2>
          <ul>
            <li>
              <strong>Màn hình:</strong> {specs.screen}
            </li>
            <li>
              <strong>Chip:</strong> {specs.chip}
            </li>
            <li>
              <strong>Camera:</strong> {specs.camera}
            </li>
            <li>
              <strong>Pin:</strong> {specs.battery}
            </li>
          </ul>
        </div>

        <div className={styles.description}>
          <h2>Mô tả ngắn</h2>
          <p>{description}</p>

          <h2>Thông tin chi tiết</h2>
          <p>{richDescription}</p>
        </div>

        <div className={styles.category}>
          <p>
            Danh mục:{" "}
            <span style={{ color: category.color }}>{category.name}</span>
          </p>
        </div>
      </div>

      <div className={styles.wrapper}>
        <h2 className={styles.title}>Đánh giá sản phẩm này</h2>
        <p className={styles.subtitle}>
          Nếu đã mua sản phẩm này tại iPhone Store. Hãy đánh giá ngay để giúp
          hàng ngàn người chọn mua hàng tốt nhất bạn nhé!
        </p>
        <div className={styles.stars}>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className={styles.starItem}
              onMouseEnter={() => setHovered(index + 1)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(index + 1)}
            >
              {index < (hovered || selected) ? (
                <StarFilled style={{ fontSize: 32, color: "#faad14" }} />
              ) : (
                <StarOutlined style={{ fontSize: 32, color: "#faad14" }} />
              )}
              <p className={styles.ratingText}>{ratingTexts[index]}</p>
            </div>
          ))}
        </div>
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.textarea}
            placeholder="Nhập đánh giá của bạn..."
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
          />
        </div>
        <div className={styles.submitWrapper}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!userReview || !selected}
          >
            Gửi Đánh Giá
          </button>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Đánh giá từ khách hàng</h2>
          <div className={styles.reviewList}>
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div key={review._id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewerName}>
                    {review.user?.name || "Người dùng ẩn danh"}
                  </span>
                  <span className={styles.reviewRating}>
                    {Array.from({ length: 5 }, (_, idx) =>
                      idx < review.rating ? (
                        <StarFilled key={idx} style={{ color: "#faad14" }} />
                      ) : (
                        <StarOutlined key={idx} style={{ color: "#ccc" }} />
                      )
                    )}
                  </span>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                <p className={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className={styles.showMoreButtonWrapper}>
              <button
                className={styles.showMoreButton}
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>
          )}
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductDetailPage;
