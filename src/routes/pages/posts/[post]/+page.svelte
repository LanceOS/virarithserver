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
	import LikeClient from '$lib/tools/LikeClient.ts';
	import ErrorModal from '$lib/components/Popups/ErrorModal.svelte';

	const session = authClient.useSession();
	const postId = $page.params.post;

	let post: any = $state();
	let comments: any = $state();
	let isLoadingPost: boolean = $state(true);
	let isLoadingComments: boolean = $state(true);
	let isSubmittingComment: boolean = $state(false);

	let sendingLike = $state(false);
	let errorLog = $state('');

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

	const likePost = async (id: string) => {
		if (!$session.data?.user) {
			setError();
			return;
		}

		const user = $session.data.user;
		sendingLike = true;

		const wasLiked = post.isLiked;

		try {
			if (wasLiked) {
				await LikeClient.unlikeObject({ userId: user.id, postId: post.id });
			} else {
				await LikeClient.likeObject({ userId: user.id, postId: post.id });
			}

			post = {
				...post,
				isLiked: !wasLiked,
				likeCount: wasLiked ? post.likeCount - 1 : post.likeCount + 1
			};
		} catch (error) {
			errorLog = 'Failed to like post';
		} finally {
			sendingLike = false;
		}
	};

	const setError = () => {
		errorLog = 'Must log in to like.';
		sendingLike = true;
		setTimeout(() => {
			errorLog = '';
			sendingLike = false;
		}, 2000);
	};

	onMount(async () => {
		try {
			const commentResponse = await CommentClient.getCommentsByPost(postId);
			const postResponse = await PostClient.getPostById(postId);
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

{#if errorLog}
	<ErrorModal {errorLog} />
{/if}
<Header />
<main class="border-muted mx-auto flex max-w-7xl flex-col gap-16 p-3 sm:p-8">
	{#if isLoadingPost}
		<section class="flex min-h-64 flex-col items-center justify-center gap-2">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-current"></div>
			<p class="text-muted">Loading post...</p>
		</section>
	{:else if post}
		<article class="card-setup flex flex-col gap-8 p-6">
			<header class="flex items-center justify-between gap-3">
				<div class="flex items-center">
					<div class="flex flex-col">
						<span class="btn-nav font-semibold sm:text-lg">{post.user.name}</span>
						<time class="text-xs font-light sm:text-sm" datetime={post.createdAt}>
							{formatDate(post.createdAt)}
						</time>
					</div>
				</div>
				<span class="text-sm sm:text-lg">{post.category.toUpperCase()}</span>
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
					<button class="stat-item" onclick={() => likePost(post.id)} disabled={sendingLike}>
						<Icon
							icon="material-symbols:thumb-up"
							class={`text-xl duration-200 sm:text-xl ${post.isLiked ? 'text-green-400' : ''}`}
						/>
						{post.likeCount || 0} Likes
					</button>
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

	{#if $session.data?.user && comments && comments.length < 100}
		<CreateComment {addComment} {isSubmittingComment} />
	{/if}

	{#if isLoadingComments}
		<section class="flex min-h-32 flex-col items-center justify-center gap-2">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-current"></div>
			<p class="text-muted">Loading comments...</p>
		</section>
	{:else if comments && comments.length > 0}
		<CommentFeed {comments} />
	{:else if comments && comments.length === 0}
		<section class="card-setup flex flex-col gap-1 p-6">
			<h2 class="mb-2 text-lg text-white sm:text-2xl">Comments</h2>
			<p class="muted text-sm sm:text-base">No comments yet. Be the first to leave one!</p>
		</section>
	{/if}

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
