import React, { useEffect, useState } from "react";
import { Spin, Table, Typography, Alert, Modal, Button } from "antd";
import { Tag } from "antd";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./Orders.module.css";

const { Title } = Typography;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrders = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("Không tìm thấy thông tin người dùng.");
      setLoading(false);
      return;
    }

    try {
      const { _id, id } = JSON.parse(userData);
      const userId = _id || id;

      const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
      if (!res.ok) throw new Error("Không thể tải đơn hàng.");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPaymentMethod = (method) => {
    const map = {
      BankTransfer: "Chuyển khoản ngân hàng",
      COD: "Thanh toán khi nhận hàng (COD)",
    };
    return map[method] || method;
  };

  // const formatStatus = (status) => {
  //   const map = {
  //     pending: "Đang chờ xác nhận",
  //     confirmed: "Đã xác nhận và đang vận chuyển",
  //     delivering: "Đã giao",
  //     completed: "Hoàn tất",
  //     cancelled: "Đã hủy",
  //   };
  //   return map[status] || status;
  // };

const formatStatus = (status) => {
  const map = {
    pending: { label: "Đang chờ xác nhận", color: "default" },
    confirmed: { label: "Đã xác nhận và đang vận chuyển", color: "blue" },
    delivering: { label: "Đang giao", color: "orange" },
    completed: { label: "Hoàn tất", color: "green" },
    cancelled: { label: "Đã hủy", color: "red" },
  };

  const statusInfo = map[status] || { label: status, color: "default" };

  return (
    <div style={{ textAlign: "center", whiteSpace: "normal" }}>
      <Tag color={statusInfo.color} style={{ whiteSpace: "normal", padding: "4px 8px" }}>
        {statusInfo.label}
      </Tag>
    </div>
  );
};


  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    setCancelling(true);

    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("Không tìm thấy thông tin người dùng.");
      setCancelling(false);
      return;
    }

    try {
      const { token } = JSON.parse(userData);

      const res = await fetch(`http://localhost:5000/api/orders/${orderToCancel}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể hủy đơn hàng.");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderToCancel ? { ...order, status: "cancelled" } : order
        )
      );

      setIsModalOpen(false);
      setOrderToCancel(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (address) => 
        address ? `${address.street}, ${address.city}, ${address.country}` : "N/A",
    },
    {
      title: "Sản phẩm",
      dataIndex: "orderItems",
      key: "orderItems",
      render: (items) => (
        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item._id}>
              {item.variantSku} - SL: {item.quantity}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: formatPaymentMethod,
    },
    {
      title: "Tổng tiền (VND)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => price.toLocaleString(),
    },
   
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: formatStatus,
      align: "center",
    },
    
    
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className={styles["action-buttons"]}>
          {record.status === "pending" && (
            <Button
              danger
              onClick={() => {
                setOrderToCancel(record._id);
                setIsModalOpen(true);
              }}
            >
              Hủy đơn
            </Button>
          )}
          <Link to={`/orderdetail/${record._id}`}>
            <Button type="primary" style={{ marginLeft: 8 }}>
              Xem chi tiết
            </Button>
          </Link>
        </div>
      ),
    }
  ];

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <Title level={2} className={styles.title}>
          Đơn hàng của bạn
        </Title>

        {loading ? (
          <div className={styles.loading}>
            <Spin size="large" tip="Đang tải đơn hàng..." />
          </div>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : orders.length === 0 ? (
          <p className={styles.status}>Không có đơn hàng nào.</p>
        ) : (
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>

      <Modal
        title="Xác nhận hủy đơn hàng"
        open={isModalOpen}
        onOk={handleCancelOrder}
        confirmLoading={cancelling}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
      </Modal>

      <Footer />
    </div>
  );
};

export default OrdersPage;
