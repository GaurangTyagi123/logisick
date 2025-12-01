"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchItem = exports.itemsReport = exports.deleteItem = exports.updateItem = exports.getItemBySKU = exports.getItem = exports.getAllItems = exports.addItem = void 0;
const mongoose_1 = require("mongoose");
const item_model_1 = __importDefault(require("../models/item.model"));
const apiFilter_1 = __importDefault(require("../utils/apiFilter"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const checkRequestBody_1 = __importDefault(require("../utils/checkRequestBody"));
const app_1 = require("../app");
/**
 * @brief sends item document as json response
 * @param {ExpressTypes.Response} res - express response object
 * @param {ItemType | ItemType[]} item - tiem data
 * @param {number} status - status code
 * @param {number} count  - count of items (optional)
 * @returns response object
 * @author `Gaurang Tyagi`
 */
const sendItem = (res, item, status, count) => {
    return res.status(status).json({
        status: "success",
        count: count ?? 0,
        data: {
            item,
        },
    });
};
/**
 * @brief function to add item to the inventory of an organization
 * @param {Express Request Object} req
 * ```
 * {
 *      body:{
 *          name: 'item name',
 *          organizationId: ObjectId,
 *          costPrice: 10,
 *          sellingPrice:  12 ,
 *          quantity:  13 ,
 *          inventoryCategory: 'item category' ,
 *          importedOn: '2025-01-01',
 *          expiresOn: null | '2026-01-01' ,
 *          importance: A | B | C ,
 *          weight: null | 10 , // in grams
 *          colour: null | 'yellow',
 *          batchNumber:  null | 120957392,
 *          origin:  "India" | "item origin"
 *      }
 * }
 * ```
 * request body with item's data
 * @param {Express Response Object} res -
 * @param {Express Next function} next -
 * @sideeffect calls sendItem function
 * @author `Gaurang Tyagi`
 */
exports.addItem = (0, catchAsync_1.default)(async (req, res, next) => {
    const newItem = (0, checkRequestBody_1.default)(req.body, [
        "name",
        "organizationId",
        "costPrice",
        "sellingPrice",
        "quantity",
        "inventoryCategory",
        "importedOn",
        "expiresOn",
        "importance",
        "weight",
        "colour",
        "batchNumber",
        "origin",
    ], true);
    if (!newItem)
        return next(new appError_1.default("Please provide complete details", 400));
    const item = await item_model_1.default.create(newItem);
    sendItem(res, item, 201);
});
/**
 * @brief Controller Function to retrieve all items for a specific organization with filtering, sorting, and pagination.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          orgid: 'organization_mongo_id'
 *      },
 *      query: {
 *          ... // standard API filter query params (e.g., sort, fields, page, limit)
 *      }
 * }
 * ```
 * request containing the organization ID in params and filtering/pagination parameters in query.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Sends a 200 JSON response with filtered and paginated item data and the total count.
 * @author `Gaurang Tyagi`
 */
exports.getAllItems = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    if (!orgid)
        return next(new appError_1.default("Please provide a valid organization id", 400));
    const query = item_model_1.default.find({ organizationId: orgid });
    const totalCount = await item_model_1.default.countDocuments({ organizationId: orgid });
    const items = await new apiFilter_1.default(query, req.parsedQuery)
        .filter()
        .project()
        .sort()
        .paginate(totalCount).query;
    if (!items)
        sendItem(res, [], 200);
    else {
        items.count = totalCount;
        sendItem(res, items, 200, totalCount);
    }
});
/**
 * @brief Controller Function to retrieve a single item by its unique ID.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          itemId: 'item_mongo_id'
 *      }
 * }
 * ```
 * request containing the item ID in params.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request`
 * @return NA
 * @sideEffect Sends a 200 JSON response with the requested item data.
 * @author `Gaurang Tyagi`
 */
exports.getItem = (0, catchAsync_1.default)(async (req, res, next) => {
    const { itemId } = req.params;
    if (!itemId)
        return next(new appError_1.default("Please provide a valid item id", 400));
    const item = (await item_model_1.default.findById(itemId));
    sendItem(res, item, 200);
});
/**
 * @brief Controller Function to retrieve a single item by its SKU (Stock Keeping Unit).
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          SKU: 'item_sku_code'
 *      }
 * }
 * ```
 * request containing the item SKU in params.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Sends a 200 JSON response with the requested item data.
 * @author `Gaurang Tyagi`
 */
exports.getItemBySKU = (0, catchAsync_1.default)(async (req, res, next) => {
    const { SKU } = req.params;
    if (!SKU)
        return next(new appError_1.default("Please provide a valid item SKU", 400));
    const item = (await item_model_1.default.findOne({ SKU }));
    if (!item)
        return next(new appError_1.default("Item not found", 404));
    sendItem(res, item, 200, 1);
});
/**
 * @brief Controller Function to update an existing inventory item's details.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          itemId: 'item_mongo_id'
 *      },
 *      body: {
 *          name?: 'new name',
 *          costPrice?: 100,
 *          ... other updatable fields
 *      }
 * }
 * ```
 * request containing the item ID in params and fields to update in the body.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Updates the specified Item document in the database and sends a 200 JSON response with the updated item data.
 * @author `Gaurang Tyagi`
 */
exports.updateItem = (0, catchAsync_1.default)(async (req, res, next) => {
    const updatedItem = (0, checkRequestBody_1.default)(req.body, [
        "name",
        "costPrice",
        "sellingPrice",
        "quantity",
        "inventoryCategory",
        "importance",
        "importedOn",
        "expiresOn",
        "weight",
        "colour",
        "reorderLevel",
        "origin",
    ], true);
    const { itemId } = req.params;
    if (!itemId)
        return next(new appError_1.default("please provide a valid item id", 400));
    if (!updatedItem)
        return next(new appError_1.default("please provide valid data", 400));
    const newItem = (await item_model_1.default.findByIdAndUpdate(itemId, updatedItem, {
        new: true,
        runValidators: true,
    }));
    sendItem(res, newItem, 200);
});
/**
 * @brief Controller Function to soft-delete (mark as deleted) an item by its unique ID.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          itemId: 'item_mongo_id'
 *      }
 * }
 * ```
 * request containing the item ID in params.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Soft-deletes the specified Item document in the database by setting the 'deleted' flag. Sends a 204 No Content response upon success.
 * @author `Gaurang Tyagi`
 */
exports.deleteItem = (0, catchAsync_1.default)(async (req, res, next) => {
    const { itemId } = req.params;
    if (!itemId)
        return next(new appError_1.default("please provide a valid item id", 400));
    await item_model_1.default.findByIdAndDelete(itemId);
    return res.status(204).end();
});
/**
 * @brief Controller Function to generate an inventory report summary for a given organization using MongoDB aggregation.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          orgid: 'organization_mongo_id'
 *      }
 * }
 * ```
 * request containing the organization ID in params.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Performs MongoDB aggregation to calculate key inventory metrics (counts, total/average quantities, total/average cost and selling prices) for the organization and sends a 200 JSON response with the calculated report data.
 * @author `Gaurang Tyagi`
 */
exports.itemsReport = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    if (!orgid)
        return next(new appError_1.default("please provide a valid organization id", 400));
    const report = await item_model_1.default.aggregate([
        {
            $match: {
                organizationId: new mongoose_1.Types.ObjectId(orgid),
            },
        },
        {
            $group: {
                _id: "$organizationId",
                numOfItems: {
                    $sum: 1,
                },
                totalQuantity: {
                    $sum: "$quantity",
                },
                averageQuantity: {
                    $avg: "$quantity",
                },
                totalCostPrice: {
                    $sum: "$costPrice",
                },
                totalSellingPrice: {
                    $sum: "$sellingPrice",
                },
                averageCostPrice: {
                    $avg: "$costPrice",
                },
                averageSellingPrice: {
                    $avg: "$sellingPrice",
                },
            },
        },
    ]);
    return res.status(200).json({
        status: "success",
        data: {
            report: report.at(0),
        },
    });
});
/**
 * @brief Controller Function to search for inventory items within a specific organization by name, category, origin, or SKU, utilizing Redis caching for performance.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          orgid: 'organization_mongo_id'
 *      },
 *      query: {
 *          query: 'search_term' // The term to search for (e.g., 'Apple', 'Electronics', 'USA')
 *      }
 * }
 * ```
 * request containing the organization ID in params and an optional search query in query parameters.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Reads/writes item data to the Redis cache for the given organization ID. Sends a 200 JSON response with the filtered and paginated list of items.
 * @author `Gaurang Tyagi`
 */
exports.searchItem = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    let queryStr = String(req.query.query || "");
    queryStr = queryStr.replaceAll("'", "");
    const regex = new RegExp(`.*${queryStr}.*`, "i");
    if (!orgid)
        return next(new appError_1.default("Invalid organization", 400));
    let items;
    if (app_1.redisClient.isReady) {
        items = await app_1.redisClient.hGet(`organization-${orgid}`, "items");
        if (items && queryStr.length) {
            items = JSON.parse(items);
            items = items.filter((item) => {
                const itemsStr = JSON.stringify(item);
                return regex.test(itemsStr);
            });
        }
        if (!items || !items.length || !queryStr.length) {
            const query = item_model_1.default.find({
                organizationId: orgid,
                $or: [
                    { name: { $regex: regex } },
                    { inventoryCategory: { $regex: regex } },
                    { origin: { $regex: regex } },
                    { SKU: { $regex: regex } },
                ],
            });
            items = await new apiFilter_1.default(query, req.parsedQuery).query;
            const itemsStr = JSON.stringify(items);
            await app_1.redisClient.hSet(`organization-${orgid}`, "items", itemsStr);
        }
    }
    else {
        const query = item_model_1.default.find({
            organizationId: orgid,
            $or: [
                { name: { $regex: regex } },
                { inventoryCategory: { $regex: regex } },
                { origin: { $regex: regex } },
                { SKU: { $regex: regex } },
            ],
        });
        items = await new apiFilter_1.default(query, req.parsedQuery).query;
    }
    return res.status(200).json({
        status: "success",
        results: items.length,
        data: {
            items,
        },
    });
});
