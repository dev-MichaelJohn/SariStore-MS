import passport from "passport";
import { IStrategyOptions, Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import OperatorService, { IOperatorSelect } from "../service/operator.service.js";
import { ComparePassword } from "../lib/operator.lib.js";

type DoneFunction = {
    (error: unknown, user?: Express.User | false, options?: { message: string }): void;
}

const StrategyOpts: IStrategyOptions = {
    usernameField: "operatorCode",
    passwordField: "password",
};

const MainStrategy: VerifyFunction = async(operatorCode: string, password: string, done: DoneFunction) => {
    try {
        const operator = await OperatorService.GetOperatorByCode(operatorCode);
        if(!operator) return done(null, false, { message: "Operator not found" });

        if(!ComparePassword(password, operator!.password)) return done(null, false, { message: "Invalid password" });

        return done(null, operator);
    } catch(error) {
        return done(error);
    }
};

const SessionStrategy = new LocalStrategy(StrategyOpts, MainStrategy);
passport.use(SessionStrategy);

passport.serializeUser((user: Express.User, done: DoneFunction) => {
    done(null, (user as IOperatorSelect).id);
});

passport.deserializeUser(async(id: string, done: DoneFunction) => {
    try {
        const operator = await OperatorService.GetOperatorById(id);
        if(!operator) return done(null, false, { message: "Operator not found" });
        return done(null, operator);
    } catch(error) {
        done(error);
    }
});