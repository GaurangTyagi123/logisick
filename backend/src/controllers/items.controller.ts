import Item from '../models/item.model';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import checkRequestBody from '../utils/checkRequestBody';

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
                'origin'
            ],
            true
        );
        if (!newItem)
            return next(new AppError('Please provide complete details', 400));
        const item = await Item.create(newItem);
        sendItem(res, item, 201);
    }
);
export const getAllItems = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const { orgId } = req.params;
        if (!orgId)
            return next(
                new AppError('Please provide a valid organization id', 400)
            );
        const items = await Item.find({ organization: orgId });
        if (!items) sendItem(res, [], 200);
        else sendItem(res, items, 200);
    }
);
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
export const updateItem = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const updatedItem = checkRequestBody(req.body, ['name', 'costPrice', 'sellingPrice', 'quantity', 'inventoryCategory', 'importance', 'importedOn', 'expiresOn', 'weight', 'colour', 'reorderLevel', 'origin'], true);
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
