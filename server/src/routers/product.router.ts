import { Router } from "express";
import ProductController from "../controllers/product.controller";

const ProductRouter = Router();

ProductRouter.get("/products", ProductController.GetAllProducts);
ProductRouter.get("/products/:id", ProductController.GetProductById);

ProductRouter.post("/products", ProductController.CreateProduct);

export default ProductRouter;
