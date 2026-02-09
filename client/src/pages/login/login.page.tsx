import { useEffect } from "react";
import { CheckSession } from "@lib/request.lib";
import { Toaster } from "react-hot-toast";
import LoginBox from "./components/loginBox";
import LoginSide from "./components/loginSide";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const verify = async() => {
            const result = await CheckSession();
            if(result.success) navigate("/dashboard");
        };

        verify();
    }, [navigate]);

    return (
        <div className="flex h-dvh w-full flex-wrap">
            <Toaster position="top-center" />
            <LoginBox />
            <LoginSide />
        </div>
    )
};

export default LoginPage;
