import { useEffect } from "react";
import { CheckSession } from "@lib/request.lib";
import { Toaster } from "react-hot-toast";
import LoginBox from "./components/loginBox";
import LoginSide from "./components/loginSide";

const LoginPage = () => {
    useEffect(() => {
        //CheckSession();
    }, []); 

    return (
        <div className="flex h-dvh w-full bg-red-500 flex-wrap">
            <Toaster position="top-center" />
            <LoginBox />
            <LoginSide />
        </div>
    )
};

export default LoginPage;
