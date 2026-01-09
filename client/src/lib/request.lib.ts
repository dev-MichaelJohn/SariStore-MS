import type { Cookies } from "@sveltejs/kit";

export const ForwardSetCookie = (setCookieHeader: string | null, cookies: Cookies) => {
    if(!setCookieHeader) return;

    const cookieMatch = setCookieHeader.match(/^([^=]+)=([^;]+)/)
    if(!cookieMatch) return;

    const [, name, rawValue] = cookieMatch;
    const value = decodeURIComponent(rawValue);
    const options: Record<string, unknown> & { path: string } = {
        path: '/',
        httpOnly: true,
        sameSite: 'lax' as const,
    };

    if(setCookieHeader.includes("Secure")) options.secure = true;
    if(setCookieHeader.includes("Expires=")) {
        const maxAge = String(setCookieHeader.match(/Expires=([^;]+)/)?.[1]);
        const expiryDate = new Date(maxAge);
        if(!isNaN(expiryDate.getTime())) options.expires = expiryDate;
    }

    cookies.set(name, value, options);
};

const API_URL = "http://localhost:3030";
type APIFecthOptions = RequestInit & {
    cookies?: { name: string; value: string }[];
}

export const APIFetch = async(endpoint: string, options: APIFecthOptions = {}):
Promise<{ res: Response, payload: Record<string, unknown> }> => {
    const { cookies, ...fetchOptions } = options;

    const headers = new Headers({
        "Content-Type": "application/json",
        ...(fetchOptions.headers || {})
    });

    if(cookies && cookies.length > 0) headers.set('cookie', cookies.map(c => `${c.name}=${c.value}`).join('; '));

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        credentials: "include",
        headers
    });

    const payload = await res.json();

    return { res, payload }
};
