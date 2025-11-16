"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const shipment_controller_1 = require("../controllers/shipment.controller");
exports.shipmentRouter = (0, express_1.Router)();
exports.shipmentRouter.route('/').post(auth_controller_1.protect, shipment_controller_1.createOrder);
exports.shipmentRouter.route('/allOrders/:orgid').get(auth_controller_1.protect, shipment_controller_1.getAllOrders);
exports.shipmentRouter.route('/allOrders/report/:orgid').get(auth_controller_1.protect, shipment_controller_1.orderReport);
exports.shipmentRouter.route('/allOrders/search/:orgid').get(auth_controller_1.protect, shipment_controller_1.searchOrder);
exports.shipmentRouter.route('/getOrder/:orderName').get(auth_controller_1.protect, shipment_controller_1.getOrderByOrderName);
exports.shipmentRouter
    .route('/:orderId')
    .get(auth_controller_1.protect, shipment_controller_1.getOrderById)
    .patch(auth_controller_1.protect, shipment_controller_1.updateOrder)
    .delete(auth_controller_1.protect, shipment_controller_1.deleteOrder);
