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

export const getItem: getItemProps = async (SKU) => {
	try {
		const res = await axinstance.get(`/v1/item/${SKU}`);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while getting the item");
	} catch (err) {
		handleError(err);
	}
};

export const getItemById: getItemByIdProps = async (itemId) => {
	try {
		const res = await axinstance.get(`/v1/item/id/${itemId}`);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while getting the item");
	} catch (err) {
		handleError(err);
	}
};

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

export const addItem: addItemProps = async (itemDetails) => {
	try {
		const res = await axinstance.post("/v1/item", itemDetails);
		if (res.status === 201) return res.data.data.item;
		else handleError("There was an error while adding item");
	} catch (err) {
		handleError(err);
	}
};

export const updateItem: updateItemProps = async ({ newItem, itemId }) => {
	try {
		const res = await axinstance.patch(`/v1/item/${itemId}`, newItem);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while updating the item");
	} catch (err) {
		handleError(err);
	}
};

export const deleteItem: deleteItemProps = async (itemId) => {
	try {
		const res = await axinstance.delete(`/v1/item/${itemId}`);
		if (res.status !== 204)
			handleError("There was an error while deleting item");
	} catch (err) {
		handleError(err);
	}
};

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
