import { Router } from "express";
import AuthRouter from "./auth.router.js";
import ProductRouter from "./product.router.js";
import InventoryRouter from "./inventory.router.js";

const v1Router = Router();
v1Router.use("/auth", AuthRouter);
v1Router.use("/products", ProductRouter);
v1Router.use("/inventories", InventoryRouter);

export default v1Router;
