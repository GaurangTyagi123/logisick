import { Router } from 'express';
import {
    addItem,
    deleteItem,
    getAllItems,
    getItem,
    getItemBySKU,
    itemsReport,
    searchItem,
    updateItem,
} from '../controllers/items.controller';
import { protect, restrictTo } from '../controllers/auth.controller';

const itemRouter = Router();
itemRouter.route('/:SKU').get(getItemBySKU);
itemRouter.route('/allItems/:orgid').get(protect, getAllItems);
itemRouter.route('/search/:orgid').get(searchItem);
itemRouter.route('/report/:orgid').get(protect,restrictTo("Staff","Manager","Owner"), itemsReport);

itemRouter.route('/').post(protect, addItem);

itemRouter
    .route('/:itemId')
    .get(protect, getItem)
    .patch(protect, updateItem)
    .delete(protect, deleteItem);

export default itemRouter;
