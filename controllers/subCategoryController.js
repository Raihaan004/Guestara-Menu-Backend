import SubCategory from "../models/SubCategory.js";

export const createSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.create(req.body);
    res.status(201).json(subCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSubCategories = async (req, res) => {
  const subs = await SubCategory.find().populate("category");
  res.json(subs);
};

export const getSubByCategory = async (req, res) => {
  const subs = await SubCategory.find({ category: req.params.categoryId });
  res.json(subs);
};

export const updateSubCategory = async (req, res) => {
  const updated = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Delete
export const deleteSubCategory = async (req, res) => {
  try {
    console.log('[DELETE] /api/subcategories/', req.params.id);
    const deleted = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'SubCategory not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
