import { Request, Response, NextFunction } from "express";
import AppResponse from "../lib/response.lib.js";

/**
 * Catches errors thrown in the request processing pipeline and formats them into standardized HTTP responses
 *
 * @export
 * @param {unknown} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export default function ErrorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
    if(err instanceof AppResponse) return res.status(err.statusCode).json(err);

    if(err instanceof Error) {
        const response = AppResponse.InternalServerError(`❌ ${err.message}`, { message: err.message, stack: err.stack });
        return res.status(response.statusCode).json(response);
    }

    const response = AppResponse.InternalServerError("❌ An unknown error occurred", { err });
    return res.status(response.statusCode).json(response);
};
