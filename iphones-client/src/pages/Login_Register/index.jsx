import React, { useState } from "react";
import styles from "./LoginRegister.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      if (user?.isAdmin === true) {
        setError("Tài khoản Admin không được phép đăng nhập.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Sai email hoặc mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        phone,
      });

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
    } catch (err) {
      console.error(err);
      setError("Email đã được sử dụng hoặc lỗi đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {showToast && (
        <div className={`${styles.toast} ${showToast ? styles.show : ""}`}>
          Đăng ký thành công! Vui lòng đăng nhập.
        </div>
      )}
      <button className={styles.backButton} onClick={() => navigate("/")}>
        Về Trang Chủ
      </button>

      <form
        className={styles.form}
        onSubmit={isLogin ? handleLogin : handleRegister}
      >
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>

        {!isLogin && (
          <>
            <label>Họ và tên:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </>
        )}

        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Mật khẩu:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {!isLogin && (
          <>
            <label>Nhập lại mật khẩu:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}

        {!isLogin && (
          <>
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </>
        )}

        {isLogin && (
          <div className={styles.options}>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Lưu mật khẩu
            </label>
            <span className={styles.forgot}>Quên mật khẩu?</span>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>

        <p className={styles.toggle}>
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginRegisterPage;
