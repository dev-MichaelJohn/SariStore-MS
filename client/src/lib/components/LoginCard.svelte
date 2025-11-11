<script lang="ts">
    import Title from "./Title.svelte";
    import DarkModeToggle from "./DarkModeToggle.svelte";
    import LoginInput from "./LoginInput.svelte";

    let { darkMode, toggleDarkMode, loginInfo, setValue } = $props();
</script>

<div 
class="lg:h-3/4 md:h-3/4 sm:h-2/3 h-3/4 w-3/4 bg-(--bg) shadow-c-lg rounded-2xl flex">
    <div class="lg:w-1/4 md:w-1/4 h-full bg-(--border) shadow-c-sm rounded-l-xl"></div>
    <form 
    class="flex-1 flex flex-col justify-center items-center w-full px-3.5 lg:gap-10 md:gap-10 sm:gap-10 gap-15"
    method="POST"
    action="?/login"
    >
        <Title/>
        <p 
        class="font-light lg:text-xl md:text-xl sm:text-lg text-md text-(--text-muted)">Insert Motto Here!!</p>
        <div class="flex flex-col justify-center items-center w-full gap-7.5">
            <LoginInput {darkMode} name="operatorCode" type="text" placeholder="Operator Code..." variable={loginInfo} setFunction={setValue}/>
            <LoginInput {darkMode} name="password" type="password" placeholder="Enter Password..." variable={loginInfo} setFunction={setValue}/>
        </div>
        <button
        class="bg-(--primary) shadow-c-sm text-center w-3/4 px-2.5 py-2.5 rounded-2xl cursor-pointer active:bg-(--secondary)"
        type="submit">
            <span class=" text-(--text-highlight) font-semibold lg:text-xl md:text-xl sm:text-lg text-md">Login</span>
        </button>
        <DarkModeToggle {darkMode} {toggleDarkMode}/>
    </form>
</div>
