"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchOrder = exports.deleteOrder = exports.orderReport = exports.updateOrder = exports.getOrderByOrderName = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const shipment_model_1 = __importDefault(require("../models/shipment.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const apiFilter_1 = __importDefault(require("../utils/apiFilter"));
const app_1 = require("../app");
const mongoose_1 = require("mongoose");
/**
 * @brief sends order document as json response
 * @param res (response object)
 * @param order (order document)
 * @param status (status of the response)
 * @returns response object
 */
const sendOrder = (res, order, status, count) => {
    return res.status(status).json({
        status: 'success',
        count,
        order,
    });
};
/**
 * @brief function to create order to the for an organization
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @body itemId (string) organizationId (string) quantity (number)
 * orderedOn (date)
 * @sideeffect calls sendItem function
 */
exports.createOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    const { item, quantity, organizationId, orderedOn } = req.body;
    if (!item || !quantity || !organizationId)
        return next(new appError_1.default('Please provide complete details', 400));
    const itemDetails = await item_model_1.default.findById(item).where({
        quantity: { $gt: quantity },
    });
    if (!itemDetails)
        return next(new appError_1.default('Inventory does not have enough units of this item', 400));
    const order = await shipment_model_1.default.create({
        item,
        organizationId,
        quantity,
        orderedOn,
    });
    if (!order)
        return next(new appError_1.default('There was an error while creating your order', 500));
    sendOrder(res, order, 201);
});
/**
 * @brief Function to get all orders belonging to an organization
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orgId (string) Organization id
 * @sideEffect calls sendItem function
 */
exports.getAllOrders = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    if (!orgid)
        return next(new appError_1.default('Please provide a valid organization id', 400));
    const query = shipment_model_1.default.find({
        organizationId: orgid,
        deleted: false,
    }).populate({
        path: 'item',
        select: 'name', //. NOTE:  add fields that you want in the response
    });
    const totalCount = await shipment_model_1.default.countDocuments({
        organizationId: orgid,
    });
    const orders = await new apiFilter_1.default(query, req.parsedQuery)
        .filter()
        .project()
        .sort()
        .paginate(totalCount).query;
    if (!orders)
        sendOrder(res, [], 200);
    else {
        orders.count = totalCount;
        sendOrder(res, orders, 200, totalCount);
    }
});
/**
 * @brief Function to get order with a specific ID
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orderId (string)
 * @sideEffect calls sendItem function
 */
exports.getOrderById = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orderId } = req.params;
    if (!orderId)
        return next(new appError_1.default('Please provide a valid order id', 400));
    const order = await shipment_model_1.default.findById(orderId);
    if (!order)
        return next(new appError_1.default('Order not found', 404));
    sendOrder(res, order, 200, 1);
});
/**
 * @brief Function to get an Item with a specified Order Name
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orderName (string)
 * @sideEffect calls sendItem function
 */
exports.getOrderByOrderName = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orderName } = req.params;
    if (!orderName)
        return next(new appError_1.default('Please provide a valid order name', 400));
    const order = await shipment_model_1.default.find({ orderName });
    if (!order)
        return next(new appError_1.default('Order not found', 404));
    const totalCount = order.length;
    sendOrder(res, order, 200, totalCount);
});
/**
 * @brief Function to get update an order with a given ID
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orderId (string)
 * @body quantity? (number) shipped? (boolean) orderedOn? (date)
 * @sideEffect calls sendItem function
 */
exports.updateOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orderId } = req.params;
    const { quantity, shipped, orderedOn } = req.body;
    if (!orderId)
        return next(new appError_1.default('Please provide a valid order id', 400));
    const order = await shipment_model_1.default.findByIdAndUpdate(orderId, {
        quantity,
        shipped,
        orderedOn,
    }, { new: true, runValidators: true });
    if (!order)
        return next(new appError_1.default('Order not found', 404));
    sendOrder(res, order, 200, 1);
});
//! NOT TESTED
/**
 * @brief Function to generate a report for the orders  of an organization
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orgId (string) Organization id
 * @returns json response
 */
exports.orderReport = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    if (!orgid)
        return next(new appError_1.default('please provide a valid organization id', 400));
    const report = await shipment_model_1.default.aggregate([
        {
            $match: {
                organizationId: new mongoose_1.Types.ObjectId(orgid),
            },
        },
        {
            $lookup: {
                from: 'items',
                as: 'items',
                foreignField: '_id',
                localField: 'item',
            },
        },
        {
            $project: {
                items: {
                    name: 1,
                    sellingPrice: 1,
                    costPrice: 1,
                },
                orderedOn: 1,
                quantity: 1,
            },
        },
        {
            $group: {
                _id: {
                    orderedOn: '$orderedOn',
                },
                items: {
                    $addToSet: '$items',
                },
                numOfItems: {
                    $sum: 1,
                },
                totalUnits: {
                    $sum: '$quantity',
                },
                totalSellingPrice: {
                    $sum: { $sum: '$items.sellingPrice' },
                },
                totalCostPrice: {
                    $sum: { $sum: '$items.costPrice' },
                },
            },
        },
    ]);
    return res.status(200).json({
        status: 'success',
        data: {
            report,
        },
    });
});
/**
 * @brief Function to delete an order with a given ID
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orderId (string)
 * @sideEffect soft deletes the order
 */
const deleteOrder = async (req, res, next) => {
    const { orderId } = req.params;
    if (!orderId)
        return next(new appError_1.default('Please provide a valid order id', 400));
    await shipment_model_1.default.findByIdAndDelete(orderId);
    return res.status(204).end();
};
exports.deleteOrder = deleteOrder;
//! NOT TESTED
/**
 * @brief Function to find an order in the inventory
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orgId (string) Organization id
 * @param query (string)
 * @return json reponse
 */
exports.searchOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    let queryStr = String(req.query.query || '');
    queryStr = queryStr.replaceAll("'", '');
    if (!orgid)
        return next(new appError_1.default('Invalid organization', 400));
    const regex = new RegExp(`.*${queryStr}.*`, 'i');
    let orders;
    if (app_1.redisClient.isReady) {
        orders = await app_1.redisClient.hGet(`organization-${orgid}`, 'orders');
        if (orders && queryStr.length) {
            orders = JSON.parse(orders);
            orders = orders.values().filter((items) => {
                const itemsStr = JSON.stringify(items);
                return regex.test(itemsStr);
            });
        }
        if (!orders || !orders.length || !queryStr.length) {
            orders = await new apiFilter_1.default(shipment_model_1.default.find({ organizationId: orgid }), req.parsedQuery)
                .sort()
                .project()
                .filter().query;
            const itemsStr = JSON.stringify(orders);
            await app_1.redisClient.hSet(`organization-${orgid}`, 'orders', itemsStr);
        }
    }
    else {
        orders = await new apiFilter_1.default(shipment_model_1.default.find({ organizationId: orgid }), req.parsedQuery)
            .sort()
            .filter()
            .project().query;
    }
    return res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders,
        },
    });
});
