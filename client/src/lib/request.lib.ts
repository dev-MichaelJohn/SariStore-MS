import axios, { AxiosError } from "axios";
import type { AppResponse } from "../types/AppResponse";
import { redirect } from "react-router-dom";

export const SERVER_API_URL = "http://localhost:500/api/";

export const CheckSession = async() => {
    try {
        await axios.get(`${SERVER_API_URL}v1/auth/check-session`);
    } catch(error) {
        if(error instanceof AxiosError) {
            const payload: AppResponse = error.response?.data
            if(!payload) {
                alert("❌ Server is offline!!");
                return;
            }

            const currentPage = window.location.pathname;
            const redirectPage = payload.errors!.redirect as string;
            
            if(currentPage !== redirectPage) redirect(redirectPage);
            return;
        }

        alert(`Unknown error: ${error}`);
    }
};
