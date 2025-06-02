// ./helpers/error-handler.js

function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // Lỗi thiếu hoặc token không hợp lệ
        return res.status(401).json({ message: 'Yêu cầu token xác thực. Vui lòng đăng nhập. Tại http://localhost:3000/api/users/login' });
    }

    // Các lỗi khác
    return res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
}

module.exports = errorHandler;
