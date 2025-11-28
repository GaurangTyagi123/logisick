import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";

export type OrderReportType = {
	totalRevenue: number;
	totalOrders: number;
	totalQuantity: number;
};

type getAllOrdersProps = (
	orgid: string,
	page?: number
) => Promise<{
	orders: shipmentType[];
	count: number;
} | void>;

type getOrdersReportProps = (orgid: string) => Promise<OrderReportType | void>;

type getOrderByNameProps = (orderName: string) => Promise<{
	orders: shipmentType[];
	count: number;
} | void>;

type getOrderByIdProps = (
	orderId: string
) => Promise<{ order: shipmentType; count: number } | void>;

type createOrderProps = (newOrderDetails: {
	itemId: string;
	quantity: number;
	organizationId: string;
	orderedOn: Date;
}) => Promise<shipmentType | void>;

type updateOrderByIdProps = (
	orderId: string,
	orderUpdates: {
		quantity?: number;
		shipped?: boolean;
		orderedOn?: Date;
	}
) => Promise<shipmentType | void>;

type deleteOrderByIdProps = (orderId: string) => Promise<void>;

type sendOrdersReponse = {
	status: string;
	count?: number;
	order: Array<shipmentType | any>;
};
type sendOrderReponse = {
	status: string;
	count?: number;
	order: shipmentType;
};

/**
 * @brief api request to get all orders of an organization
 * @param {string} orgid organizatio's id
 * @param {number} page page no
 * @returns {Order[]} orders of an organization
 * @author `Ravish Ranjan`
 */
export const getAllOrders: getAllOrdersProps = async (orgid, page = 1) => {
	try {
		const res = await axinstance.get<{
			status: string;
			count?: number;
			order: shipmentType[];
		}>(`/v1/order/allOrders/${orgid}?page=${page}`);
		if (res.status === 200)
			return {
				orders: res.data.order,
				count: res.data.count || 0,
			};
		handleError("There was an error while getting all order details");
	} catch (error) {
		handleError(error);
	}
};

/**
 * @brief api request to get search results of order search
 * @param {string} orgid organizatio's id
 * @param query search query
 * @param controller search controller
 * @returns {Order[]} orders of an organization
 * @author `Ravish Ranjan`
 */
export const searchOrders = async ({
	orgid,
	query,
	controller,
}: Record<string, any>) => {
	try {
		const res = await axinstance.get(
			`/v1/order/allOrders/search/${orgid}?query=${encodeURIComponent(
				query
			)}`,
			{ signal: controller.signal }
		);
		if (res.status === 200) {
			return res.data.data;
		}
		handleError(new Error("There was an error fetching orders data"));
	} catch (error) {
		handleError(error);
	}
};

/**
 * @brief api request to get orders' report
 * @param {string} orgid organizatio's id
 * @returns {OrderReportType} orders's report
 * @author `Ravish Ranjan`
 */
export const getOrdersReport: getOrdersReportProps = async (orgid) => {
	try {
		const res = await axinstance.get(`/v1/order/allOrders/report/${orgid}`);
		if (res.status === 200) return res.data.data.report;
		handleError("There was an error fetching orders report");
	} catch (error) {
		handleError(error);
	}
};

/**
 * @brief api request to get order by name
 * @param {string} orderName order's name
 * @returns {Order} order of an organization
 * @author `Ravish Ranjan`
 */
export const getOrderByName: getOrderByNameProps = async (orderName) => {
	try {
		const res = await axinstance.get<sendOrdersReponse>(
			`/v1/order/getOrder/${orderName}`
		);
		if (res.status === 200)
			return {
				orders: res.data.order,
				count: res.data.count || 0,
			};
		handleError("There was an error while getting order by name");
	} catch (error) {
		handleError(error);
	}
};

/**
 * @brief api request to get order by Id
 * @param {string} orderId order's Id
 * @returns {Order} order of an organization
 * @author `Ravish Ranjan`
 */
export const getOrderById: getOrderByIdProps = async (orderId) => {
	try {
		const res = await axinstance.get<sendOrderReponse>(
			`/v1/order/${orderId}`
		);
		if (res.status === 200)
			return {
				order: res.data.order,
				count: res.data.count || 0,
			};
		handleError("There was an error while getting order details");
	} catch (error) {
		handleError(error);
	}
};

/**
 * @brief api request to create new Order
 * @param newOrderDetails order's details
 * ```
 * {
 * 		itemId: string;
 * 		quantity: number;
 * 		organizationId: string;
 * 		orderedOn: Date;
 * }
 * ```
 * @returns {Order} new order's details
 * @author `Ravish Ranjan`
 */
export const createOrder: createOrderProps = async (newOrderDetails) => {
	try {
		const res = await axinstance.post<sendOrderReponse>(
			`/v1/order`,
			newOrderDetails
		);
		if (res.status === 201) return res.data.order;
		handleError("There was an error while creating order");
	} catch (error) {
		handleError(error);
	}
};

/**
 * @brief api request to update order details
 * @param {string} orderId order's id
 * @param orderUpdates updates on the order
 * ```
 * {
 * 		quantity?: number | undefined;
 * 		shipped?: boolean | undefined;
 * 		orderedOn?: Date | undefined;
 * }
 * ```
 * @returns {Order} new order details
 * @author `Ravish Ranjan`
 */
export const updateOrderById: updateOrderByIdProps = async (
	orderId,
	orderUpdates
) => {
	try {
		const res = await axinstance.patch<sendOrderReponse>(
			`/v1/order/${orderId}`,
			orderUpdates
		);
		if (res.status === 200) return res.data.order;
		handleError("There was an error updating order details");
	} catch (error) {
		handleError(error);
	}
};

/**
 * @brief api request to delete and order by its id
 * @param {string} orderId order's id
 * @author `Ravish Ranjan`
 */
export const deleteOrderById: deleteOrderByIdProps = async (orderId) => {
	try {
		const res = await axinstance.delete(`/v1/order/${orderId}`);
		if (res.status === 204) return;
		handleError("There was an error deleting order");
	} catch (error) {
		handleError(error);
	}
};
