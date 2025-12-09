import { Router } from "express";
import ProductController from "../controllers/product.controller";

const ProductRouter = Router();

ProductRouter.get("/", ProductController.GetAllProducts);
ProductRouter.get("/:id", ProductController.GetProductById);

ProductRouter.post("/", ProductController.CreateProduct);

export default ProductRouter;
