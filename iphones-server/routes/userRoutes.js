// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const checkAdmin = require('../middlewares/checkAdmin');

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    registerUser
} = require('../controllers/userController');


// Ai cũng cần token để truy cập
router.get('/', getAllUsers);         // Chỉ admin xem toàn bộ user
router.get('/:id',  getUserById);                  // User xem thông tin của chính mình hoặc admin


router.post('/',  createUser);         // Admin tạo user
router.put('/:id', updateUser);       // Admin sửa user
router.delete('/:id', deleteUser);    // Admin xóa user


// CRUD user - chỉ admin
// router.post('/', authJwt, checkAdmin, getAllUsers);
// router.post('/',authJwt, checkAdmin, createUser);
// router.put('/:id', authJwt, checkAdmin, updateUser);
// router.delete('/:id', authJwt, checkAdmin, deleteUser);  


// Route cho đăng nhập và đăng ký
// Không cần token để đăng nhập và đăng ký
router.post('/login', loginUser); // Đăng nhập
router.post('/register', registerUser); // Đăng ký


module.exports = router;
