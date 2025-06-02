// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { Spin, Typography, Alert, Card, List, Button, Image } from "antd";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import styles from "./OrderDetail.module.css";

// const { Title, Text } = Typography;

// const OrderDetailPage = () => {
//     const { id } = useParams();
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchOrderDetail = async () => {
//             const userData = localStorage.getItem("user");
//             if (!userData) {
//                 setError("Không tìm thấy thông tin người dùng.");
//                 setLoading(false);
//                 return;
//             }

//             if (!id) {
//                 setError("Không tìm thấy mã đơn hàng.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const { token } = JSON.parse(userData);

//                 const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (!res.ok) {
//                     const errorData = await res.json();
//                     throw new Error(errorData.message || "Không thể tải chi tiết đơn hàng.");
//                 }

//                 const data = await res.json();
//                 setOrder(data);
//             } catch (err) {
//                 console.error("Lỗi khi tải chi tiết đơn hàng:", err.message);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrderDetail();
//     }, [id]);

//     const formatPaymentMethod = (method) => ({
//         BankTransfer: "Chuyển khoản ngân hàng",
//         COD: "Thanh toán khi nhận hàng (COD)",
//         MoMo: "Thanh toán qua MoMo",
//     }[method] || method);

//     const formatStatus = (status) => ({
//         pending: "Đang chờ xác nhận",
//         confirmed: "Đã xác nhận và đang vận chuyển",
//         delivering: "Đang giao hàng",
//         completed: "Hoàn tất",
//         cancelled: "Đã hủy",
//     }[status] || status);

//     return (
//         <div>
//             <Header />
//             <div className={styles.container}>
//                 {loading ? (
//                     <div className={styles.loading}>
//                         <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
//                     </div>
//                 ) : error ? (
//                     <Alert type="error" message={error} />
//                 ) : order ? (
//                     <div>
//                         <Title level={2} className={styles.title}>
//                             Chi tiết đơn hàng
//                         </Title>
//                         <Card bordered className={styles.orderCard}>
//                             <p><Text strong>Mã đơn hàng:</Text> {order._id}</p>
//                             <p><Text strong>Ngày tạo:</Text> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Không xác định"}</p>
//                             <p>
//                                 <Text strong>Trạng thái:</Text> {formatStatus(order.status)}{" "}
//                                 {order.updatedAt && (
//                                     <Text type="secondary">(cập nhật lúc {new Date(order.updatedAt).toLocaleString()})</Text>
//                                 )}
//                             </p>
//                             <p><Text strong>Phương thức thanh toán:</Text> {formatPaymentMethod(order.paymentMethod)}</p>
//                             <p><Text strong>Tổng tiền:</Text> {order.totalPrice ? order.totalPrice.toLocaleString() : "Không xác định"} VND</p>

//                             <div className={styles.shippingInfo}>
//                                 <Title level={4}>Thông tin giao hàng</Title>
//                                 {order.shippingAddress ? (
//                                     <>
//                                         <p><Text strong>Người nhận:</Text> {order.user.name || "Không xác định"}</p>
//                                         <p><Text strong>Số điện thoại:</Text> {order.phone || "Không xác định"}</p>
//                                         <p><Text strong>Địa chỉ:</Text> {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}</p>
//                                     </>
//                                 ) : (
//                                     <Alert type="info" message="Không có thông tin giao hàng." />
//                                 )}
//                             </div>

//                             <div className={styles.itemsList}>
//                                 <Title level={4}>Danh sách sản phẩm</Title>
//                                 {order.orderItems && order.orderItems.length > 0 ? (
//                                     <List
//                                         dataSource={order.orderItems}
//                                         renderItem={(item) => (
//                                             <List.Item key={item._id}>
//                                                 <div className={styles.productItem}>
//                                                     <Image
//                                                         width={100}
//                                                         src={item.product.image}
//                                                         alt={item.product.name}
//                                                     />
//                                                     <div className={styles.productInfo}>
//                                                         <Text strong>{item.product.name}</Text>
//                                                         <p>Mã sản phẩm: {item.variantSku}</p>
//                                                         <p>Số lượng: {item.quantity}</p>
//                                                         <p>Giá: {item.product.variants.find(v => v.sku === item.variantSku)?.finalPrice.toLocaleString()} VND</p>
//                                                     </div>
//                                                 </div>
//                                             </List.Item>
//                                         )}
//                                         bordered
//                                     />
//                                 ) : (
//                                     <Alert type="info" message="Đơn hàng này không có sản phẩm." />
//                                 )}
//                             </div>

//                             <Link to="/orders">
//                                 <Button type="primary" className={styles.backButton} style={{ marginTop: 20, padding:5 }}>
//                                     Quay lại danh sách đơn hàng
//                                 </Button>
//                             </Link>
//                         </Card>
//                     </div>
//                 ) : (
//                     <p>Không tìm thấy đơn hàng.</p>
//                 )}
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default OrderDetailPage;


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Typography, Alert, Card, List, Button, Image, Tag } from "antd";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./OrderDetail.module.css";

const { Title, Text } = Typography;

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            const userData = localStorage.getItem("user");
            if (!userData) {
                setError("Không tìm thấy thông tin người dùng.");
                setLoading(false);
                return;
            }

            if (!id) {
                setError("Không tìm thấy mã đơn hàng.");
                setLoading(false);
                return;
            }

            try {
                const { token } = JSON.parse(userData);
                const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Không thể tải chi tiết đơn hàng.");
                }

                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết đơn hàng:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    const formatPaymentMethod = (method) =>
    ({
        BankTransfer: "Chuyển khoản ngân hàng",
        COD: "Thanh toán khi nhận hàng (COD)",
        MoMo: "Thanh toán qua MoMo",
    }[method] || method);


    const formatStatus = (status) => {
        switch (status) {
            case "pending":
                return <Tag color="gold">Đang chờ xác nhận</Tag>;
            case "confirmed":
                return <Tag color="blue">Đã xác nhận</Tag>;
            case "delivering":
                return <Tag color="cyan">Đang giao hàng</Tag>;
            case "completed":
                return <Tag color="green">Hoàn tất</Tag>;
            case "cancelled":
                return <Tag color="red">Đã hủy</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const formatPaymentStatus = (status) => {
        switch (status) {
            case "unpaid":
                return <Tag color="red">Chưa thanh toán</Tag>;
            case "paid":
                return <Tag color="green">Đã thanh toán</Tag>;
            case "failed":
                return <Tag color="volcano">Thanh toán thất bại</Tag>;
            case "cancelled":
                return <Tag color="default">Đã hủy</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>
                        <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
                    </div>
                ) : error ? (
                    <Alert type="error" message={error} />
                ) : order ? (
                    <div>
                        <Title level={2} className={styles.title}>
                            Chi tiết đơn hàng
                        </Title>
                        <Card bordered className={styles.orderCard}>
                            <p><Text strong>Mã đơn hàng:</Text> {order._id}</p>
                            <p><Text strong>Ngày tạo:</Text> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><Text strong>Trạng thái đơn hàng:</Text> {formatStatus(order.status)}</p>
                            <p><Text strong>Trạng thái thanh toán:</Text> {formatPaymentStatus(order.paymentStatus)}</p>
                            {order.paidAt && <p><Text strong>Thời gian thanh toán:</Text> {new Date(order.paidAt).toLocaleString()}</p>}
                            <p><Text strong>Phương thức thanh toán:</Text> {formatPaymentMethod(order.paymentMethod)}</p>
                            {/* <p><Text strong>Tổng tiền:</Text> {order.totalPrice.toLocaleString()} VND</p> */}
                            <p>
                                <Text strong>Tổng tiền: </Text>
                                <Text strong className={styles.totalAmount}>
                                    {order.totalPrice.toLocaleString()} VND
                                </Text>
                            </p>


                            <div className={styles.shippingInfo}>
                                <Title level={4}>Thông tin giao hàng</Title>
                                <p><Text strong>Người nhận:</Text> {order.user?.name || "Không xác định"}</p>
                                <p><Text strong>Số điện thoại:</Text> {order.phone || "Không xác định"}</p>
                                <p>
                                    <Text strong>Địa chỉ:</Text>{" "}
                                    {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
                                </p>
                            </div>

                            <div className={styles.itemsList}>
                                <Title level={4}>Danh sách sản phẩm</Title>
                                <List
                                    dataSource={order.orderItems}
                                    renderItem={(item) => (
                                        <List.Item key={item._id}>
                                            <div className={styles.productItem}>
                                                <Image width={80} src={item.product.image} alt={item.product.name} />
                                                <div className={styles.productInfo}>
                                                    <Text strong>{item.product.name}</Text>
                                                    <p>Mã sản phẩm: {item.variantSku}</p>
                                                    <p>Số lượng: {item.quantity}</p>
                                                    <p>
                                                        Đơn giá:{" "}
                                                        {item.product.variants.find((v) => v.sku === item.variantSku)?.price.toLocaleString()}{" "}
                                                        VND
                                                    </p>
                                                </div>
                                            </div>
                                        </List.Item>
                                    )}
                                    bordered
                                />
                            </div>

                            <Link to="/orders">
                                <Button type="primary" className={styles.backButton} style={{ marginTop: 20 }}>
                                    Quay lại danh sách đơn hàng
                                </Button>
                            </Link>
                        </Card>
                    </div>
                ) : (
                    <p>Không tìm thấy đơn hàng.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default OrderDetailPage;
