import EnvConfig from "./src/config/env.config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.db.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: EnvConfig.DatabaseUrl || "",
    },
    verbose: true,
    strict: true,
});