import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import AppResponse from "../lib/response.lib.js";
import OperatorService from "../service/operator.service.js";
import OperatorCreatorService from "../service/operatorCreator.service.js";

/**
 * Wrapper controller for operator-related operations
 *
 * @export
 * @class OperatorController
 */
export default class OperatorController {
    /**
     * Fetches an operator by their UUID
     *
     * @static
     * @memberof OperatorController
     */
    static GetOperatorById = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const operator = await OperatorService.GetOperatorById(String(id));
        if(!operator) return next(AppResponse.NotFound("❌ Operator not found"));

        const response = AppResponse.OK("✅ Operator retrieved successfully", { operator: operator });
        res.status(response.statusCode).json(response);
    });

    /**
     * Fetches an operator by their operator code
     *
     * @static
     * @memberof OperatorController
     */
    static GetOperatorByCode = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { code } = req.params;
        const operator = await OperatorService.GetOperatorByCode(String(code));
        if(!operator) return next(AppResponse.NotFound("❌ Operator not found"));

        const response = AppResponse.OK("✅ Operator retrieved successfully", { operator: operator });
        res.status(response.statusCode).json(response);
    });

    /**
     * Fetches all operators
     *
     * @static
     * @memberof OperatorController
     */
    static GetAllOperators = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const operators = await OperatorService.GetAllOperators();
        if(!operators || operators.length === 0) return next(AppResponse.NotFound("❌ No operators found"));

        const response = AppResponse.OK("✅ Operators retrieved successfully", { operators: operators });
        res.status(response.statusCode).json(response);
    });

    /**
     * Atomic creation of a new operator along with their associated person record
     *
     * @static
     * @memberof OperatorController
     */
    static CreateOperator = expressAsyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { operator, person } = req.body!.data;
        if(!operator) return next(AppResponse.BadRequest("❌ Operator data is required"));
        if(!person) return next(AppResponse.BadRequest("❌ Person data is required"));
        
        const newOperator = await OperatorCreatorService.Create(person, operator);
        if(!newOperator) return next(AppResponse.InternalServerError("❌ Failed to create operator and person records"));

        const response = AppResponse.Created("✅ Operator created successfully", { operator: newOperator });
        res.status(response.statusCode).json(response);
    });
};
