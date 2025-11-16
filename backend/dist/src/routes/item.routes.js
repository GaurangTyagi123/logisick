"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const items_controller_1 = require("../controllers/items.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const itemRouter = (0, express_1.Router)();
// end-point to get item by SKU (Stock Keeping Unit)
itemRouter.route('/:SKU').get(items_controller_1.getItemBySKU);
// end-point to get all the items belonging to a particular organization
itemRouter.route('/allItems/:orgid').get(auth_controller_1.protect, items_controller_1.getAllItems);
// end-point to search items
itemRouter.route('/search/:orgid').get(auth_controller_1.protect, items_controller_1.searchItem);
// end-point to generate report for an inventory
itemRouter
    .route('/report/:orgid')
    .get(auth_controller_1.protect, (0, auth_controller_1.restrictTo)('Staff', 'Manager', 'Owner'), items_controller_1.itemsReport);
// end-point to add an item to inventory
itemRouter.route('/').post(auth_controller_1.protect, items_controller_1.addItem);
// end-point to (create,update and delete) item
itemRouter
    .route('/:itemId')
    .get(auth_controller_1.protect, items_controller_1.getItem)
    .patch(auth_controller_1.protect, items_controller_1.updateItem)
    .delete(auth_controller_1.protect, items_controller_1.deleteItem);
exports.default = itemRouter;
