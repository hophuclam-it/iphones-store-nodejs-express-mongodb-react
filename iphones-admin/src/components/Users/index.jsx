import React, { useEffect, useState } from "react";
import styles from "./Users.module.css";
import { Spin, Table, Typography, Alert, Button, Popconfirm } from "antd";

const { Title } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) throw new Error("Không thể tải người dùng.");
        const data = await response.json();
        const filteredUsers = data.filter((user) => !user.isAdmin);
        setUsers(filteredUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Xóa người dùng không thành công.");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (address) => {
        return address && address.street
          ? `${address.street}, ${address.city}, ${address.country}`
          : "Chưa có địa chỉ";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa tài khoản này?"
          onConfirm={() => handleDelete(record._id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="danger" style={{ color: "red" }}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.container}>
        <Title level={2} className={styles.title}>
          Quản lý người dùng
        </Title>

        {loading ? (
          <div className={styles.loading}>
            <Spin size="large" tip="Đang tải người dùng..." />
          </div>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : users.length === 0 ? (
          <p className={styles.status}>Không có người dùng nào.</p>
        ) : (
          <Table
            dataSource={users}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
