<script>
	import { goto } from "$app/navigation";


</script>


<header class="p-4 h-16 flex items-center">
    <div class="max-w-7xl w-full mx-auto flex justify-between">
        <div>

        </div>
        <nav class="flex items-center gap-6">
            <button type="button" aria-label="#" class="btn-nav">Placeholder</button>
            <button type="button" aria-label="#" class="btn-nav">Placeholder</button>
            <button type="button" aria-label="#" class="btn-nav">Placeholder</button>
            <button type="button" aria-label="Sign In" onclick={() => goto("/signin")} class="btn-small">Sign In</button>
        </nav>
    </div>

</header>