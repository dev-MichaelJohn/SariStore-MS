import { type ChangeEvent, type SubmitEvent, useState } from "react";
import { type AppResponse } from "../../../types/AppResponse";
import toast from "react-hot-toast";
import eyeOff from "../../../assets/svg/eye-off.svg";
import eyeOn from "../../../assets/svg/eye.svg";
import axios, { AxiosError } from "axios";

type LoginCredentials = {
    operatorCode: string,
    password: string
};

const LoginSide = () => {
    const [revealPassword, setRevealPassword] = useState(false);

    const [loginData, setLoginData] = useState<LoginCredentials>({
        operatorCode: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setLoginData((prev) => ({...prev, [name]: value}));
    };

    const handleLoginSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
         try {
            const response = axios.post("http://localhost:5000/api/v1/auth/login", { ...loginData });
         } catch(error) {
            if(error instanceof AxiosError) {
                const payload: AppResponse = error.response?.data;
                if(!payload) toast.error("Undefined Error!");
                toast.error(payload?.errors);
            }
         }
    };

    const handleRevealPassword = () => {
        setRevealPassword((prev) => !prev);
    }

    return (
        <div className="relative flex flex-col flex-1 items-center justify-center h-dvh bg-(--bg)">
            
            <div className="absolute top-8 right-10">
                <span className="text-2xl text-shadow-lg font-black tracking-tighter text-(--text)">
                    SariStore<span className="text-(--primary)">MS</span>
                </span>
            </div>

            <form className="flex flex-col self-center justify-around items-start h-1/2 w-1/2 p-10" onSubmit={handleLoginSubmit}> 
                <h1 className="text-4xl text-(--text) font-extrabold">
                    Your Partner in Every Sale, Your Tool for Every Asenso.
                </h1>
                <p className="text-(--text-muted) font-light">
                    The simplest way to manage your Sari-sari Store. Built for the modern Filipino entrepreneur
                </p>
                
                <div className="flex flex-col justify-evenly h-1/2 w-full">
                    <div className="flex items-center shadow-sm rounded-2xl p-5 h-1/4 w-full bg-(--bg-dark)">
                        <input type="text" name="operatorCode" value={loginData.operatorCode} placeholder="Operator Code" className="w-full outline-0" 
                            onChange={handleChange} />
                    </div> 
                    <div className="flex justify-between items-center shadow-sm rounded-2xl p-5 h-1/4 w-full bg-(--bg-dark)">
                        <input type={(revealPassword) ? "text" : "password"} name="password" value={loginData.password} placeholder="Password" className="w-full outline-0" 
                            onChange={handleChange} />
                        <button type="button" className="bg-green" onClick={handleRevealPassword}>
                            <img alt="eye icon" src={(revealPassword) ? eyeOff : eyeOn} />
                        </button>
                    </div> 
                </div>

                <div className="flex h-1/7 w-full justify-between items-center">
                    <button type="submit" className="py-3.5 px-10 rounded-2xl bg-(--primary) hover:bg-(--secondary) active:bg-(--success) text-(--highlight) text-shadow-lg font-bold shadow-sm cursor-pointer transition-all">
                        Login
                    </button>
                    <a href="#" className="text-(--secondary) hover:text-(--primary) font-semibold underline underline-offset-4">
                        Forgot password?
                    </a>
                </div>
            </form>
        </div>
    )
};

export default LoginSide;
