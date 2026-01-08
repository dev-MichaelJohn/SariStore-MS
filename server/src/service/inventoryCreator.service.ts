import InventoryService, { IInventoryInsert } from "./inventory.service";
import db from "../config/db.config";
import AppResponse from "../lib/response.lib";

export default class InventoryCreatorService {
    static async Update(id: string, inventory: Partial<IInventoryInsert>, mode?: "increment" | "decrement") {
        return await db.transaction(async(tx) => {
            const updated = await InventoryService.UpdateInventoryViaTransaction(id, inventory, tx, mode);
            if(!updated) throw AppResponse.InternalServerError("❌ Failed to update inventory record");
            
            return updated;
        });
    }
}
