<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import CommentFeed from '$lib/components/comments/CommentFeed.svelte';
	import CreateComment from '$lib/components/comments/CreateComment.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import CommentClient from '$lib/tools/CommentClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import PostClient from '$lib/tools/PostClient.ts';
	import LikeButton from '$lib/components/actions/LikeButton.svelte';
	import ErrorModal from '$lib/components/popups/ErrorModal.svelte';
	import type { CommentSchema } from '$lib/schemas/Comments.ts';
	import { page } from '$app/state';

	const session = authClient.useSession();
	const postId = page.params.post;

	let post: any = $state();
	let comments: any = $state();
	let isLoadingPost: boolean = $state(true);
	let isLoadingComments: boolean = $state(false);

	let hasActions = $state(false);
	let openPostActions = $state(false);
	let actionsRef = $state();

	let errorLog = $state('');

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
	const deletePost = async () => {
		openPostActions = false;

		try {
			await PostClient.deletePost(post);

			goto('/pages/forum');
		} catch (error) {
			console.log(error);
			errorLog = 'Failed to delete post';
		}
	};

	const handleCommentDelete = (commentId: string) => {
		comments = comments.filter((comment: CommentSchema) => comment.id !== commentId);
		if (post) {
			post.commentCount = post.commentCount - 1;
		}
	};

	const handleAddComment = (comment: CommentSchema) => {
		comments = [comment, ...comments]
		if (post) {
			post.commentCount = post.commentCount + 1;
		}
	};

	onMount(async () => {
		isLoadingComments = true;

		try {
			const postResponse = await PostClient.getPostById(postId);
			post = postResponse;
			const commentResponse = await CommentClient.getCommentsByPost(postId);
			comments = commentResponse;
			console.log(comments)
			if ($session.data?.user.id === post.userId) {
				hasActions = true;
			}
		} catch (error) {
			console.error('Failed to load post:', error);
			isLoadingPost = false;
		} finally {
			isLoadingPost = false;
			isLoadingComments = false;
		}
	});
</script>

{#if errorLog}
	<ErrorModal {errorLog} />
{/if}
<Header />
<main class="border-muted mx-auto flex max-w-7xl flex-col gap-8 p-3 sm:p-8 pb-12">
	{#if isLoadingPost}
		<section class="flex min-h-64 flex-col items-center justify-center gap-2">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-current"></div>
			<p class="text-muted">Loading post...</p>
		</section>
	{:else if post}
		<article class="card-setup flex flex-col gap-8 p-6">
			<header class="relative flex items-center justify-between gap-3">
				<div class="flex items-center gap-4">
					<div class="flex flex-col">
						<span class="btn-nav font-semibold sm:text-lg">{post.user.name}</span>
						<time class="text-xs font-light sm:text-sm" datetime={post.createdAt}>
							{formatDate(post.createdAt)}
						</time>
					</div>
					{#if post.isEdited}
						<p class="text-xs">(edited)</p>
					{/if}
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
								onclick={deletePost}
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

	{#if $session.data?.user}
		<CreateComment {handleAddComment} />
	{/if}

	{#if comments}
		<CommentFeed {comments} {isLoadingComments} {handleCommentDelete} />
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
