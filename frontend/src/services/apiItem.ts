import axinstance from "@/utils/axios"
import { handleError } from "@/utils/handleError"

type getItemType = (SKU: string) => Promise<Item | void>;
type getAllItems = (orgId: string) => Promise<Item[] | void>;
type addItem = (itemDetails: Record<string, string | number>) => Promise<any>;
type updateItem = ({ newItem, itemId }: { newItem: Record<string, string | number>, itemId: string }) => Promise<any>;
type deleteItem = (orgId: string) => Promise<any>;


export const getItem:getItemType = async (SKU) => {
    try {
        const res = await axinstance.get(`api/v1/item/${SKU}`);
        if (res.status === 200)
            return res.data.data.item;
        else
            handleError("There was an error while getting the item")
    }
    catch (err) {
        handleError(err)
    }
}

export const getAllItems = async (orgId:string) => {
    try {
        const res = await axinstance.get(`api/v1/item/${orgId}`);
        if (res.status === 200)
            return res.data.data.item;
        else
            handleError("There was an error while getting the item")
    }
    catch (err) {
        handleError(err)
    }
}

export const addItem = async (itemDetails:Record<string,string|number>) => {
    try {
        const res = await axinstance.post('/api/v1/item',itemDetails);
        if (res.status === 201)
            return res.data.data.item;
        else
            handleError("There was an error while adding item")
    }
    catch (err) {
        handleError(err)
    }
}

export const updateItem = async ({newItem,itemId}:{newItem: Record<string, string | number>,itemId:string}) => {
 try {
        const res = await axinstance.patch(`/api/v1/item/${itemId}`,newItem);
        if (res.status === 200)
            return res.data.data.item;
        else
            handleError("There was an error while updating the item")
    }
    catch (err) {
        handleError(err)
    }   
}

export const deleteItem = async (itemId:string) => {
 try {
        const res = await axinstance.delete(`/api/v1/item/${itemId}`);
        if (res.status !== 204)
            handleError("There was an error while deleting item")
    }
    catch (err) {
        handleError(err)
    }   
}