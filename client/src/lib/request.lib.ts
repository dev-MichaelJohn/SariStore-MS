import axios from "axios";
import type { AppResponse } from "../types/AppResponse";
import { redirect } from "react-router-dom";
import toast from "react-hot-toast";

export const SERVER_API_URL = "http://localhost:5000/api";

export const CheckSession = async() => {
    try {
        await axios.get(`${SERVER_API_URL}/v1/auth/check-session`);
    } catch(error) {
        if(axios.isAxiosError(error)) {
            const payload: AppResponse = error.response?.data
            const finalMessage = payload?.message 
                || error.response?.statusText 
                || "Something went wrong. Please try again!";

            toast.error(finalMessage);

            const currentPage = window.location.pathname;
            const redirectPage = payload.errors!.redirect as string || "/login"
            
            if(currentPage !== redirectPage) redirect(redirectPage);
        } else {
            toast.error("An unexpected error occured.");
            redirect("/login");
        }

    }
};
