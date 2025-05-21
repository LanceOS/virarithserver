<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import CreatePost from './posts/CreatePost.svelte';

	let createPost = $state(false);

	const session = authClient.useSession();
</script>

<!-- This is going to be for server forum feed -->
<div class="flex w-full flex-col border-2">
	{#if $session}
		<button class="btn-big">Create Post</button>
	{/if}
	
	<section></section>
</div>
