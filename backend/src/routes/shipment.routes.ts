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

shipmentRouter.route('/').post(csrfProtection,protect, createOrder);

shipmentRouter.route('/allOrders/:orgid').get(protect, getAllOrders);
shipmentRouter.route('/allOrders/report/:orgid').get(protect, orderReport);

shipmentRouter.route('/allOrders/search/:orgid').get(protect, searchOrder);

shipmentRouter.route('/getOrder/:orderName').get(protect, getOrderByOrderName);
shipmentRouter
    .route('/:orderId')
    .get(protect, getOrderById)
    .patch(csrfProtection,protect, updateOrder)
    .delete(csrfProtection,protect, deleteOrder);
