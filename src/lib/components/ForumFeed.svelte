<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';

	const session = authClient.useSession();
</script>

<!-- This is going to be for server forum feed -->
<div class="flex w-full flex-col border-2">
	{#if $session}
		<button class="btn-big" onclick={() => goto("/pages/create")}>Create Post</button>
	{/if}
	
	<section></section>
</div>
