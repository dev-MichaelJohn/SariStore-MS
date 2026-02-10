import { Router } from "express";
import ProductController from "../controllers/product.controller";

const ProductRouter = Router();

ProductRouter.get("/", ProductController.GetAllProducts);
ProductRouter.post("/", ProductController.CreateProduct);

ProductRouter.get("/categories", ProductController.GetAllProductCategory);

ProductRouter.get("/:id", ProductController.GetProductById);
ProductRouter.patch("/:id", ProductController.UpdateProduct);
ProductRouter.delete("/:id", ProductController.DeleteProduct);

export default ProductRouter;
