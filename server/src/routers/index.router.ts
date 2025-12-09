import { Router } from "express";
import AuthRouter from "./auth.router.js";
import ProductRouter from "./product.router.js";

const v1Router = Router();
v1Router.use("/auth", AuthRouter);
v1Router.use("/products", ProductRouter);

export default v1Router;
