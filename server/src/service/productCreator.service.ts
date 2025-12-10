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
    static async Create(product: IProductInsert, productCategory: IProductCategoryInsert | string, inventory: Omit<IInventoryInsert, "productId">) {
        return await db.transaction(async (tx) => {
            let productCategoryId;
            if(typeof(productCategory) !== "string") {
                const productCategoryRecord = await ProductCategoryService.CreateProductCategoryViaTransaction(productCategory, tx);
                if(!productCategoryRecord) throw AppResponse.InternalServerError("❌ Failed to create product category record");
                productCategoryId = productCategory.id;
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
} 
