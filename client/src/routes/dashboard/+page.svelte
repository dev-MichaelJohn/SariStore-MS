<script lang="ts">
	import { APIFetch } from "$lib/request.lib";

    const handleLogout = async () => {
        const { res, payload } = await APIFetch("/api/v1/auth/logout", {
            method: "POST"
        });

        if(res.ok && payload.success) {
            const data = payload.data as Record<string, unknown>;
            window.location.href = data!.redirect as string;
        }
    };
</script>

<h1>Dashboard Page</h1>
<button onclick={handleLogout} class="cursor-pointer">Logout</button>