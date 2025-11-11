<script lang="ts">
    import toggleLeft from "$lib/assets/toggle-left.svg";
    import toggleRight from "$lib/assets/toggle-right.svg";
    import sun from "$lib/assets/sun.svg";
    import sunDark from "$lib/assets/sun-dark.svg";
    import moon from "$lib/assets/moon.svg";
    import moonDark from "$lib/assets/moon-dark.svg";

    let { darkMode, toggleDarkMode } = $props();

    const sunIcon = $derived(darkMode ? sunDark : sun);
    const moonIcon = $derived(darkMode ? moonDark: moon);
    const switchIcon = $derived(darkMode ? toggleRight : toggleLeft);
</script>

<div class="flex justify-evenly items-center gap-3.5">
    <span>
        <img src={sunIcon} alt="Light Mode" class="h-5"/>
    </span>
    <button type="button" class="cursor-pointer" onclick={toggleDarkMode}>
        <img src={switchIcon} alt="Toggle Dark Mode"/>
    </button>
    <span>
        <img src={moonIcon} alt="Dark Mode" class="h-5"/>
    </span>
</div>