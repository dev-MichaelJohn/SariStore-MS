import db, { ITransaction } from "../config/db.config.js";
import { eq, and, lte, SQL } from "drizzle-orm";
import { Inventory } from "../db/schema.db.js";
import { Column } from "drizzle-orm";
import { isObjectEmpty } from "../lib/utils.lib.js";
import AppResponse from "../lib/response.lib.js";

export type IInventorySelect =  typeof Inventory.$inferSelect;
export type IInventoryInsert = typeof Inventory.$inferInsert;

export default class InventoryService {
    /**
     * Generates dynamic conditions to be used in filtering results of GetAllInventories
     *
     * @static
     * @param {Partial<IInventorySelect>} filters
     * @return {*}  {(SQL<boolean> | null)}
     * @memberof InventoryService
     */
    private static GenerateFilters(filters?: Partial<IInventorySelect>): SQL<boolean> | null {
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
    
    /**
     * Fetches an inventory record by their UUID
     *
     * @static
     * @param {string} id
     * @return {*}  {(Promise<IInventorySelect | null>)}
     * @memberof InventoryService
     */
    static async GetInventoryById(id: string): Promise<IInventorySelect | null> {
        if(id.trim().length === 0) return null;
        const [ inventory ] = await db.select()
            .from(Inventory)
            .where(eq(Inventory.id, id));
        if(inventory && inventory.deletedAt) throw AppResponse.BadRequest("❌ Inventory record doesn't exist");

        return (!inventory) ? null : inventory;
    };

    /**
     * Fetches all inventories and applies dynamic filters
     *
     * @static
     * @param {Partial<IInventorySelect>} filters
     * @return {*}  {(Promise<IInventorySelect[] | null>)}
     * @memberof InventoryService
     */
    static async GetAllInventories(page: number, filters?: Omit<Partial<IInventorySelect>, "deletedAt">): Promise<IInventorySelect[] | null> {
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

        const inventoriesFiltered = inventories.filter((inventory) => !inventory.deletedAt);
        return (!inventoriesFiltered || inventoriesFiltered.length === 0) ? null : inventoriesFiltered;
    } 
    
    /**
     * Atomic creation of a new inventory record
     *
     * @static
     * @param {IInventorySelect} data
     * @param {ITransaction} tx 
     * @return {*}  {(Promise<InventoryService | null>)}
     * @memberof InventoryService
     */
    static async CreateInventoryViaTransaction(data: IInventoryInsert, tx: ITransaction): Promise<IInventorySelect | null> {
        console.log(data);
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;

        const [ inventory ] = await tx.insert(Inventory)
            .values(data)
            .returning();

        if(!inventory) throw AppResponse.InternalServerError("❌ Failed to create inventory record");
        return inventory;
    }

    /**
     * Atomic updating of an existing inventory record 
     *
     * @static
     * @param {Patial<IInventoryInsert>} data
     * @param {ITransaction} tx
     * param {"increment" | "decrement"} mode
     * @return {*}  {Promise<IInventorySelect | null>}
     * @memberof InventoryService
     */
    static async UpdateInventoryViaTransaction(id: string, data: Partial<IInventoryInsert>, tx: ITransaction, mode?: "increment" | "decrement"): Promise<IInventorySelect | null> {
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;

        let inventoryRecord = await InventoryService.GetInventoryById(id);
        if(!inventoryRecord) return null;
        if(inventoryRecord.deletedAt) throw AppResponse.BadRequest("❌ Inventory record doesn't exist");

        if(data.quantity !== undefined && mode !== undefined) {
            if(mode === "increment") {
                data.quantity += inventoryRecord.quantity;
            } else if(mode === "decrement" && (inventoryRecord.quantity - data.quantity) > 0) {
                data.quantity = inventoryRecord.quantity - data.quantity;
            } else throw AppResponse.BadRequest("❌ Insufficient quantity!!")
        }
        if(inventoryRecord.quantity < 0) return null;

        inventoryRecord = { ...inventoryRecord, ...data };
        console.log(inventoryRecord)
        const [ inventory ] = await tx.update(Inventory)
            .set(inventoryRecord)
            .where(eq(Inventory.id, inventoryRecord.id))
            .returning();
        
        if(!inventory) throw AppResponse.InternalServerError("❌ Failed to update inventory record");
        return (inventory.deletedAt) ? null : inventory;
    }

    /**
     * Atomic deletion of an existing inventory record 
     *
     * @static
     * @param {string} id
     * @param {ITransaction} tx
     * @return {*}  {Promise<void | null>}
     * @memberof InventoryService
     */
    static async DeleteInventoryViaTransaction(id: string, tx: ITransaction): Promise<null | void> {
        if(!id || id.trim().length === 0) return null;
        if(!tx) return null;

        const inventory = await InventoryService.GetInventoryById(id);
        if(!inventory) return null;
        if(inventory.deletedAt) throw AppResponse.BadRequest("❌ Inventory record doesn't exist");

        await tx.update(Inventory)
            .set({ deletedAt: new Date() })
            .where(eq(Inventory.id, inventory.id));
    }
};
