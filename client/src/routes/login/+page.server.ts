import { APIFetch, ForwardSetCookie } from "$lib/request.lib";
import type { Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";

export const actions: Actions = {
    login: async({ request, cookies }) => {
        const formData = await request.formData();
        const loginData = {
            operatorCode: formData.get("operatorCode"),
            password: formData.get("password")
        };

        const { res, payload } = await APIFetch("/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify({...loginData})
        });

        if(!payload.success) {
            return fail(payload.statusCode as number, {
                message: payload.message,
                errors: payload.errors
            });
        }

        ForwardSetCookie(res.headers.get("set-cookie"), cookies);
        throw redirect(302, "/dashboard");
    }
}