import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./ChangePassword.module.css";
import axios from "axios";
import bcrypt from "bcryptjs";

const ChangePasswordPage = () => {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và xác nhận không khớp.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${user.id}`
      );
      const userData = response.data;

      const isPasswordCorrect = bcrypt.compareSync(
        oldPassword,
        userData.passwordHash
      );

      if (!isPasswordCorrect) {
        setMessage("Mật khẩu cũ không đúng.");
        return;
      }

      await axios.put(`http://localhost:5000/api/users/${user.id}`, {
        password: newPassword,
      });

      setMessage("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        "Đổi mật khẩu thất bại: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h2>Đổi mật khẩu</h2>
        {user && <p className={styles.username}>{user.name}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="password"
            placeholder="Nhập mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Đổi mật khẩu
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default ChangePasswordPage;
