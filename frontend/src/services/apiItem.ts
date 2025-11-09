import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";

export type ReportType = {
	numOfItems: number;
	totalQuantity: number;
	averageQuantity: number;
	totalCostPrice: number;
	totalSellingPrice: number;
	averageCostPrice: number;
	averageSellingPrice: number;
};

type getItemProps = (SKU: string) => Promise<Item | void>;
type getAllItemsProps = (orgId: string, page: number) => Promise<Item[] | void>;
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
type getReportProps = (orgId: string) => Promise<ReportType | null>;

export const getItem: getItemProps = async (SKU) => {
	try {
		const res = await axinstance.get(`/v1/item/${SKU}`);
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
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while getting the item");
	} catch (err) {
		handleError(err);
	}
};

export const addItem: addItemProps = async (itemDetails) => {
	try {
		console.log("Item Details", itemDetails);
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

export const getReport: getReportProps = async (orgId) => {
	try {
		const res = await axinstance.get(`/v1/item/report/${orgId}`);
		if (res.status !== 200) {
			handleError("There was an error while getting report");
			return null;
		}
		return res.data.data.report;
	} catch (err) {
		handleError(err);
		return null;
	}
};
