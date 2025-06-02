// controllers/categoryController.js
const Category = require('../models/Category');

// GET all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories', error: err.message });
  }
};

// GET category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving category', error: err.message });
  }
};

// POST create new category
const createCategory = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: 'Error creating category', error: err.message });
  }
};

// PUT update category
const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating category', error: err.message });
  }
};

// DELETE category
const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
