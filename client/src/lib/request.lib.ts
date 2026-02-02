import axios from "axios";
import type { AppResponse } from "../types/AppResponse";
import toast from "react-hot-toast";

export const SERVER_API_URL = "http://localhost:5000/api";

export const CheckSession = async () => {
    try {
        await axios.get(`${SERVER_API_URL}/v1/auth/check-session`);
        return { success: true };
    } catch (error) {
        let message = "An unexpected error occurred.";
        let redirectTo = "/login";

        if (axios.isAxiosError(error)) {
            const payload: AppResponse = error.response?.data;
            message = payload?.message || error.response?.statusText || message;
            // Accessing redirect from your specific AppResponse structure
            redirectTo = payload?.errors?.redirect as string || "/login";
        }

        toast.error(message);
        return { success: false, redirectTo };
    }
};
