import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import AppResponse from "../lib/response.lib.js";

const AuthRouter = Router();

AuthRouter.post("/operatorCode", AuthMiddleware.ValidateOperatorCode, (_, res) => {
    const response = AppResponse.OK("✅ Operator code is valid");
    res.status(response.statusCode).json(response);
});

AuthRouter.post("/password", AuthMiddleware.ValidatePassword, (_, res) => {
    const response = AppResponse.OK("✅ Operator code is valid");
    res.status(response.statusCode).json(response);
});

AuthRouter.post("/login", AuthMiddleware.ValidateLogin, AuthController.Login);
AuthRouter.post("/logout", AuthController.Logout);
AuthRouter.get("/check-session", AuthController.CheckSession);

export default AuthRouter;