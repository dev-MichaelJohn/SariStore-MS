import db, { ITransaction } from "../config/db.config.js";
import { eq, and, lte, SQL } from "drizzle-orm";
import { Inventory } from "../db/schema.db.js";
import { Column } from "drizzle-orm";
import { isObjectEmpty } from "../lib/utils.lib.js";

export type IInventorySelect =  typeof Inventory.$inferSelect;
export type IInventoryInsert = typeof Inventory.$inferInsert;

export default class InventoryService {
    private static GenerateFilters(filters?: Partial<IInventorySelect>) {
        if(!filters || isObjectEmpty(filters)) return null;
        
        const conditions = Object.entries(filters).map(([key, value]) => {
            const column = Inventory[key as keyof typeof Inventory] as Column;
            switch(key) {
                case "id":
                case "productId":
                    return eq(column, value);
                case "quantity":
                case "reorderLevel":
                    return lte(column, value);
                default:
                    return undefined; 
            }
        }).filter((c): c is SQL<boolean> => c !== undefined);
        
        return conditions.length > 0 ? and(...conditions) as SQL<boolean> : null;
    }
    
    static async GetInventoryById(id: string): Promise<IInventorySelect | null> {
        if(id.trim().length === 0) return null;
        const [ inventory ] = await db.select()
            .from(Inventory)
            .where(eq(Inventory.id, id));
        return (!inventory) ? null : inventory;
    };

    static async GetAllInventory(page: number, filters?: Partial<IInventorySelect>): Promise<IInventorySelect[] | null> {
        if(page < 0) return null;

        const DEFAULT_PAGE_ITEMS = 10;
        const filterParams = InventoryService.GenerateFilters(filters);
        let query;

        if(!filterParams) {
            query = db.select()
                .from(Inventory);
        } else {
            query = db.select()
                .from(Inventory)
                .where(filterParams);
        }

        const inventories = await query.limit(DEFAULT_PAGE_ITEMS)
            .offset((page - 1) * DEFAULT_PAGE_ITEMS);
        return (!inventories || inventories.length === 0) ? null : inventories;
    } 
    
    static async CreateInventoryViaTransaction(data: IInventoryInsert, tx: ITransaction): Promise<IInventorySelect | null> {
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;

        const [ inventory ] = await tx.insert(Inventory)
            .values(data)
            .returning();
        return (!inventory) ? null : inventory;
    }

    static async UpdateInventoryViaTransaction(data: Partial<IInventoryInsert>, tx: ITransaction): Promise<IInventorySelect | null> {
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;

        let inventoryRecord = await InventoryService.GetInventoryById(data?.id as string);
        if(!inventoryRecord) return null;

        inventoryRecord = { ...inventoryRecord, ...data };
        const [ inventory ] = await tx.update(Inventory)
            .set(inventoryRecord)
            .where(eq(Inventory.id, inventoryRecord.id))
            .returning();
        return (!inventory) ? null : inventory;
    }

    static async DeleteInventoryViaTransaction(id: string, tx: ITransaction): Promise<null | void> {
        if(!id || id.trim().length === 0) return null;
        if(!tx) return null;

        const inventory = await InventoryService.GetInventoryById(id);
        if(!inventory) return null;

        await tx.delete(Inventory)
            .where(eq(Inventory.id, inventory.id));
    }
};
