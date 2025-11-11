import db, { ITransaction } from "../config/db.config.js";
import { eq, and, ilike, lte } from "drizzle-orm";
import { Product } from "../db/schema.db.js";
import { Column } from "drizzle-orm";

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
     * @return {*} 
     * @memberof ProductService
     */
    private static GenerateFilters(filters?: Partial<IProductSelect>) {
        let newFilters;
        if(filters && Object.keys(filters).length > 0) {
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
                }
            });
            newFilters = and(...conditions);
        }

        return newFilters;
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
     * @memberof PersonService
     */
    static async GetAllProducts(filters?: Partial<IProductSelect>): Promise<IProductSelect[] | null> {
        const filterParams = ProductService.GenerateFilters(filters);

        const products = await db.select()
            .from(Product)
            .where(filterParams)
        if(!products || products.length === 0) return null;
        return products;
    };

    static async CreateProductViaTransaction(data: IProductInsert, tx: ITransaction): Promise<IProductSelect | null> {
        const [ product ] = await tx.insert(Product)
            .values(data)
            .returning();
        if(!product) return null;
        return product;
    };

};
