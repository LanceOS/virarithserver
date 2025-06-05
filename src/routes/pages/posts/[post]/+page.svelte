<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import CommentFeed from '$lib/components/comments/CommentFeed.svelte';
	import CreateComment from '$lib/components/comments/CreateComment.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import CommentClient from '$lib/tools/CommentClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import PostClient from '$lib/tools/PostClient.ts';
	import LikeButton from '$lib/components/actions/LikeButton.svelte';

	const session = authClient.useSession();
	const postId = $page.params.post;

	let post: any = $state();
	let comments: any = $state();
	let isLoadingPost: boolean = $state(true);
	let isSubmittingComment: boolean = $state(false);

	let hasActions = $state(false);
	let openPostActions = $state(false);
	let actionsRef = $state();

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	/**
	 * @param body
	 * @returns Adds new comment to database and then refetches comments
	 */
	const addComment = async (body: string) => {
		if (!$session.data?.user || !post?.id) {
			return;
		}

		const user = $session.data.user;

		isSubmittingComment = true;

		const data = {
			userId: user.id,
			postId: post.id,
			content: body
		};

		try {
			const response = await CommentClient.createComment(data);
			const newComment = { ...response[0], user: user };
			console.log('This is a test for new comment structure', newComment);
			comments = [newComment, ...comments];

			if (post) {
				post.commentCount = post.commentCount + 1;
			}
		} catch (error) {
			console.error('Failed to create comment:', error);
		} finally {
			isSubmittingComment = false;
		}
	};

	const handleDelete = () => {
		console.log('Delete post clicked');
		openPostActions = false;
		// Add your delete logic here
	};

	onMount(async () => {
		try {
			const postResponse = await PostClient.getPostById(postId);
			post = postResponse;

			if ($session.data?.user.id === post.userId) {
				hasActions = true;
			}
		} catch (error) {
			console.error('Failed to load post:', error);
			isLoadingPost = false; // Important: set to false even on error
		} finally {
			isLoadingPost = false;
		}
	});
</script>

<Header />
<main class="border-muted mx-auto flex max-w-7xl flex-col gap-8 p-3 sm:p-8">
	{#if isLoadingPost}
		<section class="flex min-h-64 flex-col items-center justify-center gap-2">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-current"></div>
			<p class="text-muted">Loading post...</p>
		</section>
	{:else if post}
		<article class="card-setup flex flex-col gap-8 p-6">
			<header class="relative flex items-center justify-between gap-3">
				<div class="flex items-center">
					<div class="flex flex-col">
						<span class="btn-nav font-semibold sm:text-lg">{post.user.name}</span>
						<time class="text-xs font-light sm:text-sm" datetime={post.createdAt}>
							{formatDate(post.createdAt)}
						</time>
					</div>
				</div>
				<div class="flex gap-2">
					<span class="text-sm sm:text-lg">{post.category.toUpperCase()}</span>
					{#if hasActions}
						<button class="stat-item" onclick={() => (openPostActions = !openPostActions)}>
							<Icon icon="ic:outline-more-vert" class="text-xl duration-200 sm:text-xl" />
						</button>
					{/if}
				</div>

				{#if openPostActions}
					<div
						bind:this={actionsRef}
						class="bg-base absolute top-full right-0 z-50 w-48 overflow-hidden"
					>
						<div class="">
							<button
								onclick={() => goto(`/pages/edit_post/${post.id}`)}
								class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-gray-500"
							>
								<Icon icon="mdi:text-box-edit-outline" />
								<span class="text-sm font-medium">Edit Post</span>
							</button>

							<div class="border-muted border-t"></div>

							<button
								onclick={handleDelete}
								class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-red-600 transition-colors duration-150 hover:bg-red-200"
							>
								<Icon icon="mdi:trash-can-outline" />
								<span class="text-sm font-medium">Delete Post</span>
							</button>
						</div>
					</div>
				{/if}
			</header>

			<div class="mb-1 flex flex-col gap-6">
				<h1 class="text-lg sm:text-3xl">
					{@html post.title}
				</h1>
				<p class="space-y-4 text-sm sm:text-base">
					{@html post.content}
				</p>
			</div>

			<footer class="flex justify-between">
				<div class="flex items-center gap-2">
					<LikeButton object={post} />
					<span class="stat-item text-xs sm:text-sm">
						<Icon
							icon="material-symbols:comment-sharp"
							class="text-base duration-200 active:text-blue-700 sm:text-xl"
						/>
						{post.commentCount || 0} Comments
					</span>
				</div>
			</footer>
		</article>
	{:else}
		<section class="flex min-h-64 flex-col items-center justify-center gap-2">
			<Icon icon="material-symbols:error-outline" class="text-3xl text-red-500" />
			<p class="text-center text-red-500">Post not found or could not be loaded</p>
			<button
				class="btn-big rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
				onclick={() => window.location.reload()}
			>
				Try Again
			</button>
		</section>
	{/if}

	{#if $session.data?.user && post.commentCount < 100}
		<CreateComment {addComment} {isSubmittingComment} />
	{/if}

	<CommentFeed />

	{#if isSubmittingComment}
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
			<div class="flex items-center gap-2 rounded-lg p-4">
				<div class="h-6 w-6 animate-spin rounded-full border-b-2 border-current"></div>
				<span class="text-sm text-gray-700">Posting comment...</span>
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
