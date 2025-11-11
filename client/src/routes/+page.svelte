<script lang="ts">
    import { APIFetch } from "$lib/request.lib";
    import { onMount } from "svelte";

    onMount(async () => {
        const { res, payload } = await APIFetch("/api/v1/auth/check-session", {
            method: "GET",
        });
        console.log("Login page session check:", payload);
        
        if(!payload.success) {
            const errors = payload.errors as Record<string, unknown>;
            window.location.href = errors!.redirect as string;
            return;
        }      
        const data = payload.data as Record<string, unknown>;
        window.location.href = data!.redirect as string;
    });
</script>

<h1>Loading...</h1>