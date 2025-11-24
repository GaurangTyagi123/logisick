import { Router } from 'express';
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderById,
    getOrderByOrderName,
    orderReport,
    searchOrder,
    updateOrder,
} from '../controllers/shipment.controller';
import { csrfProtection, protect } from '../middlewares/auth.middleware';

export const shipmentRouter = Router();

// route to create a new order
shipmentRouter.route('/').post(csrfProtection,protect, createOrder);

// route to get all orders of an organizqation
shipmentRouter.route('/allOrders/:orgid').get(protect, getAllOrders);

// route to get report of the orders of an organization
shipmentRouter.route('/allOrders/report/:orgid').get(protect, orderReport);

// route to get search result of orders of an organization
shipmentRouter.route('/allOrders/search/:orgid').get(protect, searchOrder);

// route to get order by its name
shipmentRouter.route('/getOrder/:orderName').get(protect, getOrderByOrderName);

shipmentRouter
    .route('/:orderId')
    .get(protect, getOrderById) // route to get specific order by its rder id
    .patch(csrfProtection,protect, updateOrder) // route to update order by its order id
    .delete(csrfProtection,protect, deleteOrder); // route to delete order by its order id
