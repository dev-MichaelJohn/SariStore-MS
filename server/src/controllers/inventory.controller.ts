import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import InventoryService, { IInventorySelect } from "../service/inventory.service";
import AppResponse from "../lib/response.lib";

export default class InventoryController {
    static GetInventoryById = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const inventory = await InventoryService.GetInventoryById(String(id));
        if(!inventory) return next(AppResponse.NotFound("❌ Inventory record not found"));

        const response = AppResponse.OK("✅ Inventory record found!!", { inventory: inventory });
        res.status(response.statusCode).json(response);
    });

    static GetAllInventories = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { query }: { query: Partial<IInventorySelect> } = req;
        const { page } = req.query;

        const inventories = await InventoryService.GetAllInventories(Number(page), query);
        if(!inventories || inventories.length === 0) return next(AppResponse.NotFound("❌ No invetory records exist"));

        const response = AppResponse.OK("✅ Inventory records retrieved successfully", { inventories: inventories });
        res.status(response.statusCode).json(response);
    });

    static UpdateInventory = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        
    });
}
