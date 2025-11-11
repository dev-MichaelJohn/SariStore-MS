import db from "../config/db.config.js";
import { IPersonInsert } from "../service/person.service.js";
import { IOperatorInsert } from "../service/operator.service.js";
import AppResponse from "../lib/response.lib.js";
import { HashPassword } from "../lib/operator.lib.js";
import OperatorService from "../service/operator.service.js";
import PersonService from "../service/person.service.js";

/**
 * Seeds an operator along with an associated person record within a transaction (to be used in tests and initial setup)
 * 
 * @export
 * @param {IOperatorInsert} operator
 * @param {IPersonInsert} person
 * @return {*}  {Promise<IOperatorInsert>}
 */
export const SeedOperator = async(operator: IOperatorInsert, person: IPersonInsert): Promise<IOperatorInsert> => {
    let newOperator: IOperatorInsert;
    await db.transaction(async(tx) => {
        const personRecord = await PersonService.CreatePersonViaTransaction(person, tx);
        if(!personRecord) throw (AppResponse.InternalServerError("❌ Failed to create person record"));

        operator.password = await HashPassword(operator.password);
        const operatorData = { ...operator, personId: personRecord.id };
        const insertedOperator = await OperatorService.CreateOperatorViaTransaction(operatorData, tx);
        newOperator = insertedOperator!;
        if(!newOperator) throw (AppResponse.InternalServerError("❌ Failed to create operator record"));
    });

    return newOperator!;
};