import { Types } from "mongoose";
import Item from "../models/item.model";
import ApiFilter from "../utils/apiFilter";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import checkRequestBody from "../utils/checkRequestBody";
import { redisClient } from "../app";

/**
 * @brief sends item document as json response
 * @param {ExpressTypes.Response} res - express response object
 * @param {ItemType | ItemType[]} item - tiem data
 * @param {number} status - status code
 * @param {number} count  - count of items (optional)
 * @returns response object
 * @author `Gaurang Tyagi`
 */
const sendItem = (
	res: ExpressTypes.Response,
	item: ItemType | ItemType[],
	status: number,
	count?: number
) => {
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
export const addItem = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const newItem = checkRequestBody(
			req.body,
			[
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
			],
			true
		);
		if (!newItem)
			return next(new AppError("Please provide complete details", 400));
		const item = await Item.create(newItem);
		sendItem(res, item, 201);
	}
);

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
export const getAllItems = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { orgid } = req.params;
		if (!orgid)
			return next(
				new AppError("Please provide a valid organization id", 400)
			);
		const query = Item.find({ organizationId: orgid });
		const totalCount = await Item.countDocuments({ organizationId: orgid });
		const items = await new ApiFilter(query, req.parsedQuery!)
			.filter()
			.project()
			.sort()
			.paginate(totalCount).query;

		if (!items) sendItem(res, [], 200);
		else {
			items.count = totalCount;
			sendItem(res, items, 200, totalCount);
		}
	}
);

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
export const getItem = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { itemId } = req.params;
		if (!itemId)
			return next(new AppError("Please provide a valid item id", 400));
		const item = (await Item.findById(itemId)) as ItemType;

		sendItem(res, item, 200);
	}
);

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
export const getItemBySKU = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { SKU } = req.params;
		if (!SKU)
			return next(new AppError("Please provide a valid item SKU", 400));
		const item = (await Item.findOne({ SKU })) as any | null;

		if (!item) return next(new AppError("Item not found", 404));
		
		sendItem(res, item, 200, 1);
	}
);

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
export const updateItem = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const updatedItem = checkRequestBody(
			req.body,
			[
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
			],
			true
		);
		const { itemId } = req.params;

		if (!itemId)
			return next(new AppError("please provide a valid item id", 400));
		if (!updatedItem)
			return next(new AppError("please provide valid data", 400));
		const newItem = (await Item.findByIdAndUpdate(itemId, updatedItem, {
			new: true,
			runValidators: true,
		})) as ItemType;
		sendItem(res, newItem, 200);
	}
);

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
export const deleteItem = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { itemId } = req.params;

		if (!itemId)
			return next(new AppError("please provide a valid item id", 400));
		await Item.findByIdAndDelete(itemId);
		return res.status(204).end();
	}
);

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
export const itemsReport = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { orgid } = req.params;
		if (!orgid)
			return next(
				new AppError("please provide a valid organization id", 400)
			);
		const report = await Item.aggregate([
			{
				$match: {
					organizationId: new Types.ObjectId(orgid),
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
	}
);

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
export const searchItem = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { orgid } = req.params;
		let queryStr = String(req.query.query || "");
		queryStr = queryStr.replaceAll("'", "");

		const regex = new RegExp(`.*${queryStr}.*`, "i");
		if (!orgid) return next(new AppError("Invalid organization", 400));

		let items;
		if (redisClient.isReady) {
			items = await redisClient.hGet(`organization-${orgid}`, "items");
			if (items && queryStr.length) {
				items = JSON.parse(items);
				items = items.filter((item: any) => {
					const itemsStr = JSON.stringify(item);
					return regex.test(itemsStr);
				});
			}
			if (!items || !items.length ||  !queryStr.length) {
				const query = Item.find({
					organizationId: orgid,
					$or: [
						{ name: { $regex: regex } },
						{ inventoryCategory: { $regex: regex } },
						{ origin: { $regex: regex } },
						{ SKU: { $regex: regex } },
					],
				});
				items = await new ApiFilter(query, req.parsedQuery!).query
				
				const itemsStr = JSON.stringify(items);
				await redisClient.hSet(
					`organization-${orgid}`,
					"items",
					itemsStr
				);
			}
		} else {
			const query = Item.find({
				organizationId: orgid,
				$or: [
					{ name: { $regex: regex } },
					{ inventoryCategory: { $regex: regex } },
					{ origin: { $regex: regex } },
					{ SKU: { $regex: regex } },
				],
			});
			items = await new ApiFilter(query, req.parsedQuery!).query;
		}
		return res.status(200).json({
			status: "success",
			results: items.length,
			data: {
				items,
			},
		});
	}
);
