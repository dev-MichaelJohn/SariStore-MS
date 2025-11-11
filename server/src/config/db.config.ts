import EnvConfig from "./env.config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema.db";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { ExtractTablesWithRelations } from "drizzle-orm";

const db = drizzle({
    connection: {
        connectionString: EnvConfig.DatabaseUrl,
    },
    schema
});

export type IDatabase = ReturnType<typeof drizzle>;
export type ITransaction = PgTransaction<PostgresJsQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export default db;