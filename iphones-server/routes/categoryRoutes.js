// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const checkAdmin = require('../middlewares/checkAdmin');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

//Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

//Admin routes (require token + admin)
// router.post('/', authJwt, checkAdmin, createCategory);
// router.put('/:id', authJwt, checkAdmin, updateCategory);
// router.delete('/:id', authJwt, checkAdmin, deleteCategory);



module.exports = router;
