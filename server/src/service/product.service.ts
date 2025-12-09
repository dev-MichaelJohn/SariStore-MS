import db, { ITransaction } from "../config/db.config.js";
import { eq, and, ilike, lte, SQL } from "drizzle-orm";
import { Product } from "../db/schema.db.js";
import { Column } from "drizzle-orm";
import { isObjectEmpty } from "../lib/utils.lib.js";
import AppResponse from "../lib/response.lib.js";

export type IProductSelect = typeof Product.$inferSelect;
export type IProductInsert = typeof Product.$inferInsert;

/**
 * Wrapper service for Product-model related database operations   
 *
 * @export
 * @class ProductService
 */
export default class ProductService {

    /**
     * Generates dynamic conditions to be used in filtering results of GetAllProducts
     *
     * @static
     * @param {Partial<IProductSelect>} filters
     * @return {*}  {(SQL<boolean> | null)}
     * @memberof ProductService
     */
    private static GenerateFilters(filters?: Partial<IProductSelect>): SQL<boolean> | null {
        if(!filters || isObjectEmpty(filters)) return null;
        
        const conditions = Object.entries(filters).map(([ key, value ]) => {
            const column = Product[key as keyof typeof Product] as Column;
            switch(key) {
                case "id":
                case "categoryId":
                    return eq(column, value);
                case "name":
                    return ilike(column, `%${value}%`);
                case "costPrice":
                case "sellPrice":
                    return lte(column, value);
                default:
                    return undefined;
            }
        }).filter((c): c is SQL<boolean> => c !== undefined);
        
        return conditions.length > 0 ? and(...conditions) as SQL<boolean> : null;
    };

    /**
     * Fetches a product by their UUID
     *
     * @static
     * @param {string} id
     * @return {*}  {(Promise<IProductSelect | null>)}
     * @memberof ProductService
     */
    static async GetProductById(id: string): Promise<IProductSelect | null> {
        if(!id || id.trim().length === 0) return null;
        
        const [ product ] = await db.select()
            .from(Product)
            .where(eq(Product.id, id))
            .limit(1);
        if(!product) return null;
        return product;
    };

    /**
     * Fetches all products and applies dynamic filters
     *
     * @static
     * @param {Partial<IProductSelect>} filters
     * @return {*}  {(Promise<IProductSelect[] | null>)}
     * @memberof ProductService
     */
    static async GetAllProducts(page: number, filters?: Partial<IProductSelect>): Promise<IProductSelect[] | null> {
        if(page < 0) return null;
        
        const filterParams = ProductService.GenerateFilters(filters);
        const DEFAULT_PAGE_ITEMS = 10;
        let query;

        if(!filterParams) {
            query = db.select()
                .from(Product)
        } else {
            query = db.select()
                .from(Product)
                .where(filterParams);
        }

        const products = await query.limit(DEFAULT_PAGE_ITEMS)
            .offset((page - 1) * DEFAULT_PAGE_ITEMS);
        if(!products || products.length === 0) return null;
        return products;
    };
    
    /**
     * Atomic creation of a new product
     *
     * @static
     * @param {IProductInsert} data
     * @param {ITransaction} tx 
     * @return {*}  {(Promise<IProductSelect | null>)}
     * @memberof ProductService
     */
    static async CreateProductViaTransaction(data: IProductInsert, tx: ITransaction): Promise<IProductSelect | null> {
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;

        const [ product ] = await tx.insert(Product)
            .values(data)
            .returning();
        if(!product) throw AppResponse.InternalServerError("❌ Failed to create product record");
        return product;
    };

    /**
     * Atomic updating of an existing product record 
     *
     * @static
     * @param {Patial<IProductInsert>} data
     * @param {ITransaction} tx
     * @return {*}  {Promise<IProductSelect | null>}
     * @memberof ProductService
     */
    static async UpdateProductViaTransaction(data: Partial<IProductInsert>, tx: ITransaction): Promise<IProductSelect | null> {
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;

        let product = await ProductService.GetProductById(data?.id as string);
        if(!product) return null;

        product = { ...product, ...data };
        const [ newProduct ] = await tx.update(Product)
            .set(product)
            .where(eq(Product.id, product.id))
            .returning();
        if(!newProduct) throw AppResponse.InternalServerError("❌ Failed to update product record");
        return newProduct;
    };
    
    /**
     * Atomic updating of an existing product record 
     *
     * @static
     * @param {string} id
     * @param {ITransaction} tx
     * @return {*}  {Promise<void | null>}
     * @memberof ProductService
     */
    static async DeleteProductViaTransaction(id: string, tx: ITransaction): Promise<void | null> {
        if(!id || id.trim().length === 0) return null;
        if(!tx) return null;
        
        const product = await ProductService.GetProductById(id);
        if(!product) return null;

        await tx.delete(Product)
            .where(eq(Product.id, product.id))
    }
};
