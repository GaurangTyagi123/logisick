import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";

type getItemType = (SKU: string) => Promise<Item | void>;
type getAllItems = (orgId: string, page: number) => Promise<Item[] | void>;
type addItem = (itemDetails: Record<string, string | number>) => Promise<any>;
type updateItem = ({
	newItem,
	itemId,
}: {
	newItem: Record<string, string | number>;
	itemId: string;
}) => Promise<any>;
type deleteItem = (orgId: string) => Promise<any>;

export const getItem: getItemType = async (SKU) => {
	try {
		const res = await axinstance.get(`/v1/item/${SKU}`);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while getting the item");
	} catch (err) {
		handleError(err);
	}
};

export const getAllItems: getAllItems = async (orgId, page = 1) => {
	try {
		const res = await axinstance.get(`/v1/item/allItems/${orgId}?page=${page}`);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while getting the item");
	} catch (err) {
		handleError(err);
	}
};

export const addItem: addItem = async (itemDetails) => {
	try {
		console.log("Item Details", itemDetails);
		const res = await axinstance.post("/v1/item", itemDetails);
		if (res.status === 201) return res.data.data.item;
		else handleError("There was an error while adding item");
	} catch (err) {
		handleError(err);
	}
};

export const updateItem:updateItem = async ({ newItem, itemId }) => {
	try {
		const res = await axinstance.patch(`/v1/item/${itemId}`, newItem);
		if (res.status === 200) return res.data.data.item;
		else handleError("There was an error while updating the item");
	} catch (err) {
		handleError(err);
	}
};

export const deleteItem: deleteItem = async (itemId) => {
	try {
		const res = await axinstance.delete(`/v1/item/${itemId}`);
		if (res.status !== 204)
			handleError("There was an error while deleting item");
	} catch (err) {
		handleError(err);
	}
};
