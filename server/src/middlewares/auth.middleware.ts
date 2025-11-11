import { NextFunction, Request, Response } from "express";
import * as Z from "zod";
import AppResponse from "../lib/response.lib.js";

const OperatorCode = Z.string()
    .trim()
    .nonempty("⚠️ Operator code is required")
    .min(11, "⚠️ Operator code must be 11 characters long")
    .max(11, "⚠️ Operator code must be 11 characters long")
    .regex(/^OP-[A-Z0-9]{8}$/, "⚠️ Invalid operator code format");

const Password = Z.string()
    .trim()
    .nonempty("⚠️ Password is required")
    .min(8, "⚠️ Password must be at least 8 characters long")
    .max(64, "⚠️ Password must be at most 64 characters long")
    .regex(/[A-Z]/, "⚠️ Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "⚠️ Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "⚠️ Password must contain at least one number")
    .regex(/[!@#$%^&*()_+={}[\]:";'<>?,./-]/, "⚠️ Password must contain at least one special character");

/**
 * Wrapper class for authentication middlewares
 *
 * @export
 * @class AuthMiddleware
 */
export default class AuthMiddleware {
    /**
     * Validates the operator code in the request body
     *
     * @static
     * @param {Request} req
     * @param {Response} _res
     * @param {NextFunction} next
     * @memberof AuthMiddleware
     */
    static ValidateOperatorCode(req: Request, _res: Response, next: NextFunction) {
        const { operatorCode } = req.body;
        const result = OperatorCode.safeParse(operatorCode);
        if(!result.success) throw AppResponse.BadRequest(undefined, result.error.issues[0]?.message);
        next();
    }

    /**
     * Validates the password in the request body
     *
     * @static
     * @param {Request} req
     * @param {Response} _res
     * @param {NextFunction} next
     * @memberof AuthMiddleware
     */
    static ValidatePassword(req: Request, _res: Response, next: NextFunction) {
        const { password } = req.body;
        const result = Password.safeParse(password);
        if(!result.success) throw AppResponse.BadRequest(undefined, result.error.issues[0]?.message);
        next();
    }

    /**
     * Validates both operator code and password in the request body
     *
     * @static
     * @param {Request} req
     * @param {Response} _res
     * @param {NextFunction} next
     * @memberof AuthMiddleware
     */
    static ValidateLogin(req: Request, _res: Response, next: NextFunction) {
        const { operatorCode, password } = req.body;
        const operatorCodeResult = OperatorCode.safeParse(operatorCode);
        if(!operatorCodeResult.success) throw AppResponse.BadRequest(undefined, operatorCodeResult.error.issues[0]?.message);
        const passwordResult = Password.safeParse(password);
        if(!passwordResult.success) throw AppResponse.BadRequest(undefined, passwordResult.error.issues[0]?.message);
        next();
    }
};
