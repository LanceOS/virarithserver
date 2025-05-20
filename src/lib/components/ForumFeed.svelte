<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import CreatePost from './posts/CreatePost.svelte';

	const session = authClient.useSession();
</script>

<!-- This is going to be for server forum feed -->
<div class="flex w-full flex-col border-2">
	{#if $session}
		<CreatePost />
	{/if}

	<section></section>
</div>
