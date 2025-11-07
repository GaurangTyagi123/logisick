import { Router } from 'express';
import {
    addItem,
    deleteItem,
    getAllItems,
    getItem,
    getItemBySKU,
    updateItem,
} from '../controllers/items.controller';
import { protect } from '../controllers/auth.controller';

const itemRouter = Router();
itemRouter.route('/:SKU').get(getItemBySKU);
itemRouter.route('/allItems/:orgId').get(protect, getAllItems);
itemRouter.route('/').post(protect, addItem);
itemRouter.route('/:itemId')
    .get(protect, getItem)
    .patch(protect,updateItem)
    .delete(protect, deleteItem)

export default itemRouter;
