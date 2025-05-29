<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import CommentFeed from '$lib/components/CommentFeed.svelte';
	import Icon from '@iconify/svelte';

	const session = authClient.useSession();

	export let data;
	const post = data.posts;
	const comments = data.comments;

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

<main class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16">
	<button
		type="button"
		aria-label="Return Home"
		class="cursor-pointer self-end -mt-10"
		onclick={() => {
			goto('/');
		}}><Icon icon="stash:signout-alt" class="text-5xl" /></button
	>
	<article class="card-setup flex flex-col gap-4 p-8">
		<header class="flex items-center justify-between gap-4">
			<div class="flex items-center">
				<div class="flex flex-col">
					<span class="btn-nav font-semibold sm:text-2xl">{post.user.name}</span>
					<time class="text-xs font-light sm:text-sm" datetime={post.createdAt}>
						{formatDate(post.createdAt)}
					</time>
				</div>
			</div>
			<span class="text-md sm:text-xl">{post.category}</span>
		</header>

		<div class="mb-2 flex flex-col gap-4">
			<h1 class="text-xl sm:text-4xl">
				{post.title}
			</h1>
			<p class="text-sm sm:text-xl">
				{post.content}
			</p>
		</div>

		<footer class="flex justify-between">
			<div class="flex items-center gap-4">
				<button class="stat-item">
					<Icon
						icon="material-symbols:thumb-up"
						class="text-lg duration-200 active:text-blue-700 sm:text-2xl"
					/>
					{post.likesCount || 0} Likes
				</button>
				<span class="stat-item">
					<Icon
						icon="material-symbols:comment-sharp"
						class="text-lg duration-200 active:text-blue-700 sm:text-2xl"
					/>
					{post.commentsCount || 0} Comments
				</span>
			</div>
		</footer>
	</article>

	{#if $session?.data?.user}
		<section></section>
	{/if}

	{#if comments}
		<section class="card-setup flex flex-col gap-2 p-8">
			<h2 class="mb-4 text-xl text-white sm:text-3xl">Comments</h2>
			<p class="muted text-sm sm:text-xl">No comments yet. Be the first to leave one!</p>
		</section>
	{:else}
		<CommentFeed {comments} />
	{/if}
</main>
