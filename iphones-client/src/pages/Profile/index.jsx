import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./Profile.module.css";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    country: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${storedUser.id}`
          );
          setUser(response.data);
          setFormData({
            name: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            street: response.data.address?.street || "",
            city: response.data.address?.city || "",
            zip: response.data.address?.zip || "",
            country: response.data.address?.country || "",
          });
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          setMessage("Không thể tải thông tin người dùng.");
        }
      } else {
        setMessage("Không tìm thấy người dùng trong localStorage.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          zip: formData.zip,
          country: formData.country,
        },
      };

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        updatedUser
      );

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsEditing(false);
      setMessage("Cập nhật thông tin thành công!");
    } catch (error) {
      setMessage(
        "Cập nhật thất bại: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h2>Thông tin cá nhân</h2>
        {user ? (
          <div className={styles.profile}>
            <div className={styles.field}>
              <label>Họ và tên:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{user.name || "-"}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{user.email || "-"}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Số điện thoại:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{user.phone || "-"}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Địa chỉ - Đường:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{user.address?.street || "-"}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Thành phố:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{user.address?.city || "-"}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Mã bưu điện:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{user.address?.zip || "-"}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Quốc gia:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{user.address?.country || "-"}</span>
              )}
            </div>

            <div className={styles.buttons}>
              {!isEditing ? (
                <button onClick={handleEdit} className={styles.buttonEdit}>
                  Chỉnh sửa
                </button>
              ) : (
                <button onClick={handleSave} className={styles.buttonSave}>
                  Lưu thông tin
                </button>
              )}
            </div>

            {message && <p className={styles.message}>{message}</p>}
          </div>
        ) : (
          <p>{message || "Đang tải thông tin người dùng..."}</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
