import db from "../config/db.config.js";
import { IOperatorInsert } from "./operator.service.js";
import { IPersonInsert } from "./person.service.js";

import OperatorService from "./operator.service.js";
import PersonService from "./person.service.js";
import AppResponse from "../lib/response.lib.js";

/**
 * Wrapper service for creating an operator along with their associated person record
 *
 * @export
 * @class OperatorCreatorService
 */
export default class OperatorCreatorService {
    /**
     * Creates a new operator along with their associated person record atomically
     *
     * @static
     * @param {IPersonInsert} person
     * @param {IOperatorInsert} operator
     * @return {*}  {(Promise<IOperatorSelect | null>)}
     * @memberof OperatorCreatorService
     */
    static async Create(person: IPersonInsert, operator: IOperatorInsert) {
        return await db.transaction(async(tx) => {
            const personRecord = await PersonService.CreatePersonViaTransaction(person, tx);
            if(!personRecord) throw (AppResponse.InternalServerError("❌ Failed to create person record"));
             
            const operatorData = { ...operator, personId: personRecord.id };
            const newOperator = await OperatorService.CreateOperatorViaTransaction(operatorData, tx);
            if(!newOperator) throw (AppResponse.InternalServerError("❌ Failed to create operator record"));
            return newOperator;
        });
    }
};
