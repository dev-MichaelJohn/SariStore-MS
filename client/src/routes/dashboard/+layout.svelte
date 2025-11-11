<script lang="ts">
    import { APIFetch } from "$lib/request.lib";
    import { onMount } from "svelte";

    let isAuthenticated = $state(false);

    onMount(async () => {
        const { res, payload } = await APIFetch("/api/v1/auth/check-session", {
            method: "GET",
        });
        isAuthenticated = payload.success as boolean;

        if(!isAuthenticated) {
            const errors = payload.errors as Record<string, unknown>;
            window.location.href = errors!.redirect as string;
        }
    });

    let { children } = $props();
</script>

{#if isAuthenticated}
    {@render children?.()}
{/if}