import db from "../config/db.config";
import ProductService, { IProductInsert } from "./product.service";
import InventoryService, { IInventoryInsert } from "./inventory.service";
import AppResponse from "../lib/response.lib";
import ProductCategoryService, { IProductCategoryInsert } from "./productCategory.service";

/**
 * Wrapper service for creating a product record along with their associated inventory record
 *
 * @export
 * @class ProductCreatorService 
 */
export default class ProductCreatorService {
    /**
     * Creates a new operator along with their associated person record atomically
     *
     * @static
     * @param {IProductInsert} product
     * @param {Omit<IInventorySelect, "productId">} inventory
     * @memberof ProductCreatorService
     */
    static async Create(product: Omit<IProductInsert, "categoryId">, productCategory: IProductCategoryInsert | string, inventory: Omit<IInventoryInsert, "productId">) {
        return await db.transaction(async (tx) => {
            let productCategoryId;
            if(typeof(productCategory) !== "string") {
                const productCategoryRecord = await ProductCategoryService.CreateProductCategoryViaTransaction(productCategory, tx);
                if(!productCategoryRecord) throw AppResponse.InternalServerError("❌ Failed to create product category record");
                productCategoryId = productCategoryRecord.id;
            } else {
                productCategoryId = productCategory;
            }

            const newProduct: IProductInsert = {...product, "categoryId": productCategoryId as string };
            const productRecord = await ProductService.CreateProductViaTransaction(newProduct, tx);
            if(!productRecord) throw AppResponse.InternalServerError("❌ Failed to create product record");

            const inventoryData = { ...inventory, productId: productRecord.id };
            const newInventory = await InventoryService.CreateInventoryViaTransaction(inventoryData, tx);
            if(!newInventory) throw AppResponse.InternalServerError("❌ Failed to create inventory record");
            return newInventory;
        });
    }

    static async Update(id: string, product: Omit<Partial<IProductInsert>, "deletedAt">) {
        return await db.transaction(async (tx) => {
            const updated = await ProductService.UpdateProductViaTransaction(id, product, tx);
            if(!updated) throw AppResponse.InternalServerError("❌ Failed to update product record");

            return updated;
        });
    }

    static async Delete(id: string) {
        return await db.transaction(async (tx) => {
            const productDeleted = await ProductService.DeleteProductViaTransaction(id, tx);
            if(productDeleted === null) throw AppResponse.InternalServerError("❌ Failed to delete product record");

            const inventoryDeleted = await InventoryService.DeleteInventoryViaTransaction(id, tx);
            if(inventoryDeleted === null) throw AppResponse.InternalServerError("❌ Failes to delete inventory record");

            return inventoryDeleted;
        });
    }
} 
