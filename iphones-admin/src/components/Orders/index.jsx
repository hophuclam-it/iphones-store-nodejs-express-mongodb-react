// import React, { useEffect, useState, useMemo } from "react";
// import styles from "./Orders.module.css";
// import { Spin, Table, Typography, Alert, Select, message, Modal } from "antd";

// const { Title } = Typography;
// const { Option } = Select;

// // Constants
// const ORDER_STATUSES = {
//   pending: "Đang chờ",
//   confirmed: "Đã xác nhận",
//   delivering: "Đang giao",
//   completed: "Đã hoàn tất",
//   cancelled: "Đã hủy",
// };

// const VALID_TRANSITIONS = {
//   pending: ["confirmed", "cancelled"],
//   confirmed: ["delivering", "cancelled"],
//   delivering: ["completed"],
//   completed: [],
//   cancelled: [],
// };

// const PAYMENT_METHODS = {
//   BankTransfer: "Chuyển khoản ngân hàng",
//   COD: "Thanh toán khi nhận hàng (COD)",
// };

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [newStatus, setNewStatus] = useState(null);
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5000/api/orders");
//       if (!response.ok) throw new Error("Không thể tải đơn hàng.");
//       const data = await response.json();
//       setOrders(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isValidStatusTransition = (currentStatus, nextStatus) => {
//     return VALID_TRANSITIONS[currentStatus]?.includes(nextStatus);
//   };

//   const handleStatusChange = (orderId, option) => {
//     const value = option.value; // lấy value từ object { value, label }
//     const order = orders.find((order) => order._id === orderId);

//     if (!order) {
//       message.error("Không tìm thấy đơn hàng.");
//       return;
//     }

//     if (!isValidStatusTransition(order.status, value)) {
//       message.error("Chuyển đổi trạng thái không hợp lệ.");
//       return;
//     }

//     setSelectedOrder(order);
//     setNewStatus(value);
//     setIsModalVisible(true);
//   };


//   const confirmStatusChange = async () => {
//     if (!selectedOrder || !newStatus) return;
//     setUpdating(true);
//     try {
//       const response = await fetch(`http://localhost:5000/api/orders/${selectedOrder._id}/status`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Không thể cập nhật trạng thái.");
//       }

//       const updatedOrder = await response.json();
//       setOrders((prev) =>
//         prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
//       );

//       message.success("Cập nhật trạng thái thành công!");
//     } catch (error) {
//       console.error(error);
//       message.error(error.message || "Lỗi cập nhật trạng thái");
//     } finally {
//       setUpdating(false);
//       setIsModalVisible(false);
//       setSelectedOrder(null);
//       setNewStatus(null);
//     }
//   };

//   const cancelStatusChange = () => {
//     setIsModalVisible(false);
//     setSelectedOrder(null);
//     setNewStatus(null);
//   };

//   const statusOptions = {
//     pending: "Đang chờ",
//     confirmed: "Đã xác nhận",
//     delivering: "Đang giao",
//     completed: "Đã hoàn tất",
//     cancelled: "Đã hủy",
//   };

//   const getStatusLabel = (status) => {
//     return statusOptions[status] || status;
//   };


//   const columns = useMemo(() => [
//     {
//       title: "Mã đơn hàng",
//       dataIndex: "_id",
//       key: "_id",
//     },
//     {
//       title: "Ngày đặt",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date) => new Date(date).toLocaleString(),
//     },
//     {
//       title: "Thông tin giao hàng",
//       key: "shippingInfo",
//       render: (_, record) => {
//         const address = record.shippingAddress;
//         return address ? (
//           <div>
//             <p><strong>Người đặt:</strong> {record.user?.name || "Ẩn danh"}</p>
//             <p><strong>SĐT:</strong> {record.phone || "Không có"}</p>
//             <p><strong>Địa chỉ:</strong> {`${address.street}, ${address.city}, ${address.country}`}</p>
//           </div>
//         ) : (
//           "Không có thông tin giao hàng"
//         );
//       },
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (_, record) => (
//         <Select
//           labelInValue
//           value={{ value: record.status, label: getStatusLabel(record.status) }}
//           style={{ width: 160 }}
//           placeholder="Chọn trạng thái"
//           onChange={(option) => handleStatusChange(record._id, option)}
//         >
//           {Object.entries(statusOptions)
//             .filter(([status]) => isValidStatusTransition(record.status, status))
//             .map(([status, label]) => (
//               <Option key={status} value={status}>
//                 {label}
//               </Option>
//             ))}
//         </Select>

//       ),
//     },
//     {
//       title: "Thanh toán",
//       dataIndex: "paymentMethod",
//       key: "paymentMethod",
//       render: (method) => PAYMENT_METHODS[method] || method,
//     },
//     {
//       title: "Tổng tiền (VND)",
//       dataIndex: "totalPrice",
//       key: "totalPrice",
//       render: (price) => price.toLocaleString(),
//     },
//     {
//       title: "Sản phẩm",
//       dataIndex: "orderItems",
//       key: "orderItems",
//       render: (items) => (
//         <ul style={{ paddingLeft: 16 }}>
//           {items.map((item) => (
//             <li key={item._id}>
//               {item.variantSku} - SL: {item.quantity}
//             </li>
//           ))}
//         </ul>
//       ),
//     },
//   ], [orders, getStatusLabel, handleStatusChange, statusOptions, isValidStatusTransition]);

//   return (
//     <div className={styles.container}>
//       <Title level={2} className={styles.title}>Quản lý đơn hàng</Title>

//       <Spin spinning={loading} tip="Đang tải đơn hàng..." style={{ minHeight: "300px" }}>
//         {error ? (
//           <Alert type="error" message={error} />
//         ) : orders.length === 0 ? (
//           <p className={styles.status}>Không có đơn hàng nào.</p>
//         ) : (
//           <Table
//             dataSource={orders}
//             columns={columns}
//             rowKey="_id"
//             bordered
//             pagination={{ pageSize: 5 }}
//           />
//         )}
//       </Spin>

//       <Modal
//         title="Xác nhận thay đổi trạng thái"
// //         open={isModalVisible}
// //         onOk={confirmStatusChange}
// //         onCancel={cancelStatusChange}
// //         okButtonProps={{ loading: updating }}
// //         cancelButtonProps={{ disabled: updating }}
// //         okText="Xác nhận"
// //         cancelText="Hủy"
// //       >
// //         {selectedOrder && (
// //           <p>
// //             Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng từ{" "}
// //             <strong>{ORDER_STATUSES[selectedOrder.status]}</strong> sang{" "}
// //             <strong>{ORDER_STATUSES[newStatus]}</strong>?
// //           </p>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default OrdersPage;


// import React, { useEffect, useState, useMemo } from "react";
// import styles from "./Orders.module.css";
// import { Spin, Table, Typography, Alert, Select, message, Modal } from "antd";

// const { Title } = Typography;
// const { Option } = Select;

// // Constants
// const ORDER_STATUSES = {
//   pending: "Đang chờ",
//   confirmed: "Đã xác nhận",
//   delivering: "Đang giao",
//   completed: "Đã hoàn tất",
//   cancelled: "Đã hủy",
// };

// const VALID_TRANSITIONS = {
//   pending: ["confirmed", "cancelled"],
//   confirmed: ["delivering", "cancelled"],
//   delivering: ["completed"],
//   completed: [],
//   cancelled: [],
// };

// const PAYMENT_METHODS = {
//   BankTransfer: "Chuyển khoản ngân hàng",
//   COD: "Thanh toán khi nhận hàng (COD)",
//   MoMo: "Thanh toán qua MoMo", // Thêm MoMo vào phương thức thanh toán
// };

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [newStatus, setNewStatus] = useState(null);
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5000/api/orders");
//       if (!response.ok) throw new Error("Không thể tải đơn hàng.");
//       const data = await response.json();
//       setOrders(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isValidStatusTransition = (currentStatus, nextStatus) => {
//     return VALID_TRANSITIONS[currentStatus]?.includes(nextStatus);
//   };

//   const handleStatusChange = (orderId, option) => {
//     const value = option.value; // lấy value từ object { value, label }
//     const order = orders.find((order) => order._id === orderId);

//     if (!order) {
//       message.error("Không tìm thấy đơn hàng.");
//       return;
//     }

//     if (!isValidStatusTransition(order.status, value)) {
//       message.error("Chuyển đổi trạng thái không hợp lệ.");
//       return;
//     }

//     setSelectedOrder(order);
//     setNewStatus(value);
//     setIsModalVisible(true);
//   };

//   const confirmStatusChange = async () => {
//     if (!selectedOrder || !newStatus) return;
//     setUpdating(true);
//     try {
//       const response = await fetch(`http://localhost:5000/api/orders/${selectedOrder._id}/status`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Không thể cập nhật trạng thái.");
//       }

//       const updatedOrder = await response.json();
//       setOrders((prev) =>
//         prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
//       );

//       message.success("Cập nhật trạng thái thành công!");
//     } catch (error) {
//       console.error(error);
//       message.error(error.message || "Lỗi cập nhật trạng thái");
//     } finally {
//       setUpdating(false);
//       setIsModalVisible(false);
//       setSelectedOrder(null);
//       setNewStatus(null);
//     }
//   };

//   const cancelStatusChange = () => {
//     setIsModalVisible(false);
//     setSelectedOrder(null);
//     setNewStatus(null);
//   };

//   const statusOptions = {
//     pending: "Đang chờ",
//     confirmed: "Đã xác nhận",
//     delivering: "Đang giao",
//     completed: "Đã hoàn tất",
//     cancelled: "Đã hủy",
//   };

//   const getStatusLabel = (status) => {
//     return statusOptions[status] || status;
//   };

//   const columns = useMemo(() => [
//     {
//       title: "Mã đơn hàng",
//       dataIndex: "_id",
//       key: "_id",
//     },
//     {
//       title: "Ngày đặt",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date) => new Date(date).toLocaleString(),
//     },
//     {
//       title: "Thông tin giao hàng",
//       key: "shippingInfo",
//       render: (_, record) => {
//         const address = record.shippingAddress;
//         return address ? (
//           <div>
//             <p><strong>Người đặt:</strong> {record.user?.name || "Ẩn danh"}</p>
//             <p><strong>SĐT:</strong> {record.phone || "Không có"}</p>
//             <p><strong>Địa chỉ:</strong> {`${address.street}, ${address.city}, ${address.country}`}</p>
//           </div>
//         ) : (
//           "Không có thông tin giao hàng"
//         );
//       },
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (_, record) => (
//         <Select
//           labelInValue
//           value={{ value: record.status, label: getStatusLabel(record.status) }}
//           style={{ width: 160 }}
//           placeholder="Chọn trạng thái"
//           onChange={(option) => handleStatusChange(record._id, option)}
//         >
//           {Object.entries(statusOptions)
//             .filter(([status]) => isValidStatusTransition(record.status, status))
//             .map(([status, label]) => (
//               <Option key={status} value={status}>
//                 {label}
//               </Option>
//             ))}
//         </Select>
//       ),
//     },
//     {
//       title: "Thanh toán",
//       dataIndex: "paymentMethod",
//       key: "paymentMethod",
//       render: (method) => PAYMENT_METHODS[method] || method,
//     },
//     {
//       title: "Tổng tiền (VND)",
//       dataIndex: "totalPrice",
//       key: "totalPrice",
//       render: (price) => price.toLocaleString(),
//     },
//     {
//       title: "Sản phẩm",
//       dataIndex: "orderItems",
//       key: "orderItems",
//       render: (items) => (
//         <ul style={{ paddingLeft: 16 }}>
//           {items.map((item) => (
//             <li key={item._id}>
//               {item.variantSku} - SL: {item.quantity}
//             </li>
//           ))}
//         </ul>
//       ),
//     },
//   ], [orders, getStatusLabel, handleStatusChange, statusOptions, isValidStatusTransition]);

//   return (
//     <div className={styles.container}>
//       <Title level={2} className={styles.title}>Quản lý đơn hàng</Title>

//       <Spin spinning={loading} tip="Đang tải đơn hàng..." style={{ minHeight: "300px" }}>
//         {error ? (
//           <Alert type="error" message={error} />
//         ) : orders.length === 0 ? (
//           <p className={styles.status}>Không có đơn hàng nào.</p>
//         ) : (
//           <Table
//             dataSource={orders}
//             columns={columns}
//             rowKey="_id"
//             bordered
//             pagination={{ pageSize: 5 }}
//           />
//         )}
//       </Spin>

//       <Modal
//         title="Xác nhận thay đổi trạng thái"
//         open={isModalVisible}
//         onOk={confirmStatusChange}
//         onCancel={cancelStatusChange}
//         okButtonProps={{ loading: updating }}
//         cancelButtonProps={{ disabled: updating }}
//         okText="Xác nhận"
//         cancelText="Hủy"
//       >
//         {selectedOrder && (
//           <p>
//             Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng từ{" "}
//             <strong>{ORDER_STATUSES[selectedOrder.status]}</strong> sang{" "}
//             <strong>{ORDER_STATUSES[newStatus]}</strong>?
//           </p>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default OrdersPage;



import React, { useEffect, useState, useMemo } from "react";
import styles from "./Orders.module.css";
import {
  Spin,
  Table,
  Typography,
  Alert,
  Select,
  message,
  Modal,
  Tag,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

const ORDER_STATUSES = {
  pending: "Đang chờ",
  confirmed: "Đã xác nhận",
  delivering: "Đang giao",
  completed: "Đã hoàn tất",
  cancelled: "Đã hủy",
};

const VALID_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["delivering", "cancelled"],
  delivering: ["completed"],
  completed: [],
  cancelled: [],
};

const PAYMENT_METHODS = {
  BankTransfer: "Chuyển khoản ngân hàng",
  COD: "Thanh toán khi nhận hàng (COD)",
  MoMo: "Thanh toán qua MoMo",
};

const PAYMENT_STATUSES = {
  unpaid: { label: "Chưa thanh toán", color: "orange" },
  paid: { label: "Đã thanh toán", color: "green" },
  failed: { label: "Thanh toán thất bại", color: "red" },
  cancelled: { label: "Đã hủy", color: "red" },
};
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/orders");
      if (!response.ok) throw new Error("Không thể tải đơn hàng.");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidStatusTransition = (currentStatus, nextStatus) =>
    VALID_TRANSITIONS[currentStatus]?.includes(nextStatus);

  const handleStatusChange = (orderId, option) => {
    const value = option.value;
    const order = orders.find((order) => order._id === orderId);
    if (!order) return message.error("Không tìm thấy đơn hàng.");
    if (!isValidStatusTransition(order.status, value))
      return message.error("Chuyển đổi trạng thái không hợp lệ.");
    setSelectedOrder(order);
    setNewStatus(value);
    setIsModalVisible(true);
  };

  // const confirmStatusChange = async () => {
  //   if (!selectedOrder || !newStatus) return;
  //   setUpdating(true);
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/orders/${selectedOrder._id}/status`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status: newStatus }),
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Không thể cập nhật trạng thái.");
  //     }
  //     const updatedOrder = await response.json();
  //     setOrders((prev) =>
  //       prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
  //     );
  //     message.success("Cập nhật trạng thái thành công!");
  //   } catch (error) {
  //     message.error(error.message || "Lỗi cập nhật trạng thái");
  //   } finally {
  //     setUpdating(false);
  //     setIsModalVisible(false);
  //     setSelectedOrder(null);
  //     setNewStatus(null);
  //   }
  // };

  const confirmStatusChange = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdating(true);
    try {
      // Chuẩn bị dữ liệu cập nhật
      const updateBody = { status: newStatus };
  
      // Nếu chuyển sang "completed" và đơn chưa thanh toán
      if (newStatus === "completed" && selectedOrder.paymentStatus !== "paid") {
        updateBody.paymentStatus = "paid";
        updateBody.paidAt = new Date().toISOString(); // ISO chuẩn cho ngày giờ
      }
  
      const response = await fetch(`http://localhost:5000/api/orders/${selectedOrder._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật trạng thái.");
      }
  
      const updatedOrder = await response.json();
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
  
      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      message.error(error.message || "Lỗi cập nhật trạng thái");
    } finally {
      setUpdating(false);
      setIsModalVisible(false);
      setSelectedOrder(null);
      setNewStatus(null);
    }
  };
  
  const cancelStatusChange = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    setNewStatus(null);
  };

  const columns = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "_id",
        key: "_id",
        render: (text) => (
          <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
            {text}
          </div>
        ),
      },
      {
        title: "Ngày đặt",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => new Date(date).toLocaleString(),
      },
      {
        title: "Sản phẩm",
        dataIndex: "orderItems",
        key: "orderItems",
        render: (items) => (
          <ul style={{ paddingLeft: 16 }}>
            {items.map((item) => (
              <li key={item._id}>
                {item.variantSku} - SL: {item.quantity}
              </li>
            ))}
          </ul>
        ),
      },
      {
        title: "Thông tin giao hàng",
        key: "shippingInfo",
        render: (_, record) => {
          const addr = record.shippingAddress;
          return addr ? (
            <div>
              <p><strong>Người đặt:</strong> {record.user?.name || "Ẩn danh"}</p>
              <p><strong>SĐT:</strong> {record.phone || "Không có"}</p>
              <p><strong>Địa chỉ:</strong> {`${addr.street}, ${addr.city}, ${addr.country}`}</p>
            </div>
          ) : "Không có thông tin";
        },
      },
      {
        title: "Thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        render: (method) => PAYMENT_METHODS[method] || method,
      },
      {
        title: "Tổng tiền (VND)",
        dataIndex: "totalPrice",
        key: "totalPrice",
        render: (price) => price.toLocaleString(),
      },
      {
        title: "Trạng thái đơn",
        dataIndex: "status",
        key: "status",
        render: (_, record) => (
          <Select
            labelInValue
            value={{ value: record.status, label: ORDER_STATUSES[record.status] }}
            style={{ width: 160 }}
            onChange={(option) => handleStatusChange(record._id, option)}
          >
            {Object.entries(ORDER_STATUSES)
              .filter(([status]) => isValidStatusTransition(record.status, status))
              .map(([status, label]) => (
                <Option key={status} value={status}>
                  {label}
                </Option>
              ))}
          </Select>
        ),
      },
      {
        title: "Trạng thái thanh toán",
        key: "paymentStatus",
        render: (_, record) => {
          const status = PAYMENT_STATUSES[record.paymentStatus];
          return status ? (
            <Tag color={status.color}>{status.label}</Tag>
          ) : (
            <Tag color="default">Không rõ</Tag>
          );
        },
      },
    ],
    [orders]
  );

  return (
    <div className={styles.container}>
      <Title level={2}>Quản lý đơn hàng</Title>
      <Spin spinning={loading} tip="Đang tải đơn hàng...">
        {error ? (
          <Alert type="error" message={error} />
        ) : (
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 5 }}
          />
        )}
      </Spin>

      <Modal
        title="Xác nhận thay đổi trạng thái"
        open={isModalVisible}
        onOk={confirmStatusChange}
        onCancel={cancelStatusChange}
        okButtonProps={{ loading: updating }}
        cancelButtonProps={{ disabled: updating }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        {selectedOrder && (
          <p>
            Bạn có chắc muốn chuyển trạng thái đơn hàng từ{" "}
            <strong>{ORDER_STATUSES[selectedOrder.status]}</strong> sang{" "}
            <strong>{ORDER_STATUSES[newStatus]}</strong>?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
