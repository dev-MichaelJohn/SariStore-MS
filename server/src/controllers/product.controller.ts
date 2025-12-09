import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import AppResponse from "../lib/response.lib.js";
import ProductService, { IProductSelect } from "../service/product.service.js";
import ProductCreatorService from "../service/productCreator.service.js";
import { isObjectEmpty } from "../lib/utils.lib.js";
import db from "../config/db.config.js";

export default class ProductController {
    static GetProductById = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const product = await ProductService.GetProductById(String(id));
        if(!product) return next(AppResponse.NotFound("❌ Product not found"));

        const response = AppResponse.OK("✅ Product record retrieved successfully", { product: product });
        res.status(response.statusCode).json(response);
    });

    static GetAllProducts = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { query }: { query: Partial<IProductSelect> } = req;
        const { page } = req.params;

        const products = await ProductService.GetAllProducts(Number(page), query);
        if(!products || products.length === 0) return next(AppResponse.NotFound("❌ No products exists"));
      
        const response = AppResponse.OK("✅ Product records retrieved successfully", { products: products });
        res.status(response.statusCode).json(response);
    });

    static CreateProduct = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { product, inventory } = req.body!.data;
        if(!product || isObjectEmpty(product)) return next(AppResponse.BadRequest("❌ Product data required"));
        if(!inventory || isObjectEmpty(inventory)) return next(AppResponse.BadRequest("❌ Inventory data required"));

        const newInventory = await ProductCreatorService.Create(product, inventory);
        if(!newInventory) return next(AppResponse.InternalServerError("❌ Failed to create product and inventory record"));

        const response = AppResponse.OK("✅ Product + Inventory record created successfully");
        res.status(response.statusCode).json(response);
    });

    static UpdateProduct = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { product } = req.body!.data;
        if(!product || isObjectEmpty(product)) return next(AppResponse.BadRequest("❌ Product data required"));
        let updated;

        await db.transaction(async(tx) => {
             updated = await ProductService.UpdateProductViaTransaction(product, tx);
        });
        if(!updated) return next(AppResponse.InternalServerError("❌ Failed to update product record"));

        const response = AppResponse.OK("✅ Product record updated successfully");
        res.status(response.statusCode).json(response);
    });

    static DeleteProduct = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        let deleted;

        await db.transaction(async(tx) => {
            deleted = await ProductService.DeleteProductViaTransaction(String(id), tx);
        });
        if(deleted === null) return next(AppResponse.InternalServerError("❌ Failed to delete product record"));

        const response = AppResponse.OK("✅ Product record deleted successfully");
        res.status(response.statusCode).json(response);
    });
}
