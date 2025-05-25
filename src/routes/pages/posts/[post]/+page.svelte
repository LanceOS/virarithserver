<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import CommentFeed from '$lib/components/CommentFeed.svelte';

	const session = authClient.useSession();

	export let data;
	const post = data.posts;
	console.log(post);

	// Formatted date
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<main class="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-16">
	<article class="p-8 flex flex-col gap-4 card-setup">

		<header class="flex items-center justify-between gap-4">
			<div class="flex items-center">
				<div class="flex flex-col">
					<span class="text-2xl font-semibold btn-nav cursor-pointer duration-200">{post.user.name}</span>
					<time class="text-sm font-light" datetime={post.createdAt}>
						{formatDate(post.createdAt)}
					</time>
				</div>
			</div>
			<span class="text-xl">{post.category}</span>
		</header>

		<div class="mb-2 flex flex-col gap-4">
			<h1 class="text-4xl">
				{post.title}
			</h1>
			<p class="text-xl">
				{post.content}
			</p>
		</div>

		<footer class="flex justify-between">
			<div class="flex items-center gap-4">
				<button class="stat-item">
					<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path
							d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
						/>
					</svg>
					{post.likesCount || 0} Likes
				</button>
				<span class="stat-item">
					<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
					{post.commentsCount || 0} Comments
				</span>
			</div>
		</footer>
	</article>

	{#if $session.data}
		<section>

		</section>
	{/if}

	{#if post.comments}
		<section class="p-8 flex flex-col gap-2 card-setup">
			<h2 class="mb-4 text-3xl text-white">Comments</h2>
			<p class="muted">No comments yet. Be the first to leave one!</p>
		</section>
	{:else}
		<CommentFeed comments={post.comments}/>
	{/if}
</main>