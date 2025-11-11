import db, { ITransaction } from "../config/db.config.js";
import { eq } from "drizzle-orm";
import { Operator } from "../db/schema.db.js";

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
     * Default manageable fields for an operator
     *
     * @private
     * @memberof OperatorService
     */
    private static defaultManageableFields = {
        id: Operator.id,
        code: Operator.code,
        personId: Operator.personId,
        createdAt: Operator.createdAt,
        updatedAt: Operator.updatedAt
    };

    /**
     * Fetches an operator by their operator code
     *
     * @static
     * @param {string} operatorCode
     * @return {*}  {(Promise<IOperatorSelect | null>)}
     * @memberof OperatorService
     */
    static async GetOperatorByCode(operatorCode: string): Promise<Partial<IOperatorSelect> | null> {
        if(operatorCode.trim() === "" || operatorCode.length === 0) return null;
        const [ operator ] = await db.select(OperatorService.defaultManageableFields)
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
     * @return {*}  {(Promise<IOperatorSelect | null>)}
     * @memberof OperatorService
     */
    static async GetOperatorById(id: string): Promise<Partial<IOperatorSelect> | null> {
        if(id.trim() === "" || id.length === 0) return null;
        const [ operator ] = await db.select(OperatorService.defaultManageableFields)
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
     * @return {*}  {Promise<IOperatorSelect[]>}
     * @memberof OperatorService
     */
    static async GetAllOperators(): Promise<Partial<IOperatorSelect>[]> {
        const operators = await db.select(OperatorService.defaultManageableFields)
            .from(Operator);
        return operators;
    }
    
    /**
     * Creates a new operator (not recommended) 
     *
     * @deprecated
     * @static
     * @param {IOperatorInsert} data
     * @return {*}  {Promise<IOperatorSelect>}
     * @member OperatorService
     */
    static async CreateOperator(data: IOperatorInsert): Promise<Partial<IOperatorSelect> | null> {
        const [ operator ] = await db.insert(Operator)
            .values(data)
            .returning(OperatorService.defaultManageableFields);
        if(!operator) return null;
        return operator;
    };

    /**
     * Atomic creation of a new operator
     *
     * @static
     * @param {IOperatorInsert} data
     * @param {ITransaction} tx
     * @return {*}  {Promise<IOperatorSelect>}
     * @memberof OperatorService
     */
    static async CreateOperatorViaTransaction(data: IOperatorInsert, tx: ITransaction): Promise<Partial<IOperatorSelect> | null> {
        const [ operator ] = await tx.insert(Operator)
            .values(data)
            .returning(OperatorService.defaultManageableFields);
        if(!operator) return null;
        return operator!;
    };

    /**
     * Atomic updating of an existing operator
     *
     * @static
     * @param {Partial<IOperatorInsert>} data
     * @param {ITransaction} tx
     * @return {*}  {Promise<IOperatorSelect>}
     * @memberof OperatorService
     */
    static async UpdateOperatorViaTransaction(data: Partial<IOperatorInsert>, tx: ITransaction): Promise<Partial<IOperatorSelect> | null> {
        let operator = await OperatorService.GetOperatorById(data?.id as string);
        if(!operator || operator === null) return null;

        operator = { ...operator, ...data };
        const updatedOperator = await tx.update(Operator)
            .set(operator)
            .where(eq(Operator.id, operator?.id as string))
        if(!updatedOperator) return null;
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
        const operator = await OperatorService.GetOperatorById(id);
        if(!operator || operator === null) return null;
        
        await tx.delete(Operator)
            .where(eq(Operator.id, operator?.id as string));
    };
};
