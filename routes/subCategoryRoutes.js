import express from 'express';
import {
	createSubCategory,
	getSubCategories,
	getSubByCategory,
	updateSubCategory,
	deleteSubCategory,
} from '../controllers/subCategoryController.js';

const router = express.Router();

router.post('/', createSubCategory);
router.get('/', getSubCategories);
// Get subcategories for a specific category id
router.get('/category/:categoryId', getSubByCategory);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

export default router;