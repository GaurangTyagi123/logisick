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
// end-point to get item by SKU (Stock Keeping Unit)
itemRouter.route('/:SKU').get(getItemBySKU);

// end-point to get all the items belonging to a particular organization
itemRouter.route('/allItems/:orgid').get(protect, getAllItems);

// end-point to search items
itemRouter.route('/search/:orgid').get(searchItem);

// end-point to generate report for an inventory
itemRouter
    .route('/report/:orgid')
    .get(protect, restrictTo('Staff', 'Manager', 'Owner'), itemsReport);

// end-point to add an item to inventory
itemRouter.route('/').post(protect, addItem);

// end-point to (create,update and delete) item
itemRouter
    .route('/:itemId')
    .get(protect, getItem)
    .patch(protect, updateItem)
    .delete(protect, deleteItem);

export default itemRouter;
