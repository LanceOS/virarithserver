<script lang="ts">
	import { goto } from "$app/navigation";


</script>


<header class="p-4 h-16 flex items-center">
    <div class="max-w-7xl w-full mx-auto flex justify-between">
        <button type="button" aria-label="#" onclick={() => goto('/')} class="cursor-pointer">
            <img src="/images/virarith4.png" alt="" class="w-24">
        </button>
        <nav class="flex items-center gap-6">
            <button type="button" aria-label="#" class="btn-nav" onclick={() => goto("/")}>Home</button>
            <button type="button" aria-label="#" class="btn-nav" onclick={() => goto("/pages/forum")}>Forum</button>
            <button type="button" aria-label="#" class="btn-nav" onclick={() => goto("/pages/signin")}>Placeholder</button>
            <button type="button" aria-label="Sign In" onclick={() => goto("/pages/signin")} class="btn-small">Sign In</button>
        </nav>
    </div>

</header>