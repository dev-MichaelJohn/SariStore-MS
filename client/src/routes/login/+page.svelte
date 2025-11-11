<script lang="ts">
    import LoginCard from "$lib/components/LoginCard.svelte";
    import { APIFetch } from "$lib/request.lib";
    import { onMount } from "svelte";

    let loginInfo: {
        operatorCode: string,
        password: string
    } = $state({
        operatorCode: "",
        password: ""
    });
    const setValue = (variable: "operatorCode" | "password", value: string) => {
        loginInfo[variable] = value;
    }

    let darkMode = $state(false);
    const toggleDarkMode = () => darkMode = !darkMode;

    let isAuthenticated = $state(true);
    onMount(async () => {
        const { res, payload } = await APIFetch("/api/v1/auth/check-session", {
            method: "GET",
        });
        
        if(payload.success) {
            const data = payload.data as Record<string, unknown>;
            window.location.href = data!.redirect as string;
            return;
        }

        isAuthenticated = false;
    });
</script>

{#if !isAuthenticated}
<div class="{darkMode && "dark" } h-dvh w-dvw bg-(--bg-dark) flex items-center justify-center">
    <LoginCard {loginInfo} {setValue} {darkMode} {toggleDarkMode} />
</div>
{/if}
