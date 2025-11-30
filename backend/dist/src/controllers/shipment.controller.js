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
 * @brief Helper Function to send a standardized JSON response for order/shipment data.
 * @param {ExpressTypes.Response} res - Express response object used to set the response status and JSON body.
 * @param {shipmentType | Array<shipmentType>} order - The order or array of orders/shipments to be included in the response body.
 * @param {number} status - The HTTP status code to be set for the response (e.g., 200, 201).
 * @param {number} [count] - Optional count of the number of orders/shipments being returned.
 * @return {ExpressTypes.Response} The Express response object with the set status and JSON payload.
 * @sideEffect Sets the HTTP status and sends a JSON response with a "success" status, optional count, and the order data.
 * @author `Gaurang Tyagi`
 */
const sendOrder = (res, order, status, count) => {
    return res.status(status).json({
        status: "success",
        count,
        order,
    });
};
/**
 * @brief Controller Function to create a new order/shipment for an item, ensuring sufficient inventory.
 * @param {ExpressTypes.UserRequest} req
 * ```
 * {
 * 		body: {
 * 			itemId: 'item-document-id',
 * 			quantity: 5,
 * 			organizationId: 'organization-document-id',
 * 			orderedOn?: 'YYYY-MM-DDTHH:MM:SSZ'
 * 		}
 * }
 * ```
 * request containing the item details, quantity, and organization ID in the body.
 * @param {ExpressTypes.Response} res - Express response object to send the result back to the client.
 * @param {ExpressTypes.NextFn} next - Function to pass control to the next middleware (used for error handling).
 * @return NA
 * @sideEffect 1. Checks if all required fields (`itemId`, `quantity`, `organizationId`) are present.
 * 2. Verifies if the `Item` model has sufficient stock (quantity) for the requested `itemId`.
 * 3. If successful, creates a new `Shipment` document in the database.
 * 4. Sends a 201 Created JSON response with the newly created order data using `sendOrder`.
 * 5. If any validation or creation fails, passes an `AppError` to the error handler via `next`.
 * @author `Gaurang Tyagi`
 */
exports.createOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    const { itemId, orderName, quantity, organizationId, orderedOn } = req.body;
    if (!itemId || !quantity || !organizationId || !orderName)
        return next(new appError_1.default("Please provide complete details", 400));
    const itemDetails = await item_model_1.default.findById(itemId).where({
        quantity: { $gte: Number(quantity) },
    });
    if (!itemDetails)
        return next(new appError_1.default("Inventory does not have enough units of this item", 400));
    const order = await shipment_model_1.default.create({
        item: itemId,
        orderName,
        organizationId,
        quantity,
        orderedOn,
    });
    if (!order)
        return next(new appError_1.default("There was an error while creating your order", 500));
    sendOrder(res, order, 201);
});
/**
 * @brief Controller Function to retrieve all non-deleted orders (shipments) for a specific organization, supporting filtering, sorting, and pagination.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 * 		params: {
 *			orgid: 'organization-document-id'
 * 		},
 * 		parsedQuery: { // Example query parameters applied by ApiFilter
 *			sort: '-orderedOn',
 *			limit: 10,
 *			page: 1
 *      }
 * }
 * ```
 * request containing the organization ID in params and optional query parameters for data manipulation.
 * @param {ExpressTypes.Response} res - Express response object to send the result back to the client.
 * @param {ExpressTypes.NextFn} next - Function to pass control to the next middleware (used for error handling).
 * @return NA
 * @sideEffect 1. Checks for the presence of the `orgid` parameter.
 * 2. Queries the `Shipment` collection for documents matching the `orgid` and `deleted: false`.
 * 3. Populates the `item` field, selecting only `_id` and `quantity`.
 * 4. Counts the total number of documents for the organization (ignoring pagination).
 * 5. Applies filtering, projection, sorting, and pagination using the `ApiFilter` utility based on `req.parsedQuery!`.
 * 6. Sends a 200 OK JSON response with the list of orders and the total count using `sendOrder`.
 * @author `Gaurang Tyagi`
 */
exports.getAllOrders = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    if (!orgid)
        return next(new appError_1.default("Please provide a valid organization id", 400));
    const query = shipment_model_1.default.find({
        organizationId: orgid,
        deleted: false,
    }).populate({
        path: "item",
        select: "_id quantity",
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
        return sendOrder(res, [], 200);
    orders.count = totalCount;
    return sendOrder(res, orders, 200, totalCount);
});
/**
 * @brief Controller Function to retrieve a single order (shipment) document by its unique ID.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 *		params: {
 *			orderId: 'shipment-document-id'
 *		}
 * }
 * ```
 * request containing the unique order ID in params.
 * @param {ExpressTypes.Response} res - Express response object to send the result back to the client.
 * @param {ExpressTypes.NextFn} next - Function to pass control to the next middleware (used for error handling).
 * @return NA
 * @sideEffect 1. Checks for the presence of the `orderId` parameter.
 * 2. Attempts to find a single `Shipment` document using `findById(orderId)`.
 * 3. If the order is not found, passes an 'Order not found' `AppError` (404) to the error handler via `next`.
 * 4. If found, sends a 200 OK JSON response with the order data and a count of 1 using `sendOrder`.
 * @author `Gaurang Tyagi`
 */
exports.getOrderById = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orderId } = req.params;
    if (!orderId)
        return next(new appError_1.default("Please provide a valid order id", 400));
    const order = await shipment_model_1.default.findById(orderId);
    if (!order)
        return next(new appError_1.default("Order not found", 404));
    sendOrder(res, order, 200, 1);
});
/**
 * @brief Controller Function to retrieve one or more order (shipment) documents by a given order name.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 *		params: {
 *			orderName: 'Shipment-X-123'
 *		}
 * }
 * ```
 * request containing the order name in params.
 * @param {ExpressTypes.Response} res - Express response object to send the result back to the client.
 * @param {ExpressTypes.NextFn} next - Function to pass control to the next middleware (used for error handling).
 * @return NA
 * @sideEffect 1. Checks for the presence of the `orderName` parameter.
 * 2. Attempts to find all `Shipment` documents using `find({ orderName })`. This returns an array, even if empty.
 * 3. Calculates the total count of found orders.
 * 4. Sends a 200 OK JSON response with the list of orders and the total count using `sendOrder`.
 * 5. Note: The check `if (!order)` will only trigger if the database query itself fails, not if no documents are found (which results in an empty array `[]`). If no orders are found, an empty array is returned with a 200 status.
 * @author `Gaurang Tyagi`
 */
exports.getOrderByOrderName = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orderName } = req.params;
    if (!orderName)
        return next(new appError_1.default("Please provide a valid order name", 400));
    const order = await shipment_model_1.default.find({ orderName });
    if (!order)
        return next(new appError_1.default("Order not found", 404));
    const totalCount = order.length;
    sendOrder(res, order, 200, totalCount);
});
/**
 * @brief Controller Function to update an existing order (shipment) document by its unique ID.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 *		params: {
 *			orderId: 'shipment-document-id'
 *		},
 *		body: { // Fields to update are optional
 *			quantity?: 10,
 *			shipped?: true,
 *			orderedOn?: 'YYYY-MM-DDTHH:MM:SSZ'
 *		}
 * }
 * ```
 * request containing the unique order ID in params and optional update fields in the body.
 * @param {ExpressTypes.Response} res - Express response object to send the result back to the client.
 * @param {ExpressTypes.NextFn} next - Function to pass control to the next middleware (used for error handling).
 * @return NA
 * @sideEffect 1. Checks for the presence of the `orderId` parameter.
 * 2. Attempts to find and update the `Shipment` document using `findByIdAndUpdate`.
 * 3. The update options `{ new: true }` ensure the function returns the updated document, and `{ runValidators: true }` ensures schema validation is applied to the update fields.
 * 4. If the order is not found, passes an 'Order not found' `AppError` (404) to the error handler via `next`.
 * 5. If successful, sends a 200 OK JSON response with the updated order data and a count of 1 using `sendOrder`.
 * @author `Gaurang Tyagi`
 */
exports.updateOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orderId } = req.params;
    const { quantity, shipped, orderedOn } = req.body;
    if (!orderId)
        return next(new appError_1.default("Please provide a valid order id", 400));
    const order = await shipment_model_1.default.findByIdAndUpdate(orderId, {
        quantity,
        shipped,
        orderedOn,
    }, { new: true, runValidators: true });
    if (!order)
        return next(new appError_1.default("Order not found", 404));
    sendOrder(res, order, 200, 1);
});
/**
 * @brief Controller Function to generate an aggregated order report (total revenue, total orders, and total quantity) for a specific organization.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 *		params: {
 *			orgid: 'organization-document-id'
 *		}
 * }
 * ```
 * request containing the organization ID in params.
 * @param {ExpressTypes.Response} res - Express response object to send the result back to the client.
 * @param {ExpressTypes.NextFn} next - Function to pass control to the next middleware (used for error handling).
 * @return NA
 * @sideEffect 1. Checks for the presence of the `orgid` parameter.
 * 2. Executes a MongoDB aggregation pipeline on the `Shipment` collection:
 * - **$match**: Filters shipments by the provided `organizationId`.
 * - **$lookup**: Joins (populates) the `Shipment` documents with their corresponding `Item` details from the `items` collection.
 * - **$unwind**: Deconstructs the `item` array field from the input documents to output a document for each element (assuming one item per shipment).
 * - **$group**: Groups all matched documents into a single output document (`_id: null`) and calculates:
 * - `totalRevenue`: The sum of (`quantity` * `item.sellingPrice`) for all orders.
 * - `totalOrders`: The total count of matched shipments.
 * - `totalQuantity`: The total sum of `quantity` across all shipments.
 * - **$project**: Reshapes the output document to exclude the `_id` field and include the calculated report metrics.
 * 3. Sends a 200 OK JSON response with the generated report data. If no orders are found, it returns a report with all counts/sums set to zero.
 * @author `Gaurang Tyagi`
 */
exports.orderReport = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    if (!orgid)
        return next(new appError_1.default("please provide a valid organization id", 400));
    const report = await shipment_model_1.default.aggregate([
        {
            $match: {
                organizationId: new mongoose_1.Types.ObjectId(orgid),
            },
        },
        {
            $lookup: {
                from: "items",
                as: "item",
                foreignField: "_id",
                localField: "item",
            },
        },
        {
            $unwind: "$item",
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: {
                        $multiply: ["$quantity", "$item.sellingPrice"],
                    },
                },
                totalOrders: { $sum: 1 },
                totalQuantity: { $sum: "$quantity" },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
                totalOrders: 1,
                totalQuantity: 1,
            },
        },
    ]);
    console.log(report);
    return res.status(200).json({
        status: "success",
        data: {
            report: report[0] || {
                totalRevenue: 0,
                totalOrders: 0,
                totalQuantity: 0,
            },
        },
    });
});
/**
 * @brief Controller Function to permanently delete a single order (shipment) document by its unique ID.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 *		params: {
 *			orderId: 'shipment-document-id'
 *		}
 * }
 * ```
 * request containing the unique order ID in params.
 * @param {ExpressTypes.Response} res - Express response object to set and return response to.
 * @param {ExpressTypes.NextFn} next - Function to pass control to the next middleware (used for error handling).
 * @return NA
 * @sideEffect 1. Checks for the presence of the `orderId` parameter.
 * 2. Attempts to find and **permanently delete** the `Shipment` document using `findByIdAndDelete`.
 * 3. Sends a **204 No Content** response, indicating successful deletion with no body content returned.
 * 4. If the ID is missing, passes an `AppError` (400) to the error handler via `next`. (Note: The function does not check if a document was actually deleted, assuming 204 is appropriate for the action regardless).
 * @author `Gaurang Tyagi`
 */
const deleteOrder = async (req, res, next) => {
    const { orderId } = req.params;
    if (!orderId)
        return next(new appError_1.default("Please provide a valid order id", 400));
    await shipment_model_1.default.findByIdAndDelete(orderId);
    return res.status(204).end();
};
exports.deleteOrder = deleteOrder;
/**
 * @brief Controller Function to search for orders (shipments) within a specific organization, prioritizing a Redis cache for speed and falling back to MongoDB for cache misses or when the cache is unavailable.
 * @param {ExpressTypes.UserRequest} req
 * ```
 * {
 *		params: {
 *			orgid: 'organization-document-id'
 *		},
 *		query: {
 *			query?: 'search-term',
 *			...ApiFilter_params // e.g., sort, limit, page
 *		}
 * }
 * ```
 * request containing the organization ID in params and a search term in the query string.
 * @param {ExpressTypes.Response} res - Express response object to send the result back to the client.
 * @param {ExpressTypes.NextFn} next - Function to pass control to the next middleware (used for error handling).
 * @return NA
 * @sideEffect 1. Checks for a valid `orgid`.
 * 2. Prepares a case-insensitive regular expression (`regex`) from the `query` string for pattern matching.
 * 3. **Cache Logic (if `redisClient` is ready):**
 * a. Attempts to retrieve all orders for the `orgid` from the Redis hash cache (`hGet`).
 * b. If orders are found in the cache AND a search term is provided (`queryStr.length`), it performs **in-memory filtering** using the `regex` on the cached data.
 * c. If no cached orders are found, no search term is provided, or the in-memory search fails, it falls back to the **MongoDB query**.
 * d. **MongoDB Query (Cache Miss):** Fetches orders matching the `orgid` and `orderName` using `$regex`, applies `ApiFilter` methods (sorting, etc.), and then **caches the result** back to Redis (`hSet`).
 * 4. **No Cache Logic (if `redisClient` is NOT ready):**
 * a. Executes the **MongoDB query** directly, fetching orders matching `orgid` and `orderName` using `$regex`, and applies `ApiFilter`.
 * 5. Sends a 200 OK JSON response with the search results and the count of orders found.
 * @author `Gaurang Tyagi` (Inferred author based on previous function comments)
 */
exports.searchOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    let queryStr = String(req.query.query || "");
    queryStr = queryStr.replaceAll("'", "");
    if (!orgid)
        return next(new appError_1.default("Invalid organization", 400));
    const regex = new RegExp(`.*${queryStr}.*`, "i");
    let orders;
    if (app_1.redisClient.isReady) {
        orders = await app_1.redisClient.hGet(`organization-${orgid}`, "orders");
        orders = JSON.parse(orders ? orders : "[]");
        if (orders.length && queryStr.length) {
            orders = orders.values().filter((items) => {
                const itemsStr = JSON.stringify(items);
                return regex.test(itemsStr);
            });
        }
        if (!orders || !orders.length || !queryStr.length) {
            orders = await new apiFilter_1.default(shipment_model_1.default.find({
                organizationId: orgid,
                orderName: { $regex: regex },
            }).populate({
                path: "item",
                select: "_id quantity",
            }), req.parsedQuery).query;
            const itemsStr = JSON.stringify(orders);
            await app_1.redisClient.hSet(`organization-${orgid}`, "orders", itemsStr);
        }
    }
    else {
        orders = await new apiFilter_1.default(shipment_model_1.default.find({
            organizationId: orgid,
            orderName: { $regex: regex },
        }), req.parsedQuery)
            .sort()
            .filter()
            .project().query;
    }
    return res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
            orders,
        },
    });
});
