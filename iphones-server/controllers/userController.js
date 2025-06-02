const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// GET all users
const getAllUsers = async (req, res) => {
    try {
        // const users = await User.find().select('-passwordHash'); //loại trừ passwordHash
        // const users = await User.find();
        const users = await User.find()
        .select('-passwordHash')        // loại bỏ trường passwordHash
        .sort({ createdAt: -1 });        // sort theo mới nhất (giảm dần)

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash'); //loại trừ passwordHash
        // const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Invalid user ID', error: err.message });
    }
};

// POST create new user
const createUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            // passwordHash: req.body.password,
            phone: req.body.phone,
            address: {
                street: req.body.address?.street,
                city: req.body.address?.city,
                zip: req.body.address?.zip,
                country: req.body.address?.country
            },
            isAdmin: req.body.isAdmin || false
        });

        const savedUser = await user.save();
        const { passwordHash, ...userData } = savedUser.toObject();
        res.status(201).json(userData);
    } catch (err) {
        res.status(400).json({ message: 'User creation failed', error: err.message });
    }
};

// PUT update user
const updateUser = async (req, res) => {
    try {
        const userExist = await User.findById(req.params.id);
        if (!userExist) return res.status(404).json({ message: 'User not found' });

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name || userExist.name,
                email: req.body.email || userExist.email,
                phone: req.body.phone || userExist.phone,
                address: req.body.address || userExist.address,
                isAdmin: req.body.isAdmin !== undefined ? req.body.isAdmin : userExist.isAdmin,
                ...(req.body.password && {
                    passwordHash: bcrypt.hashSync(req.body.password, 10) // mã hóa password
                    // passwordHash: req.body.password // lưu password nguyên bản
                })
            },
            { new: true }
        // ).select('-passwordHash');
        );


        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Update failed', error: err.message });
    }
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Deletion failed', error: err.message });
    }
};


// Đăng ký
const registerUser = async (req, res) => {
    try {
        const existing = await User.findOne({ email: req.body.email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10), // mã hóa password
            // passwordHash: req.body.password, // lưu password nguyên bản
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

        const isValid = bcrypt.compareSync(req.body.password, user.passwordHash); //kiểu mã hóa
        // const isValid = req.body.password === user.passwordHash; //kiểu nguyên bản
        if (!isValid) return res.status(400).json({ message: 'Wrong password' });

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '1h' }
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
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser
};
