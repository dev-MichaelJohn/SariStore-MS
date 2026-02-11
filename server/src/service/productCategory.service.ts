import db, { ITransaction } from "../config/db.config";
import { ProductCategory } from "../db/schema.db";
import { eq, ilike } from "drizzle-orm";
import { isObjectEmpty } from "../lib/utils.lib";
import AppResponse from "../lib/response.lib";

export type IProductCategorySelect = typeof ProductCategory.$inferSelect;
export type IProductCategoryInsert = typeof ProductCategory.$inferInsert;

/**
 * Wrapper service for ProductCategory-model related database operations   
 *
 * @export
 * @class ProductCategoryService
 */
export default class ProductCategoryService {
    /**
     * Fetches a product category by their UUID
     *
     * @static
     * @param {string} id
     * @return {*}  {(Promise<IProductCategorySelect | null>)}
     * @memberof ProductCategoryService
     */
    static async GetProductCategoryById(id: string): Promise<IProductCategorySelect | null> {
        if(!id || id.trim().length === 0) return null;

        const [ productCategory ] = await db.select()
            .from(ProductCategory)
            .where(eq(ProductCategory.id, id));
        if(!productCategory) return null;
        return productCategory;
    }

    /**
     * Fetches all products categories and applies dynamic filters
     *
     * @static
     * @param {number} page
     * @param {Partial<IProductCategorySelect>} filters
     * @return {*}  {(Promise<IProductCategorySelect[] | null>)}
     * @memberof ProductCategoryService
     */
    static async GetAllProductCategory(page?: number, filters?: Omit<IProductCategorySelect, "id">): Promise<IProductCategorySelect[] | null> {
        //if(!page || page < 0) return null;
        
        //const DEFAULT_PAGE_ITEMS = 10;
        let query;

        if(filters && filters.name.trim().length !== 0)  {
            query = db.select()
                .from(ProductCategory)
                .where(ilike(ProductCategory.name, `%${filters.name}%`));
        } else {
            query = db.select()
                .from(ProductCategory);
        }

        const productCategories = await query;
        if(!productCategories || productCategories.length === 0) return null;
        return productCategories;
    }

    /**
     * Atomic creation of a new product category
     *
     * @static
     * @param {IProductCategoryInsert} data
     * @param {ITransaction} tx 
     * @return {*}  {(Promise<IProductCategorySelect | null>)}
     * @memberof ProductCategoryService
     */
    static async CreateProductCategoryViaTransaction(data: IProductCategoryInsert, tx: ITransaction): Promise<IProductCategorySelect | null> {
        console.log(data);
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;

        const [ productCategory ] = await tx.insert(ProductCategory)
            .values(data)
            .returning();
        if(!productCategory) throw AppResponse.InternalServerError("❌ Failed to create product category record");
        return productCategory;
    }

    /**
     * Atomic updating of an existing product category
     *
     * @static
     * @param {IProductCategoryInsert} data
     * @param {ITransaction} tx 
     * @return {*}  {(Promise<IProductCategorySelect | null>)}
     * @memberof ProductCategoryService
     */
    static async UpdateProductCategoryViaTransaction(data: Partial<IProductCategoryInsert>, tx: ITransaction): Promise<IProductCategorySelect | null> {
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;

        if(!data.id || data.id.trim().length === 0) return null;
        let productCategory = await ProductCategoryService.GetProductCategoryById(data.id as string);
        if(!productCategory) return null;

        productCategory = { ...productCategory, ...data };
        const [ updatedCategory ] = await tx.update(ProductCategory)
            .set(productCategory)
            .where(eq(ProductCategory.id, productCategory.id));
        if(!updatedCategory) throw AppResponse.InternalServerError("❌ Failed to update product category record");
        return updatedCategory;
    }

    /**
     * Atomic deletion of a new product category
     *
     * @static
     * @param {string} id
     * @param {ITransaction} tx 
     * @return {*}  {(Promise<IProductCategorySelect | null>)}
     * @memberof ProductCategoryService
     */
    static async DeleteProductCategoryViaTransaction(id: string, tx: ITransaction): Promise<null | void> {
        if(!id || id.trim().length === 0) return null;
        if(!tx) return null;

        const productCategory = await ProductCategoryService.GetProductCategoryById(id);
        if(!productCategory) return null;

        await tx.delete(ProductCategory)
            .where(eq(ProductCategory.id, productCategory.id))
    }
}
