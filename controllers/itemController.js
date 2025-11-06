import Item from "../models/Item.js";

// Create
export const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all
export const getItems = async (req, res) => {
  const items = await Item.find().populate("category subCategory");
  res.json(items);
};

// Search by name
export const searchItem = async (req, res) => {
  const { name } = req.query;
  const items = await Item.find({ name: new RegExp(name, "i") });
  res.json(items);
};

// Edit
export const updateItem = async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Delete
export const deleteItem = async (req, res) => {
  try {
    console.log('[DELETE] /api/items/', req.params.id);
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
