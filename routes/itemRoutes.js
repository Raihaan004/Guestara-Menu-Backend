import express from 'express';
import { createItem, getItems, searchItem, updateItem, deleteItem } from '../controllers/itemController.js';

const router = express.Router();

router.post('/', createItem);
// GET / - list items or search by name via ?name=foo
router.get('/', async (req, res, next) => {
	try {
		if (req.query && req.query.name) return await searchItem(req, res);
		return await getItems(req, res);
	} catch (err) {
		next(err);
	}
});

router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;