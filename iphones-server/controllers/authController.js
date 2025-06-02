// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
const registerUser = async (req, res) => {
    try {
        const existing = await User.findOne({ email: req.body.email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            address: req.body.address,
            isAdmin: req.body.isAdmin || false
        });

        const savedUser = await user.save();
        const { passwordHash, ...userData } = savedUser.toObject();
        res.status(201).json(userData);
    } catch (err) {
        res.status(400).json({ message: 'Register failed', error: err.message });
    }
};

// Đăng nhập
const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isValid = bcrypt.compareSync(req.body.password, user.passwordHash);
        if (!isValid) return res.status(400).json({ message: 'Wrong password' });

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};
