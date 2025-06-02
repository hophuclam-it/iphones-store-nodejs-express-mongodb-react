// const express = require('express');
// const router = express.Router();
// const querystring = require('querystring');
// const crypto = require('crypto');
// const moment = require('moment');
// const axios = require('axios');

// router.post('/vnpay', (req, res) => {
//   const { amount, orderId, orderDescription, bankCode } = req.body;

//   const vnp_TmnCode = process.env.VNP_TMNCODE; // Mã website của bạn tại VNPay
//   const vnp_HashSecret = process.env.VNP_HASHSECRET; // Chuỗi bí mật của bạn tại VNPay
//   const vnp_Url = process.env.VNP_URL; // URL thanh toán của VNPay
//   const vnp_ReturnUrl = process.env.VNP_RETURNURL; // URL trả về sau khi thanh toán

//   const date = new Date();
//   const createDate = moment(date).format('YYYYMMDDHHmmss');
//   const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   const vnp_Params = {
//     vnp_Version: '2.1.0',
//     vnp_Command: 'pay',
//     vnp_TmnCode: vnp_TmnCode,
//     vnp_Locale: 'vn',
//     vnp_CurrCode: 'VND',
//     vnp_TxnRef: orderId,
//     vnp_OrderInfo: orderDescription,
//     vnp_OrderType: 'billpayment',
//     vnp_Amount: amount * 100, // VNPay yêu cầu số tiền tính bằng đồng (VND) nhân 100
//     vnp_ReturnUrl: vnp_ReturnUrl,
//     vnp_IpAddr: ipAddr,
//     vnp_CreateDate: createDate,
//   };

//   if (bankCode) {
//     vnp_Params['vnp_BankCode'] = bankCode;
//   }

//   // Sắp xếp các tham số theo thứ tự alphabet
//   const sortedParams = Object.keys(vnp_Params)
//     .sort()
//     .reduce((result, key) => {
//       result[key] = vnp_Params[key];
//       return result;
//     }, {});

//   // Tạo chữ ký
//   const signData = querystring.stringify(sortedParams, { encode: false });
//   const hmac = crypto.createHmac('sha512', vnp_HashSecret);
//   const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

//   sortedParams['vnp_SecureHash'] = signed;

//   const paymentUrl = `${vnp_Url}?${querystring.stringify(sortedParams)}`;
//   res.status(200).json({ paymentUrl });
// });

// // Hàm sắp xếp tham số theo thứ tự alphabet
// function sortObject(obj) {
//   const sorted = {};
//   const keys = Object.keys(obj).sort();
//   keys.forEach((key) => {
//     sorted[key] = obj[key];
//   });
//   return sorted;
// }

// // Route xử lý tạo token
// router.post('/vnpay/token-create', (req, res) => {
//   const {
//     appUserId,
//     bankCode,
//     cardType,
//     txnDesc,
//     cancelUrl,
//     amount,
//   } = req.body;

//   const vnp_TmnCode = process.env.VNP_TMNCODE; // Mã website của bạn tại VNPay
//   const vnp_HashSecret = process.env.VNP_HASHSECRET; // Chuỗi bí mật của bạn tại VNPay
//   const vnp_Url = process.env.VNP_URL; // URL thanh toán của VNPay
//   const vnp_ReturnUrl = process.env.VNP_RETURNURL; // URL trả về sau khi tạo token

//   const date = new Date();
//   const createDate = moment(date).format('YYYYMMDDHHmmss');
//   const txnRef = `TOKEN_${moment(date).format('DDHHmmss')}`; // Mã giao dịch duy nhất
//   const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   const vnp_Params = {
//     vnp_Version: '2.1.0',
//     vnp_Command: 'token_create',
//     vnp_TmnCode: vnp_TmnCode,
//     vnp_AppUserId: appUserId,
//     vnp_Locale: 'vn',
//     vnp_CurrCode: 'VND',
//     vnp_TxnRef: txnRef,
//     vnp_TxnDesc: txnDesc || 'Tạo mới token',
//     vnp_Amount: amount * 100, // Số tiền nhân 100
//     vnp_ReturnUrl: vnp_ReturnUrl,
//     vnp_CancelUrl: cancelUrl || vnp_ReturnUrl,
//     vnp_IpAddr: ipAddr,
//     vnp_CreateDate: createDate,
//     vnp_CardType: cardType, // 01: Nội địa, 02: Quốc tế
//   };

//   if (bankCode) {
//     vnp_Params['vnp_BankCode'] = bankCode;
//   }

//   // Sắp xếp tham số theo thứ tự alphabet
//   const sortedParams = sortObject(vnp_Params);

//   // Tạo chữ ký
//   const signData = querystring.stringify(sortedParams, { encode: false });
//   const hmac = crypto.createHmac('sha512', vnp_HashSecret);
//   const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

//   sortedParams['vnp_SecureHash'] = signed;

//   // Tạo URL thanh toán
//   const paymentUrl = `${vnp_Url}?${querystring.stringify(sortedParams)}`;
//   res.status(200).json({ paymentUrl });
// });


// router.post('/momo', async (req, res) => {
//   const { amount, orderId, orderInfo, returnUrl, notifyUrl } = req.body;

//   // Kiểm tra các tham số đầu vào
//   if (!amount || !orderInfo || !returnUrl || !notifyUrl) {
//     return res.status(400).json({ message: 'Thiếu tham số bắt buộc.' });
//   }

//   const partnerCode = process.env.MOMO_PARTNER_CODE; // Mã đối tác
//   const accessKey = process.env.MOMO_ACCESS_KEY; // Khóa truy cập
//   const secretKey = process.env.MOMO_SECRET_KEY; // Khóa bí mật
//   const endpoint = process.env.MOMO_ENDPOINT; // URL API MoMo

//   const requestId = `${partnerCode}_${Date.now()}`;
//   const orderIdUnique = orderId || `ORDER_${Date.now()}`;
//   const expire = moment().add(15, 'minutes').format('YYYY-MM-DDTHH:mm:ss+07:00');

//   const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${notifyUrl}&orderId=${orderIdUnique}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;

//   // Tạo chữ ký
//   const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

//   const requestBody = {
//     partnerCode,
//     accessKey,
//     requestId,
//     amount,
//     orderId: orderIdUnique,
//     orderInfo,
//     redirectUrl: returnUrl,
//     ipnUrl: notifyUrl,
//     extraData: '',
//     requestType: 'captureWallet',
//     signature,
//     lang: 'vi',
//     autoCapture: true,
//     paymentExpireDate: expire,
//   };

//   try {
//     // Gửi yêu cầu đến MoMo
//     const response = await axios.post(endpoint, requestBody);
//     res.status(200).json(response.data); // Trả về kết quả từ MoMo
//   } catch (error) {
//     console.error('Lỗi khi tạo thanh toán MoMo:', error.response?.data || error.message);
//     res.status(500).json({ message: 'Lỗi khi tạo thanh toán MoMo', error: error.response?.data || error.message });
//   }
// });

// router.post('/momo-notify', async (req, res) => {
//   try {
//     const {
//       partnerCode, orderId, requestId, amount, orderInfo, orderType,
//       resultCode, message, payType, responseTime, extraData, signature
//     } = req.body;

//     // Log toàn bộ request để debug nếu cần
//     console.log('MoMo notify payload:', req.body);

//     const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}`;
//     const expectedSignature = crypto.createHmac('sha256', process.env.MOMO_SECRET_KEY)
//                                      .update(rawSignature)
//                                      .digest('hex');

//     if (signature !== expectedSignature) {
//       console.error('Chữ ký không hợp lệ từ MoMo!');
//       return res.status(400).json({ message: 'Invalid signature' });
//     }

//     const order = await Order.findById(orderId); // Giờ chắc chắn tìm được

//     if (!order) {
//       return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
//     }

//     if (order.paymentStatus === 'paid') {
//       return res.status(200).json({ message: 'Order already paid' });
//     }

//     if (resultCode === 0) {
//       order.paymentStatus = 'paid';
//       order.paidAt = new Date();
//       order.status = 'confirmed';
//     } else {
//       order.paymentStatus = 'failed';
//       order.status = 'cancelled';
//     }

//     order.paymentResult = {
//       orderId,
//       requestId,
//       amount,
//       orderInfo,
//       orderType,
//       resultCode,
//       message,
//       payType,
//       responseTime,
//     };

//     await order.save();
//     console.log(`Đã cập nhật đơn hàng ${orderId} với trạng thái: ${order.status}`);
//     res.status(200).json({ message: 'Received' });
//   } catch (error) {
//     console.error('Lỗi khi xử lý momo-notify:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });



// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const querystring = require('querystring');
// const crypto = require('crypto');
// const moment = require('moment');
// const axios = require('axios');

// // Utilities
// const sortObject = (obj) =>
//   Object.keys(obj).sort().reduce((sorted, key) => {
//     sorted[key] = obj[key];
//     return sorted;
//   }, {});

// const createVNPaySignature = (params, secretKey) => {
//   const signData = querystring.stringify(params, { encode: false });
//   return crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex');
// };

// const createMoMoSignature = (rawSignature, secretKey) => {
//   return crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
// };

// // VNPay Payment Route
// router.post('/vnpay', (req, res) => {
//   const { amount, orderId, orderDescription, bankCode } = req.body;
//   const {
//     VNP_TMNCODE,
//     VNP_HASHSECRET,
//     VNP_URL,
//     VNP_RETURNURL
//   } = process.env;

//   const createDate = moment().format('YYYYMMDDHHmmss');
//   const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   const vnp_Params = {
//     vnp_Version: '2.1.0',
//     vnp_Command: 'pay',
//     vnp_TmnCode: VNP_TMNCODE,
//     vnp_Locale: 'vn',
//     vnp_CurrCode: 'VND',
//     vnp_TxnRef: orderId,
//     vnp_OrderInfo: orderDescription,
//     vnp_OrderType: 'billpayment',
//     vnp_Amount: amount * 100,
//     vnp_ReturnUrl: VNP_RETURNURL,
//     vnp_IpAddr: ipAddr,
//     vnp_CreateDate: createDate,
//   };

//   if (bankCode) vnp_Params.vnp_BankCode = bankCode;

//   const sortedParams = sortObject(vnp_Params);
//   const signature = createVNPaySignature(sortedParams, VNP_HASHSECRET);
//   sortedParams.vnp_SecureHash = signature;

//   const paymentUrl = `${VNP_URL}?${querystring.stringify(sortedParams)}`;
//   res.status(200).json({ paymentUrl });
// });


// // MoMo Payment Route
// router.post('/momo', async (req, res) => {
//   const { amount, orderId, orderInfo, returnUrl, notifyUrl } = req.body;
//   if (!amount || !orderInfo || !returnUrl || !notifyUrl) {
//     return res.status(400).json({ message: 'Thiếu tham số bắt buộc.' });
//   }

//   const {
//     MOMO_PARTNER_CODE,
//     MOMO_ACCESS_KEY,
//     MOMO_SECRET_KEY,
//     MOMO_ENDPOINT
//   } = process.env;

//   const requestId = `${MOMO_PARTNER_CODE}_${Date.now()}`;
//   const orderIdUnique = orderId || `ORDER_${Date.now()}`;
//   const expire = moment().add(15, 'minutes').format('YYYY-MM-DDTHH:mm:ss+07:00');

//   const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${notifyUrl}&orderId=${orderIdUnique}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;
//   const signature = createMoMoSignature(rawSignature, MOMO_SECRET_KEY);

//   const requestBody = {
//     partnerCode: MOMO_PARTNER_CODE,
//     accessKey: MOMO_ACCESS_KEY,
//     requestId,
//     amount,
//     orderId: orderIdUnique,
//     orderInfo,
//     redirectUrl: returnUrl,
//     ipnUrl: notifyUrl,
//     extraData: '',
//     requestType: 'captureWallet',
//     signature,
//     lang: 'vi',
//     autoCapture: true,
//     paymentExpireDate: expire,
//   };

//   try {
//     const response = await axios.post(MOMO_ENDPOINT, requestBody);
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Lỗi khi tạo thanh toán MoMo:', error.response?.data || error.message);
//     res.status(500).json({ message: 'Lỗi khi tạo thanh toán MoMo', error: error.response?.data || error.message });
//   }
// });

// // MoMo Notification Handler
// router.post('/momo-notify', async (req, res) => {
//   try {
//     const {
//       partnerCode, orderId, requestId, amount, orderInfo, orderType,
//       resultCode, message, payType, responseTime, extraData, signature
//     } = req.body;

//     console.log('MoMo notify payload:', req.body);

//     const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}`;
//     const expectedSignature = createMoMoSignature(rawSignature, process.env.MOMO_SECRET_KEY);

//     if (signature !== expectedSignature) {
//       console.error('Chữ ký không hợp lệ từ MoMo!');
//       return res.status(400).json({ message: 'Invalid signature' });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

//     if (order.paymentStatus === 'paid') {
//       return res.status(200).json({ message: 'Order already paid' });
//     }

//     order.paymentStatus = resultCode === 0 ? 'paid' : 'failed';
//     order.status = resultCode === 0 ? 'confirmed' : 'cancelled';
//     if (resultCode === 0) order.paidAt = new Date();

//     order.paymentResult = {
//       orderId, requestId, amount, orderInfo, orderType, resultCode, message, payType, responseTime
//     };

//     await order.save();
//     console.log(`Đã cập nhật đơn hàng ${orderId} với trạng thái: ${order.status}`);
//     res.status(200).json({ message: 'Received' });
//   } catch (error) {
//     console.error('Lỗi khi xử lý momo-notify:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const crypto = require('crypto');
const moment = require('moment');
const axios = require('axios');
const Order = require('../models/Order');

// ======== Utility Functions ========
const sortObject = (obj) =>
  Object.keys(obj).sort().reduce((sorted, key) => {
    sorted[key] = obj[key];
    return sorted;
  }, {});

const createVNPaySignature = (params, secretKey) => {
  const signData = querystring.stringify(params, { encode: false });
  return crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex');
};

const createMoMoSignature = (rawSignature, secretKey) => {
  return crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
};

// ======== VNPay Payment ========
router.post('/vnpay', (req, res) => {
  const { amount, orderId, orderDescription, bankCode } = req.body;
  const { VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURNURL } = process.env;

  const createDate = moment().format('YYYYMMDDHHmmss');
  const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNP_TMNCODE,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDescription,
    vnp_OrderType: 'billpayment',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: VNP_RETURNURL,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) vnp_Params.vnp_BankCode = bankCode;

  const sortedParams = sortObject(vnp_Params);
  const signature = createVNPaySignature(sortedParams, VNP_HASHSECRET);
  sortedParams.vnp_SecureHash = signature;

  const paymentUrl = `${VNP_URL}?${querystring.stringify(sortedParams)}`;
  res.status(200).json({ paymentUrl });
});

// ======== MoMo Payment ========
router.post('/momo', async (req, res) => {
  const { amount, orderId, orderInfo, returnUrl, notifyUrl } = req.body;

  if (!amount || !orderInfo || !returnUrl || !notifyUrl) {
    return res.status(400).json({ message: 'Thiếu tham số bắt buộc.' });
  }

  const {
    MOMO_PARTNER_CODE,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_ENDPOINT
  } = process.env;

  const requestId = `${MOMO_PARTNER_CODE}_${Date.now()}`;
  const orderIdUnique = orderId || `ORDER_${Date.now()}`;

  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${notifyUrl}&orderId=${orderIdUnique}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;
  const signature = createMoMoSignature(rawSignature, MOMO_SECRET_KEY);

  const requestBody = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId: orderIdUnique,
    orderInfo,
    redirectUrl: returnUrl,
    ipnUrl: notifyUrl,
    extraData: '',
    requestType: 'captureWallet',
    signature,
    lang: 'vi',
    autoCapture: true
  };

  try {
    const response = await axios.post(MOMO_ENDPOINT, requestBody);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Lỗi khi tạo thanh toán MoMo:', error.response?.data || error.message);
    res.status(500).json({ message: 'Lỗi tạo thanh toán MoMo', error: error.response?.data || error.message });
  }
});

// ======== MoMo IPN Notification ========
router.post('/momo-notify', async (req, res) => {
  try {
    const {
      partnerCode, orderId, requestId, amount, orderInfo, orderType,
      resultCode, message, payType, responseTime, extraData, signature
    } = req.body;

    console.log('MoMo notify payload:', req.body);

    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}`;
    const expectedSignature = createMoMoSignature(rawSignature, process.env.MOMO_SECRET_KEY);

    if (signature !== expectedSignature) {
      console.error('Chữ ký không hợp lệ từ MoMo!');
      return res.status(400).json({ message: 'Chữ ký không hợp lệ.' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

    if (order.paymentStatus === 'paid') {
      return res.status(200).json({ message: 'Đơn hàng đã được thanh toán.' });
    }

    order.paymentStatus = resultCode === 0 ? 'paid' : 'failed';
    order.status = resultCode === 0 ? 'confirmed' : 'cancelled';
    if (resultCode === 0) order.paidAt = new Date();

    order.paymentResult = {
      orderId, requestId, amount, orderInfo, orderType, resultCode, message, payType, responseTime
    };

    await order.save();
    console.log(`✅ Đơn hàng ${orderId} cập nhật trạng thái: ${order.status}`);
    res.status(200).json({ message: 'Thông báo đã xử lý' });
  } catch (error) {
    console.error('Lỗi xử lý /momo-notify:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
