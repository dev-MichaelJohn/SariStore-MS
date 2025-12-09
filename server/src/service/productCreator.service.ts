import db from "../config/db.config";
import ProductService, { IProductInsert } from "./product.service";
import InventoryService, { IInventoryInsert } from "./inventory.service";
import AppResponse from "../lib/response.lib";

export default class ProductCreatorService {
    static async Create(product: IProductInsert, inventory: Omit<IInventoryInsert, "productId">) {
        return await db.transaction(async (tx) => {
            const productRecord = await ProductService.CreateProductViaTransaction(product, tx);
            if(!productRecord) throw AppResponse.InternalServerError("❌ Failed to create product record");

            const inventoryData = { ...inventory, productId: productRecord.id };
            const newInventory = await InventoryService.CreateInventoryViaTransaction(inventoryData, tx);
            if(!newInventory) throw AppResponse.InternalServerError("❌ Failed to create inventory record");
            return newInventory;
        });
    }
} 
