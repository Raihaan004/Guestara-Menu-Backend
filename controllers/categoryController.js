import Category from "../models/Category.js";

// Create category
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

// Get by ID or name
export const getCategory = async (req, res) => {
  const { idOrName } = req.params;
  const category = await Category.findOne({
    $or: [{ _id: idOrName }, { name: idOrName }],
  });
  res.json(category);
};

// Edit
export const updateCategory = async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// Delete
export const deleteCategory = async (req, res) => {
  try {
    console.log('[DELETE] /api/categories/', req.params.id);
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
