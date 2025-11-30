import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";
import axios from "axios";

export type ItemReportType = {
	numOfItems: number;
	totalQuantity: number;
	averageQuantity: number;
	totalCostPrice: number;
	totalSellingPrice: number;
	averageCostPrice: number;
	averageSellingPrice: number;
};

type getItemProps = (SKU: string) => Promise<Item | void>;
type getItemByIdProps = (itemId: string) => Promise<Item | void>;
type getAllItemsProps = (
	orgId: string,
	page: number
) => Promise<{ items: Item[]; count: number } | void>;
type addItemProps = (
	itemDetails: Record<string, string | number>
) => Promise<any>;
type updateItemProps = ({
	newItem,
	itemId,
}: {
	newItem: Record<string, string | number | Date>;
	itemId: string;
}) => Promise<any>;
type deleteItemProps = (orgId: string) => Promise<any>;
type getItemsReportProps = (orgId: string) => Promise<ItemReportType | null>;

/**
 * @brief async function to request api to get item by SKU
 * @param SKU item's SKU
 * @effect raises toast on failiure
 * @return {Item} item data
 * @author `Ravish Ranjan`
 */
export const getItem: getItemProps = async (SKU) => {
	try {
		const res = await axinstance.get(`/v1/item/${SKU}`);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while getting the item");
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief async function to request api to get item by id
 * @param itemId item's id
 * @effect raises toast on failiure
 * @return {Item} item data
 * @author `Ravish Ranjan`
 */
export const getItemById: getItemByIdProps = async (itemId) => {
	try {
		const res = await axinstance.get(`/v1/item/id/${itemId}`);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while getting the item");
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief async function to request api to get all items of a organization
 * @param page page no.
 * @param orgid organization's id
 * @effect raises toast on failiure
 * @return {Item[]} items data
 * @author `Ravish Ranjan`
 */
export const getAllItems: getAllItemsProps = async (orgId, page = 1) => {
	try {
		const res = await axinstance.get(
			`/v1/item/allItems/${orgId}?page=${page}`
		);
		if (res.status === 200)
			return {
				items: res.data.data.item,
				count: res.data.count,
			};
		else handleError("There was an error while getting the item");
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief async function to request api to add new item
 * @param itemDetails user's id
 * @effect raises toast on success/failiure
 * @return {Item} inserted item data
 * @author `Ravish Ranjan`
 */
export const addItem: addItemProps = async (itemDetails) => {
	try {
		const res = await axinstance.post("/v1/item", itemDetails);
		if (res.status === 201) return res.data.data.item;
		else handleError("There was an error while adding item");
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief async function to request api to update item
 * @param {{newIrem:"new item information", itemId:string}} form user's id
 * @effect raises toast on success/failiure
 * @return {Item} updated item data
 * @author `Ravish Ranjan`
 */
export const updateItem: updateItemProps = async ({ newItem, itemId }) => {
	try {
		const res = await axinstance.patch(`/v1/item/${itemId}`, newItem);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while updating the item");
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief async function to request api to delete item
 * @param itemId item's id
 * @effect raises toast on failiure
 * @author `Ravish Ranjan`
 */
export const deleteItem: deleteItemProps = async (itemId) => {
	try {
		const res = await axinstance.delete(`/v1/item/${itemId}`);
		if (res.status !== 204)
			handleError("There was an error while deleting item");
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief async function to request api to get items' report
 * @param orgid organization's id
 * @effect raises toast on failiure
 * @return {ItemReportType} item report
 * @author `Ravish Ranjan`
 */
export const getItemsReport: getItemsReportProps = async (orgId) => {
	try {
		const res = await axinstance.get(`/v1/item/report/${orgId}`);
		if (res.status == 200) {
			return res.data.data.report;
		}
		handleError("There was an error while getting report");
		return null;
	} catch (err) {
		handleError(err);
		return null;
	}
};

/**
 * @brief async function to request api to employment status to be able to edit item
 * @param orgSlug organization's slug
 * @effect raises toast on failiure
 * @return {boolean} is user an employee or not
 * @author `Ravish Ranjan`
 */
export const checkEmployeeStatus = async (orgSlug: string) => {
	try {
		const res = await axinstance.get(`/v1/auth/isEmployee/${orgSlug}`);
		if (res.status === 200) {
			return res.data.isEmployee;
		} else {
			handleError(
				new Error(
					"There was an error while checking your employment status"
				)
			);
		}
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief async function to request api to search item in table
 * @param orgid organization's id
 * @param query query to serach item with
 * @param controller controller of searching
 * @effect raises toast on success/failiure
 * @author `Ravish Ranjan`
 */
export const searchItems = async ({
	orgid,
	query,
	controller,
}: Record<string, any>) => {
	try {
		const res = await axinstance.get(
			`/v1/item/search/${orgid}?query=${encodeURIComponent(query)}`,
			{ signal: controller.signal }
		);
		if (res.status === 200) {
			return res.data.data;
		} else {
			handleError(
				new Error("There was an error fetching the items data")
			);
		}
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief async function to request remote api to add Item By Barcode
 * @param barcode barcode's code
 * @effect raises toast on success/failiure
 * @author {Item} item data
 * @author `Gaurang Tyagi`
 */
export const addItemByBarcode = async (barcode: string) => {
	try {
		const res = await axios.get(
			`https://world.openfoodfacts.org/api/v0/product/${barcode}`
		);
		if (res.status === 200) {
			const product = res.data;
			const data = {
				name:
					product.product.product_name ||
					product.product.product_name_en ||
					"Unknown Product",
				origin:
					product.product.countries?.replace("en:", "") || "Unknown",
				brand: product.product.brands || "Unknown",
				inventoryCategory: product.product.product_type || "unknown",
				weight: product.product.quantity || null,
			};
			return data;
		} else {
			handleError(
				new Error(
					"There was an error while adding the item to inventory"
				)
			);
		}
	} catch (err) {
		handleError(err);
	}
};
