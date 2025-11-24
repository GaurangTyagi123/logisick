import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import Shipment from "../models/shipment.model";
import Item from "../models/item.model";
import ApiFilter from "../utils/apiFilter";
import { redisClient } from "../app";
import { Types } from "mongoose";

/**
 * @brief sends order document as json response
 * @param res (response object)
 * @param order (order document)
 * @param status (status of the response)
 * @returns response object
 */
const sendOrder = (
	res: ExpressTypes.Response,
	order: shipmentType | Array<shipmentType>,
	status: number,
	count?: number
) => {
	return res.status(status).json({
		status: "success",
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
export const createOrder = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { itemId, quantity, organizationId, orderedOn } = req.body;
		if (!itemId || !quantity || !organizationId)
			return next(new AppError("Please provide complete details", 400));

		const itemDetails = await Item.findById(itemId).where({
			quantity: { $gt: quantity },
		});
		if (!itemDetails)
			return next(
				new AppError(
					"Inventory does not have enough units of this item",
					400
				)
			);
		const order = await Shipment.create({
			item:itemId,
			organizationId,
			quantity,
			orderedOn,
		});
		if (!order)
			return next(
				new AppError(
					"There was an error while creating your order",
					500
				)
			);
		sendOrder(res, order, 201);
	}
);

/**
 * @brief Function to get all orders belonging to an organization
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orgId (string) Organization id
 * @sideEffect calls sendItem function
 */
export const getAllOrders = catchAsync(
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
		const query = Shipment.find({
			organizationId: orgid,
			deleted: false,
		}).populate({
			path: "item",
			select: "name", //. NOTE:  add fields that you want in the response
		});
		const totalCount = await Shipment.countDocuments({
			organizationId: orgid,
		});
		const orders = await new ApiFilter(query, req.parsedQuery!)
			.filter()
			.project()
			.sort()
			.paginate(totalCount).query;

		if (!orders) return sendOrder(res, [], 200);
		orders.count = totalCount;
		return sendOrder(res, orders, 200, totalCount);
	}
);

/**
 * @brief Function to get order with a specific ID
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orderId (string)
 * @sideEffect calls sendItem function
 */
export const getOrderById = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { orderId } = req.params;
		if (!orderId)
			return next(new AppError("Please provide a valid order id", 400));
		const order = await Shipment.findById(orderId);

		if (!order) return next(new AppError("Order not found", 404));

		sendOrder(res, order, 200, 1);
	}
);

/**
 * @brief Function to get an Item with a specified Order Name
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orderName (string)
 * @sideEffect calls sendItem function
 */
export const getOrderByOrderName = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { orderName } = req.params;
		if (!orderName)
			return next(new AppError("Please provide a valid order name", 400));
		const order = await Shipment.find({ orderName });

		if (!order) return next(new AppError("Order not found", 404));

		const totalCount = order.length;
		sendOrder(res, order, 200, totalCount);
	}
);

/**
 * @brief Function to get update an order with a given ID
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orderId (string)
 * @body quantity? (number) shipped? (boolean) orderedOn? (date)
 * @sideEffect calls sendItem function
 */
export const updateOrder = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { orderId } = req.params;
		const { quantity, shipped, orderedOn } = req.body;
		if (!orderId)
			return next(new AppError("Please provide a valid order id", 400));
		const order = await Shipment.findByIdAndUpdate(
			orderId,
			{
				quantity,
				shipped,
				orderedOn,
			},
			{ new: true, runValidators: true }
		);

		if (!order) return next(new AppError("Order not found", 404));

		sendOrder(res, order, 200, 1);
	}
);

//! NOT TESTED
/**
 * @brief Function to generate a report for the orders  of an organization
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orgId (string) Organization id
 * @returns json response
 */
export const orderReport = catchAsync(
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
		const report = await Shipment.aggregate([
			{
				$match: {
					organizationId: new Types.ObjectId(orgid),
				},
			},
			{
				$lookup: {
					from: "items",
					as: "items",
					foreignField: "_id",
					localField: "item",
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
						orderedOn: "$orderedOn",
					},
					items: {
						$addToSet: "$items",
					},
					numOfItems: {
						$sum: 1,
					},
					totalUnits: {
						$sum: "$quantity",
					},
					totalSellingPrice: {
						$sum: { $sum: "$items.sellingPrice" },
					},
					totalCostPrice: {
						$sum: { $sum: "$items.costPrice" },
					},
				},
			},
		]);
		return res.status(200).json({
			status: "success",
			data: {
				report,
			},
		});
	}
);
/**
 * @brief Function to delete an order with a given ID
 * @param req (Express Request Object)
 * @param res (Express Response Object)
 * @param next (Express Next function)
 * @param orderId (string)
 * @sideEffect soft deletes the order
 */
export const deleteOrder = async (
	req: ExpressTypes.Request,
	res: ExpressTypes.Response,
	next: ExpressTypes.NextFn
) => {
	const { orderId } = req.params;
	if (!orderId)
		return next(new AppError("Please provide a valid order id", 400));
	await Shipment.findByIdAndDelete(orderId);
	return res.status(204).end();
};

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
export const searchOrder = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { orgid } = req.params;
		let queryStr = String(req.query.query || "");
		queryStr = queryStr.replaceAll("'", "");

		if (!orgid) return next(new AppError("Invalid organization", 400));
		const regex = new RegExp(`.*${queryStr}.*`, "i");

		let orders;
		if (redisClient.isReady) {
			orders = await redisClient.hGet(`organization-${orgid}`, "orders");
			if (orders && queryStr.length) {
				orders = JSON.parse(orders);
				orders = orders.values().filter((items: any) => {
					const itemsStr = JSON.stringify(items);
					return regex.test(itemsStr);
				});
			}
			if (!orders || !orders.length || !queryStr.length) {
				orders = await new ApiFilter(
					Shipment.find({ organizationId: orgid }),
					req.parsedQuery!
				)
					.sort()
					.project()
					.filter().query;
				const itemsStr = JSON.stringify(orders);
				await redisClient.hSet(
					`organization-${orgid}`,
					"orders",
					itemsStr
				);
			}
		} else {
			orders = await new ApiFilter(
				Shipment.find({ organizationId: orgid }),
				req.parsedQuery!
			)
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
	}
);
