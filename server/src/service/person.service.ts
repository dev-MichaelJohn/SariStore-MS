import db, { ITransaction } from "../config/db.config.js";
import { eq } from "drizzle-orm";
import { Person } from "../db/schema.db.js";

export type IPersonSelect = typeof Person.$inferSelect;
export type IPersonInsert = typeof Person.$inferInsert;

/**
 * Wrapper service for Person-model related database operations
 *
 * @export
 * @class PersonService
 */
export default class PersonService {
    /**
     * Fetches a person by their UUID
     *
     * @static
     * @param {string} id
     * @return {*}  {(Promise<IPersonSelect | null>)}
     * @memberof PersonService
     */
    static async GetPersonById(id: string): Promise<IPersonSelect | null> {
        if(id.trim() === "" || id.length === 0) return null;
        const [ person ] = await db.select().from(Person).where(eq(Person.id, id)).limit(1);
        if(!person) return null;
        return person;
    }

    /**
     * Fetches all persons
     *
     * @static
     * @return {*}  {Promise<IPersonSelect[]>}
     * @memberof PersonService
     */
    static async GetAllPersons(): Promise<IPersonSelect[]> {
        const persons = await db.select().from(Person);
        return persons;
    }

    /**
     * Creates a new person record
     *
     * @static
     * @param {IPersonInsert} data
     * @return {*}  {Promise<IPersonSelect>}
     * @memberof PersonService
     */
    static async CreatePerson(data: IPersonInsert): Promise<IPersonSelect> {
        const [ person ] = await db.insert(Person).values(data).returning();
        return person!;
    }

    /**
     * Atomic creation of a new person record within an existing transaction
     *
     * @static
     * @param {IPersonInsert} data
     * @param {ITransaction} tx
     * @return {*}  {Promise<IPersonSelect>}
     * @memberof PersonService
     */
    static async CreatePersonViaTransaction(data: IPersonInsert, tx: ITransaction): Promise<IPersonSelect> {
        const [ person ] = await tx.insert(Person).values(data).returning();
        return person!;
    }

    /**
     * Atomic updating of an existing person record 
     *
     * @static
     * @param {Patial<IPersonInsert>} data
     * @param {ITransaction} tx
     * @return {*}  {Promise<IPersonSelect | null>}
     * @memberof PersonService
     */
    static async UpdatePersonViaTranaction(data: Partial<IPersonInsert>, tx: ITransaction): Promise<IPersonSelect | null> {
        let person = await PersonService.GetPersonById(data?.id as string);
        if(!person || person === null) return null;

        person = { ...person, ...data };
        const newPerson = await tx.update(Person)
            .set(person)
            .where(eq(Person.id, person?.id as string));
        if(!newPerson) return null;
        return newPerson;
    }

    /**
     * Atomic deletion of an existing person record 
     *
     * @static
     * @param {string} id 
     * @param {ITransaction} tx
     * @return {*}  {Promise<IPersonSelect | null>}
     * @memberof PersonService
     */
    static async DeletePersonViaTransaction(id: string, tx: ITransaction): Promise<void | null> {
        const person = await PersonService.GetPersonById(id);
        if(!person || person === null) return null;

        await tx.delete(Person)
            .where(eq(Person.id, person?.id as string)); 
    }
};
