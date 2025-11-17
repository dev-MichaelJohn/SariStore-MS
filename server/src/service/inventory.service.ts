import db, { ITransaction } from "../config/db.config.js";
import { eq, and, ilike, lte, SQL } from "drizzle-orm";
import { Inventory } from "../db/schema.db.js";
import { Column } from "drizzle-orm";

export type IInventorySelect =  typeof Inventory.$inferSelect;
export type IInventoryInsert = typeof Inventory.$inferInsert;

export default class InventoryService {
    static async GetInventoryById(id: string): Promise<IInventorySelect | null> {
        if(id.trim().length === 0) return null;
        const [ inventory ] = await db.select()
            .from(Inventory)
            .where(eq(Inventory.id, id));
        if(!inventory) return null;
        return inventory;
    };

    static async GetAllInventory(): Promise<IInventorySelect[] | null> {
        const inventories = await db.select()
            .from(Inventory);
        if(!inventories || inventories.length === 0) return null;
        return inventories;
    } 
    
    static async CreateInventoryViaTransaction(data: IInventoryInsert, tx: ITransaction): Promise<IInventorySelect | null> {

    }

};
