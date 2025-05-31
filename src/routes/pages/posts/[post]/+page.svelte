<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import CommentFeed from '$lib/components/CommentFeed.svelte';
	import CreateComment from '$lib/components/CreateComment.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import CommentClient from '$lib/tools/CommentClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import PostClient from '$lib/tools/PostClient.ts';

	const session = authClient.useSession();
	const postId = $page.params.post

	let post: any = $state();
	let comments: any = $state();
	let isLoadingPost: boolean = $state(true);
	let isLoadingComments: boolean = $state(true);
	let isSubmittingComment: boolean = $state(false);
	

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const addComment = async (body: string) => {
		if (!$session.data?.user || !post?.id) {
			return;
		}

		isSubmittingComment = true;

		const data = {
			userId: $session.data.user.id,
			postId: post.id,
			content: body
		};

		try {
			await CommentClient.createComment(data);
			const commentResponse = await CommentClient.getCommentsByPost(postId);
			comments = commentResponse;
		} catch (error) {
			console.error('Failed to create comment:', error);
		} finally {
			isSubmittingComment = false;
		}
	};

	onMount(async () => {
		try {
			const commentResponse = await CommentClient.getCommentsByPost(postId);
			const postResponse = await PostClient.getPostById(postId)
			post = postResponse;
			comments = commentResponse;
			isLoadingPost = false;
			isLoadingComments = false;
		} catch (error) {
			console.error('Failed to load post:', error);
			isLoadingPost = false; // Important: set to false even on error
		}
	});
</script>

<Header />
<main class="border-muted mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-12">
	{#if isLoadingPost}
		<!-- Post Loading -->
		<section class="flex min-h-64 flex-col items-center justify-center gap-4">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-current"></div>
			<p class="text-muted">Loading post...</p>
		</section>
	{:else if post}
		<article class="card-setup flex flex-col gap-6 p-8">
			<header class="flex items-center justify-between gap-4">
				<div class="flex items-center">
					<div class="flex flex-col">
						<span class="btn-nav font-semibold sm:text-xl">{post.user.name}</span>
						<time class="text-xs font-light sm:text-sm" datetime={post.createdAt}>
							{formatDate(post.createdAt)}
						</time>
					</div>
				</div>
				<span class="text-md sm:text-xl">{post.category.toUpperCase()}</span>
			</header>

			<div class="mb-2 flex flex-col gap-2">
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
	{:else}
		<!-- Post Not Found -->
		<section class="flex min-h-64 flex-col items-center justify-center gap-4">
			<Icon icon="material-symbols:error-outline" class="text-4xl text-red-500" />
			<p class="text-center text-red-500">Post not found or could not be loaded</p>
			<button
				class="btn-big rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				onclick={() => window.location.reload()}
			>
				Try Again
			</button>
		</section>
	{/if}

	{#if $session.data?.user && comments && comments.length < 100}
		<CreateComment {addComment} {isSubmittingComment} />
	{/if}

	{#if isLoadingComments}
		<section class="flex min-h-32 flex-col items-center justify-center gap-4">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-current"></div>
			<p class="text-muted">Loading comments...</p>
		</section>
	{:else if comments && comments.length > 0}
		<CommentFeed {comments} />
	{:else if comments && comments.length === 0}
		<section class="card-setup flex flex-col gap-2 p-8">
			<h2 class="mb-4 text-xl text-white sm:text-3xl">Comments</h2>
			<p class="muted text-sm sm:text-xl">No comments yet. Be the first to leave one!</p>
		</section>
	{/if}

	<!-- Comment Submission Loading -->
	{#if isSubmittingComment}
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
			<div class="flex items-center gap-3 rounded-lg bg-white p-6">
				<div class="h-6 w-6 animate-spin rounded-full border-b-2 border-current"></div>
				<span class="text-gray-700">Posting comment...</span>
			</div>
		</div>
	{/if}
</main>

<style>
	/* Spinning animation for loading spinner */
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
