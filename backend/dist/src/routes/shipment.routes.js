"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentRouter = void 0;
const express_1 = require("express");
const shipment_controller_1 = require("../controllers/shipment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.shipmentRouter = (0, express_1.Router)();
// route to create a new order
exports.shipmentRouter.route('/').post(auth_middleware_1.csrfProtection, auth_middleware_1.protect, shipment_controller_1.createOrder);
// route to get all orders of an organizqation
exports.shipmentRouter.route('/allOrders/:orgid').get(auth_middleware_1.protect, shipment_controller_1.getAllOrders);
// route to get report of the orders of an organization
exports.shipmentRouter.route('/allOrders/report/:orgid').get(auth_middleware_1.protect, shipment_controller_1.orderReport);
// route to get search result of orders of an organization
exports.shipmentRouter.route('/allOrders/search/:orgid').get(auth_middleware_1.protect, shipment_controller_1.searchOrder);
// route to get order by its name
exports.shipmentRouter.route('/getOrder/:orderName').get(auth_middleware_1.protect, shipment_controller_1.getOrderByOrderName);
exports.shipmentRouter
    .route('/:orderId')
    .get(auth_middleware_1.protect, shipment_controller_1.getOrderById) // route to get specific order by its rder id
    .patch(auth_middleware_1.csrfProtection, auth_middleware_1.protect, shipment_controller_1.updateOrder) // route to update order by its order id
    .delete(auth_middleware_1.csrfProtection, auth_middleware_1.protect, shipment_controller_1.deleteOrder); // route to delete order by its order id
