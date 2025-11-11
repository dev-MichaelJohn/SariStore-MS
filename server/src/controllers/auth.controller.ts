import { NextFunction, Request, Response } from "express";
import AppResponse from "../lib/response.lib.js";
import passport from "passport";

/**
 * Wrapper controller for authentication-related operations
 *
 * @export
 * @class AuthController
 */
export default class AuthController {
    /**
     * Handles user login requests
     *
     * @static
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @memberof AuthController
     */
    static Login(req: Request, res: Response, next: NextFunction) {
        if(req.isAuthenticated()) {
            const response = AppResponse.OK("✅ User already logged in", { operator: req.user });
            return res.status(response.statusCode).json(response);
        }

        passport.authenticate("local", (err: unknown, user: Express.User) => {
            if(err) {
                const response = AppResponse.InternalServerError("❌ An error occurred during authentication", err);
                return res.status(response.statusCode).json(response);
            }

            if(!user) {
                const response = AppResponse.NotFound("❌ Given credentials doesn't exist", err);
                return res.status(response.statusCode).json(response);
            }
            req.logIn(user, (loginErr) => {
                if(loginErr) {
                    const response = AppResponse.InternalServerError("❌ An error occurred during login", loginErr);
                    return res.status(response.statusCode).json(response);
                }
                const response = AppResponse.OK("✅ Login successful", { operator: user, redirect: "/home" });
                res.status(response.statusCode).json(response);
            });
        })(req, res, next);
    }

    /**
     * Handles user logout requests
     *
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof AuthController
     */
    static Logout(req: Request, res: Response) {
        req.logout((err) => {
            if(err) {
                const response = AppResponse.InternalServerError("❌ An error occurred during logout", err);
                return res.status(response.statusCode).json(response);
            }

            req.session.destroy((err) => {
                if(err) {
                    const response = AppResponse.InternalServerError("❌ An error occurred during logout", err);
                    return res.status(response.statusCode).json(response);
                }

                res.clearCookie("sari.sid");
                const response = AppResponse.OK("✅ Logout successful", { redirect: "/login" });
                res.status(response.statusCode).json(response);
            });
        });
    }

    static CheckSession(req: Request, res: Response) {
        if(!req.isAuthenticated()) { 
            const response = AppResponse.Unauthorized("❌ Session expired", { redirect: "/login" });
            return res.status(response.statusCode).json(response);
        }
        
        const response = AppResponse.OK("✅ Session valid!", { user: req.user, redirect: "/dashboard" });
        res.status(response.statusCode).json(response);
    }
};