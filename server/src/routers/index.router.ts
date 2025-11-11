import { Router } from "express";
import AuthRouter from "./auth.router.js";

const v1Router = Router();
v1Router.use("/auth", AuthRouter)

export default v1Router;