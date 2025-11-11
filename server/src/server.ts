import App from "./app";
import EnvConfig from "./config/env.config";

App.listen(EnvConfig.Port, () => {
    console.log(`Server running at http://${EnvConfig.Host}:${EnvConfig.Port}/ in ${EnvConfig.NodeEnv} mode`);
});