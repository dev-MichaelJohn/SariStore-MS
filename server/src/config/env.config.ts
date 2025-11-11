import { config } from "dotenv";

const NodeEnv = process.env.NODE_ENV;
config({ path: `.env.${NodeEnv}` });

interface envConfig {
    Port: number,
    Host: string,
    NodeEnv: string | undefined,
    SessionSecret: string | undefined,
    DatabaseUrl: string | undefined
};

const EnvConfig: envConfig = {
    Port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    Host: process.env.HOST || "localhost",
    NodeEnv: process.env.NODE_ENV,
    SessionSecret: process.env.SESSION_SECRET,
    DatabaseUrl: process.env.DATABASE_URL
};

export default EnvConfig;