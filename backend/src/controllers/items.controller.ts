import { Types } from 'mongoose';
import Item from '../models/item.model';
import ApiFilter from '../utils/apiFilter';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import checkRequestBody from '../utils/checkRequestBody';


/**
 * @brief sends item document as json response
 * @param res (response object)
 * @param item (item document)
 * @param status (status of the response)
 * @returns response object
 */
const sendItem = (
    res: ExpressTypes.Response,
    item: ItemType | ItemType[],
    status: number
) => {
    return res.status(status).json({
        status: 'success',
        data: {
            item,
        },
    });
};

/**
 * @brief function to add item to the inventory of an organization
 * @param req (Express Request Object) 
 * @param res (Express Response Object) 
 * @param next (Express Next function) 
 * @body name (string) organizationId (organization ID) costPrice (number)
 * sellingPrice (number) quantity (number) inventoryCategory (string) importedOn (date)
 * expiresOn (string) importance (string) weight (string) colour (string) batchNumber (number)
 * origin (string)
 * @sideeffect calls sendItem function
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
                'name',
                'organizationId',
                'costPrice',
                'sellingPrice',
                'quantity',
                'inventoryCategory',
                'importedOn',
                'expiresOn',
                'importance',
                'weight',
                'colour',
                'batchNumber',
                'origin',
            ],
            true
        );
        if (!newItem)
            return next(new AppError('Please provide complete details', 400));
        const item = await Item.create(newItem);
        sendItem(res, item, 201);
    }
);

/**
 * @brief Function to get all items belonging to an organization
 * @param req (Express Request Object) 
 * @param res (Express Response Object) 
 * @param next (Express Next function) 
 * @param orgId (string) Organization id
 * @sideEffect calls sendItem function
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
                new AppError('Please provide a valid organization id', 400)
            );
        const query = Item.find({ organizationId: orgid });
        const items = await new ApiFilter(query, req.parsedQuery!)
            .filter()
            .project()
            .sort()
            .paginate().query;

        if (!items) sendItem(res, [], 200);
        else sendItem(res, items, 200);
    }
);

/**
 * @brief Function to get all item with a specific ID
 * @param req (Express Request Object) 
 * @param res (Express Response Object) 
 * @param next (Express Next function) 
 * @param itemId (string)
 * @sideEffect calls sendItem function
 */
export const getItem = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const { itemId } = req.params;
        if (!itemId)
            return next(new AppError('Please provide a valid item id', 400));
        const item = (await Item.findById(itemId)) as ItemType;

        sendItem(res, item, 200);
    }
);
/**
 * @brief Function to get an Item with a specified SKU (Stock Keeping Unit)
 * @param req (Express Request Object) 
 * @param res (Express Response Object) 
 * @param next (Express Next function) 
 * @param SKU (string) Stock Keeping Unit
 * @sideEffect calls sendItem function
 */
export const getItemBySKU = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const { SKU } = req.params;
        if (!SKU)
            return next(new AppError('Please provide a valid item SKU', 400));
        const item = (await Item.findOne({ SKU })) as any | null;

        if (!item) return next(new AppError('Item not found', 404));
        sendItem(res, item as ItemType, 200);
    }
);
/**
 * @brief Function to get update an items with a given ID
 * @param req (Express Request Object) 
 * @param res (Express Response Object) 
 * @param next (Express Next function) 
 * @param itemId (string)
 * @sideEffect calls sendItem function
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
                'name',
                'costPrice',
                'sellingPrice',
                'quantity',
                'inventoryCategory',
                'importance',
                'importedOn',
                'expiresOn',
                'weight',
                'colour',
                'reorderLevel',
                'origin',
            ],
            true
        );
        const { itemId } = req.params;

        if (!itemId)
            return next(new AppError('please provide a valid item id', 400));
        if (!updatedItem)
            return next(new AppError('please provide valid data', 400));
        const newItem = (await Item.findByIdAndUpdate(itemId, updatedItem, {
            new: true,
            runValidators: true,
        })) as ItemType;
        sendItem(res, newItem, 200);
    }
);

/**
 * @brief Function to get an Item with a given ID
 * @param req (Express Request Object) 
 * @param res (Express Response Object) 
 * @param next (Express Next function) 
 * @param itemId (string)
 * @sideEffect soft deletes the item
 */
export const deleteItem = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const { itemId } = req.params;

        if (!itemId)
            return next(new AppError('please provide a valid item id', 400));
        await Item.findByIdAndDelete(itemId);
        return res.status(204).end();
    }
);

/**
 * @brief Function to generate a report for the items in the inventory of an organization
 * @param req (Express Request Object) 
 * @param res (Express Response Object) 
 * @param next (Express Next function) 
 * @param orgId (string) Organization id
 * @returns json response
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
                new AppError('please provide a valid organization id', 400)
            );
        const report = await Item.aggregate([
            {
                $match: {
                    organizationId: new Types.ObjectId(orgid),
                },
            },
            {
                $group: {
                    _id: '$organizationId',
                    numOfItems: {
                        $sum: 1,
                    },
                    averageQuantity: {
                        $avg: '$quantity',
                    },
                    totalCostPrice: {
                        $sum: '$costPrice',
                    },
                    totalSellingPrice: {
                        $sum: '$sellingPrice',
                    },
                    averageCostPrice: {
                        $avg: '$costPrice',
                    },
                    averageSellingPrice: {
                        $avg: '$sellingPrice',
                    },
                },
            },
        ]);

        return res.status(200).json({
            status: 'success',
            data: {
                report: report.at(0),
            },
        });
    }
);
