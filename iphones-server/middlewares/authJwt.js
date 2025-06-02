// middlewares/authJwt.js
const jwt = require('jsonwebtoken');

const authJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        //Gán vào req.user để controller dùng
        //req.user = decoded; // Gán toàn bộ thông tin user vào req.user

        // Hoặc chỉ gán id và isAdmin nếu không cần toàn bộ thông tin
        req.user = {
            id: decoded.userId,
            isAdmin: decoded.isAdmin
        };

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authJwt;
