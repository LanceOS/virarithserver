<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import Create from '$lib/components/Create.svelte';
	import ForumFeed from '$lib/components/ForumFeed.svelte';
    
    let createPost = $state(false);

    const session = authClient.useSession();

	let { data }: { data: PageData } = $props();
    const post = data.posts;

</script>

<main class="px-4 py-16">
	{#if $session}
		<button class="btn-big" onclick={() => createPost = !createPost}>Create Post</button>
	{/if}

	{#if $session && createPost}
		<Create />
	{/if}
	<ForumFeed />
</main>
