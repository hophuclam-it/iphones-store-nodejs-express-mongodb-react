import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <h3 className={styles.title}>Về chúng tôi</h3>
            <p className={styles.text}>
              <strong>iPhones Store</strong> tự hào là một trong những địa chỉ
              uy tín hàng đầu chuyên cung cấp các dòng sản phẩm{" "}
              <strong>iPhone chính hãng</strong> tại Việt Nam. Với tiêu chí đặt{" "}
              <em>uy tín và chất lượng</em> lên hàng đầu, chúng tôi cam kết mang
              đến cho khách hàng những thiết bị Apple nguyên seal, đầy đủ VAT,
              với mức giá cạnh tranh và chính sách bảo hành minh bạch.
            </p>
          </Col>
          <Col xs={24} md={8}>
            <h3 className={styles.title}>Liên hệ</h3>
            <ul className={styles.contactList}>
              <li>📞 Hotline: 0866.791.305</li>
              <li>📧 Email: vohongkiet250902@gmail.com</li>
              <li>
                🏠 Địa chỉ: 12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Hồ Chí Minh
                700000, Việt Nam
              </li>
            </ul>
          </Col>
          <Col xs={24} md={8}>
            <h3 className={styles.title}>Theo dõi chúng tôi</h3>
            <div className={styles.socials}>
              <Link to="/" className={styles.socialLink}>
                Facebook
              </Link>
              <Link to="/" className={styles.socialLink}>
                Instagram
              </Link>
              <Link to="/" className={styles.socialLink}>
                Zalo
              </Link>
            </div>
          </Col>
        </Row>
        <div className={styles.bottom}>
          © {new Date().getFullYear()} iPhones Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
