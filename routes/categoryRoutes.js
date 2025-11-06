import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:idOrName", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
