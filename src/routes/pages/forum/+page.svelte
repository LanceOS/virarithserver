<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import Create from '$lib/components/Create.svelte';
	import ForumFeed from '$lib/components/ForumFeed.svelte';
    
    let createPost = $state(false);

    const session = authClient.useSession();

	let { data } = $props();
    const posts = data.posts;

</script>

<main class="px-4 py-16 mx-auto max-w-7xl">
	{#if $session}
		<button class="btn-big" onclick={() => createPost = !createPost}>Create Post</button>
	{/if}

	{#if $session && createPost}
		<Create />
	{/if}
	<ForumFeed { posts }/>
</main>
