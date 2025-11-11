<script lang="ts">
    import eye from "$lib/assets/eye.svg";
    import eyeOff from "$lib/assets/eye-off.svg";
    import eyeDark from "$lib/assets/eye-dark.svg";
    import eyeOffDark from "$lib/assets/eye-off-dark.svg";
    
    let { darkMode, name, type, placeholder, variable, setFunction } : {
        darkMode: boolean,
        name: string,
        type: string,
        placeholder: string,
        variable: {
            operatorCode: string,
            password: string
        },
        setFunction: Function
    } = $props();

    let seekMode: boolean = $state(false);
    const toggleSeek = () => seekMode = !seekMode;

    let eyeSeek = $derived(darkMode ? eyeDark : eye);
    let eyeHide = $derived(darkMode ? eyeOffDark : eyeOff);
    let eyeIcon = $derived(seekMode ? eyeHide : eyeSeek);
    let newType = $derived(seekMode ? "text" : "password");

    const setInputToVariable = (e: Event) => {
        const target = e.target as HTMLInputElement;

        const variableName = (type === "password") ? "password" : "operatorCode";
        setFunction(variableName, target.value);
    }

    const onFocus = (e: Event, state: "in" | "out") => {
        const target = e.target as HTMLElement;
        const parent = target.parentElement;
        if(!parent) return;

        if(state === "in") parent.classList.add("shadow-c-sm");
        else parent.classList.remove("shadow-c-sm");
    }
</script>

<div 
class="relative items-center bg-(--bg-light) border-2 border-(--border) w-3/4 px-2.5 py-2.5 rounded-2xl"
onfocusin={(e) => { onFocus(e, "in") }} onfocusout={(e) => { onFocus(e, "out") }}
>
    <input 
    class="placeholder-(--text-muted) w-full bg-transparent outline-0 lg:text-lg md:text-lg sm:text-md text-sm text-(--text)"
    type={type === "password" ? newType : type}
    {placeholder}
    {name}
    oninput={setInputToVariable}/>
    {#if (type === "password")}
    <button 
    class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" 
    type="button" 
    onclick={toggleSeek}>
        <img src={eyeIcon} alt="Toggle See Password"/>
    </button>
    {/if}
</div>