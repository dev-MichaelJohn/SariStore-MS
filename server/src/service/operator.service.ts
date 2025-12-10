import db, { ITransaction } from "../config/db.config.js";
import { eq } from "drizzle-orm";
import { Operator } from "../db/schema.db.js";
import { isObjectEmpty } from "../lib/utils.lib.js";
import AppResponse from "../lib/response.lib.js";

export type IOperatorSelect = typeof Operator.$inferSelect;
export type IOperatorInsert = typeof Operator.$inferInsert;

/**
 * Wrapper service for Operator-model related database operations
 *
 * @export
 * @class OperatorService
 */
export default class OperatorService {

    /**
     * Fetches an operator by their operator code
     *
     * @static
     * @param {string} operatorCode
     * @return {*}  {(Promise<Partial<IOperatorSelect> | null>)}
     * @memberof OperatorService
     */
    static async GetOperatorByCode(operatorCode: string): Promise<Partial<IOperatorSelect> | null> {
        if(!operatorCode || operatorCode.trim().length === 0) return null;
        const [ operator ] = await db.select()
            .from(Operator)
            .where(eq(Operator.code, operatorCode))
            .limit(1);
        if(!operator) return null;
        return operator;
    }

    /**
     * Fetches an operator by their UUID
     *
     * @static
     * @param {string} id
     * @return {*}  {(Promise<Partial<IOperatorSelect> | null>)}
     * @memberof OperatorService
     */
    static async GetOperatorById(id: string): Promise<Partial<IOperatorSelect> | null> {
        if(!id || id.trim().length === 0) return null;
        const [ operator ] = await db.select()
            .from(Operator)
            .where(eq(Operator.id, id))
            .limit(1);
        if(!operator) return null;
        return operator;
    }

    /**
     * Fetches all operators
     *
     * @static
     * @return {*}  {Promise<IOperatorSelect[] | null>}
     * @memberof OperatorService
     */
    static async GetAllOperators(): Promise<Partial<IOperatorSelect>[] | null> {
        const operators = await db.select()
            .from(Operator);
        if(!operators) return null;
        
        const operatorsFiltered = operators.filter((operator) => !operator.deletedAt);
        return (operatorsFiltered.length === 0) ? null : operatorsFiltered;
    }
    
    /**
     * Creates a new operator (not recommended) 
     *
     * @deprecated
     * @static
     * @param {IOperatorInsert} data
     * @return {*}  {Promise<Partial<IOperatorSelect> | null>}
     * @member OperatorService
     */
    static async CreateOperator(data: IOperatorInsert): Promise<Partial<IOperatorSelect> | null> {
        const [ operator ] = await db.insert(Operator)
            .values(data)
            .returning()
        if(!operator) return null;
        return operator;
    };

    /**
     * Atomic creation of a new operator
     *
     * @static
     * @param {IOperatorInsert} data
     * @param {ITransaction} tx
     * @return {*}  {Promise<Partial<IOperatorSelect> | null>}
     * @memberof OperatorService
     */
    static async CreateOperatorViaTransaction(data: IOperatorInsert, tx: ITransaction): Promise<Partial<IOperatorSelect> | null> {
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;
        
        const [ operator ] = await tx.insert(Operator)
            .values(data)
            .returning()
        if(!operator) throw AppResponse.InternalServerError("❌ Failed to create operator record");
        return operator;
    };

    /**
     * Atomic updating of an existing operator
     *
     * @static
     * @param {Partial<IOperatorInsert>} data
     * @param {ITransaction} tx
     * @return {*}  {Promise<Partial<IOperatorSelect> | null>}
     * @memberof OperatorService
     */
    static async UpdateOperatorViaTransaction(data: Partial<IOperatorInsert>, tx: ITransaction): Promise<Partial<IOperatorSelect> | null> {
        if(!data || isObjectEmpty(data)) return null;
        if(!tx) return null;
        
        let operator = await OperatorService.GetOperatorById(data?.id as string);
        if(!operator) return null;
        if(operator.deletedAt) throw AppResponse.BadRequest("❌ Operator doesn't exist");

        operator = { ...operator, ...data };
        const [ updatedOperator ] = await tx.update(Operator)
            .set(operator)
            .where(eq(Operator.id, operator?.id as string))
            .returning()
        if(!updatedOperator) throw AppResponse.InternalServerError("❌ Failed to update operator record");
        return updatedOperator;
    };

    /**
     * Atomic deletion of an existing operator
     *
     * @static
     * @param {string} id 
     * @param {ITransaction} tx
     * @return {*}  {Promise<void | null>}
     * @memberof OperatorService
     */
    static async DeleteOperatorViaTransaction(id: string, tx: ITransaction): Promise<void | null> {
        if(!id || id.trim().length < 0) return null;
        if(!tx) return null;
        
        const operator = await OperatorService.GetOperatorById(id);
        if(!operator) return null;
        if(operator.deletedAt) throw AppResponse.BadRequest("❌ Operator doesn't exist");
        
        await tx.update(Operator)
            .set({ deletedAt: new Date() })
            .where(eq(Operator.id, operator.id as string));
    };
};
