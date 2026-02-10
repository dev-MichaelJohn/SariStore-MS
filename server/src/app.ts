import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import EnvConfig from "./config/env.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";

import AppResponse from "./lib/response.lib.js";

const App = express();

/*
 * 🧩 Middlewares Setup
 */
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(cookieParser());
App.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const ServerLogger = (req: Request, res: Response, next: NextFunction) => {
    const tz = new Date().toLocaleTimeString('en-PH');
    console.log(`\x1b[36m[${tz}]\x1b[0m \x1b[32m${req.method}\x1b[0m ${req.url}`);
    next();
};

App.use(ServerLogger);
/*
 * 🧩 Middlewares Setup
 */

/*
 * 🪪 Session-based Authentication Setup
 */
const PgSession = connectPgSimple(session);
const pgSessionStore = new PgSession({
    conString: EnvConfig.DatabaseUrl,
    tableName: "sessions",
    createTableIfMissing: true
});

App.use(session({
    name: "sari.sid",
    secret: EnvConfig.SessionSecret as string,
    resave: false,
    saveUninitialized: false,
    store: pgSessionStore,
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "lax",
        secure: EnvConfig.NodeEnv === "production"
   }
}));

App.use(passport.initialize());
App.use(passport.session());
import "./config/passport.config.js";
/*
 * 🪪 Session-based Authentication Setup
 */

/*
 * 🛣️ Routers Setup
 */
import v1Router from "./routers/index.router.js";
//import { SeedOperator } from "./db/seed.db.js";
//import { SeedProductCategories } from "./db/seed.db.js";

App.get("/", (req, res) => {
    // To test Product Category Seeding
    //SeedProductCategories();

    // To test Operator Seeding
    //SeedOperator({
    //    personId: "",
    //    password: "Admin@123",
    //}, {
    //  firstName: "System",
    //    lastName: "Admin",
    //    birthdate: new Date("1990-01-01"),
    //});

    // To test the global error handler
    //throw Error("Basta error");
    //console.log(req.cookies)
    res.json(AppResponse.OK("Yeah, it's good!!"));
})
App.use("/api/v1", v1Router);
/*
 * 🛣️ Routers Setup
 */

/*
 * ⚠️ Error Handling Middleware
 */
import ErrorMiddleware from "./middlewares/error.middleware.js";
App.use(ErrorMiddleware);
/*
 * ⚠️ Error Handling Middleware
 */
export default App;
