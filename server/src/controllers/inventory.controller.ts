import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import InventoryService from "../service/inventory.service";
import AppResponse from "../lib/response.lib";
import { isObjectEmpty } from "../lib/utils.lib";
import db from "../config/db.config";

export default class InventoryController {
    static GetInventoryById = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const inventory = await InventoryService.GetInventoryById(String(id));
        if(!inventory) return next(AppResponse.NotFound("❌ Inventory record not found"));

        const response = AppResponse.OK("✅ Inventory record found!!", { inventory: inventory });
        res.status(response.statusCode).json(response);
    });
}
