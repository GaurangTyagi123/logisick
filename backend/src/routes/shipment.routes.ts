import { Router } from 'express';
import { protect } from '../controllers/auth.controller';
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderById,
    getOrderByOrderName,
    orderReport,
    updateOrder,
} from '../controllers/shipment.controller';

export const shipmentRouter = Router();

shipmentRouter.route('/').post(protect, createOrder);

shipmentRouter.route('/allOrders/:orgid').get(protect, getAllOrders);
shipmentRouter.route('/allOrders/report/:orgid').get(protect, orderReport);

shipmentRouter.route('/getOrder/:orderName').get(protect, getOrderByOrderName);
shipmentRouter
    .route('/:orderId')
    .get(protect, getOrderById)
    .patch(protect, updateOrder)
    .delete(protect, deleteOrder);
