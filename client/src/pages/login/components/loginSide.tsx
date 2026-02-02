import { type ChangeEvent, type SubmitEvent, useState, useEffect } from "react";
import { type AppResponse } from "../../../types/AppResponse";
import toast from "react-hot-toast";
import eyeOff from "../../../assets/svg/eye-off.svg";
import eyeOn from "../../../assets/svg/eye.svg";
import axios from "axios";
import { redirect } from "react-router-dom";
import { SERVER_API_URL } from "@lib/request.lib";

type LoginCredentials = {
    operatorCode: string,
    password: string
};

const regionalMessages = [
    {
        language: "Tagalog",
        hero: "Katuwang mo sa benta, kaagapay mo sa asenso.",
        sub: "Simple at madaling gamitin para sa iyong sari-sari store. Disenyong Pinoy para sa mga modernong tindahan."
    },
    {
        language: "Cebuano",
        hero: "Kauban nimo sa benta, kaagapay nimo sa asenso.",
        sub: "Simple ug sayon gamiton para sa imong sari-sari store. Disenyong Pinoy para sa mga modernong tindahan."
    },
    {
        language: "Ilocano",
        hero: "Kadduam iti lako, katulungam iti asenso.",
        sub: "Laka ken nalitnget nga usaren para iti sari-sari store-mo. Disenyo a Pinoy para iti moderno a sabsabali a tindahan."
    },
    {
        language: "Hiligaynon",
        hero: "Kaupod mo sa benta, kaagapay mo sa asenso.",
        sub: "Simple kag mahapos gamiton para sa imo sari-sari store. Disenyo nga Pinoy para sa mga moderno nga tindahan."
    },
    {
        language: "Bikolano",
        hero: "Kaiba mo sa benta, kaagapay mo sa asenso.",
        sub: "Simple asin madaling gamiton para sa saimong sari-sari store. Disenyong Pinoy para sa mga modernong tindahan."
    },
    {
        language: "Waray-Waray",
        hero: "Kabulig mo ha benta, kaagapay mo ha asenso.",
        sub: "Simple ngan masayod gamiton para han imo sari-sari store. Disenyo nga Pinoy para ha mga moderno nga tindahan."
    },
    {
        language: "Kapampangan",
        hero: "Kayabe mu king benta, saup mu king panyulung.",
        sub: "Simple at madaling gamitan para king kekang sari-sari store. Disenyong Pinoy para karing modernong tindahan."
    },
    {
        language: "Pangasinan",
        hero: "Kadduam ed benta, kaagapay mo ed asenso.",
        sub: "Mainomay ya usaren para ed sari-sari store mo. Disenyong Pinoy para ed saray modernong tindahan."
    }
];

const LoginSide = () => {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const [revealPassword, setRevealPassword] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);

    const [loginData, setLoginData] = useState<LoginCredentials>({
        operatorCode: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setLoginData((prev) => ({...prev, [name]: value}));
    };

    const handleLoginSubmit = async(e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setOnSubmit((prev) => !prev);
            const response = await axios.post(`${SERVER_API_URL}/v1/auth/login`, { ...loginData });
            const payload: AppResponse = response.data;
    
            redirect(payload.data?.redirect as string);
            setOnSubmit((prev) => !prev);
        } catch(error) {
            if(axios.isAxiosError(error)) {
                const payload: AppResponse = error.response?.data;
                const finalMessage = payload?.message 
                    || error.response?.statusText 
                    || "Something went wrong. Please try again!";

                toast.error(finalMessage);
            } else {
                toast.error("An unexpected error occured.");
            }

            setOnSubmit((prev) => !prev);
        }
    };

    const handleRevealPassword = () => {
        setRevealPassword((prev) => !prev);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setFade(true);
                setIndex((prevIndex) => (prevIndex + 1) % regionalMessages.length);
            }, 1000);
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex flex-col flex-1 items-center justify-center h-dvh bg-(--bg)">
            
            <div className="absolute top-8 right-10">
                <span className="text-2xl text-shadow-lg font-black tracking-tighter text-(--text)">
                    SariStore<span className="text-(--primary)">MS</span>
                </span>
            </div>

            <form className="flex flex-col self-center justify-around items-start h-1/2 w-1/2 p-10" onSubmit={handleLoginSubmit}> 
                <h1 className={`text-4xl text-(--text) font-extrabold transition-opacity duration-500 ease-in-out ${(fade) ? "opacity-100" : "opacity-0"}`}>
                    {regionalMessages[index].hero}
                </h1>
                <p className={`text-(--text) font-light transition-opacity duration-500 ease-in-out ${(fade) ? "opacity-100" : "opacity-0"}`}>
                    {regionalMessages[index].sub}
                </p>
                
                <div className="flex flex-col justify-evenly h-1/2 w-full">
                    <div className="flex items-center shadow-sm rounded-2xl p-5 h-1/4 w-full bg-(--bg-dark)">
                        <input type="text" name="operatorCode" value={loginData.operatorCode} placeholder="Operator Code" className={`w-full outline-0 ${(onSubmit) ? "text-(--text-muted)" : "text-(--text)"}`} disabled={onSubmit}
                            onChange={handleChange} />
                    </div> 
                    <div className="flex justify-between items-center shadow-sm rounded-2xl p-5 h-1/4 w-full bg-(--bg-dark)">
                        <input type={(revealPassword) ? "text" : "password"} name="password" value={loginData.password} placeholder="Password" className={`w-full outline-0 ${(onSubmit) ? "text-(--text-muted)" : "text-(--text)"}`} disabled={onSubmit}
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
