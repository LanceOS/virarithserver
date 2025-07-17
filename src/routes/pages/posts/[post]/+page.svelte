<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import CommentFeed from '$lib/components/comments/CommentFeed.svelte';
	import CreateComment from '$lib/components/comments/CreateComment.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import CommentClient from '$lib/client/CommentClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import PostClient from '$lib/client/PostClient.ts';
	import LikeButton from '$lib/components/actions/LikeButton.svelte';
	import ErrorModal from '$lib/components/popups/ErrorModal.svelte';
	import { page } from '$app/state';
	import ImagePreview from '$lib/components/forms/ImagePreview.svelte';
	import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import type { SerializedComment } from '$lib/@types/ICommentSerializer.ts';
	import CardHeader from '$lib/components/cards/CardHeader.svelte';

	const session = authClient.useSession();
	const postId = page.params.post;

	let post: PostWithImage | undefined = $state();
	let comments: SerializedComment[] | undefined = $state();
	let isLoadingPost: boolean = $state(true);
	let isLoadingComments: boolean = $state(false);

	let errorLog = $state('');

	const handleCommentDelete = (commentId: string) => {
		if (!comments) return;
		comments = comments.filter((comment: SerializedComment) => comment.id !== commentId);
		if (post) {
			post.commentCount = post.commentCount - 1;
		}
	};

	const handleAddComment = (comment: SerializedComment) => {
		if (!comments) return;
		comments = [comment, ...comments];
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
		} catch (error: any) {
			console.error('Failed to load post:', error.error);
			errorLog = 'Failed to load post. Please try again.';
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
<main class="mx-auto flex max-w-7xl flex-col gap-8 p-3 pb-12 sm:p-8">
	{#if isLoadingPost}
		<section class="flex min-h-64 flex-col items-center justify-center gap-2">
			<Icon
				icon="svg-spinners:blocks-shuffle-3"
				class="pagination-spinner-icon text-4xl"
				style="color: var(--color-muted);"
			/>
			<p style="color: var(--color-muted);">Loading post...</p>
		</section>
	{:else if post}
		<article class="sm:card-setup flex flex-col gap-8">
			<CardHeader data={post} user={$session.data?.user}/>

			<div class="mb-1 flex flex-col gap-2">
				<h1 class="text-lg sm:text-3xl" style="color: var(--color-base-content);">
					{@html post.title}
				</h1>
				<p
					class="space-y-4 text-sm break-words sm:text-base"
					style="color: var(--color-base-content);"
				>
					{@html post.content}
				</p>
			</div>

			{#if post.images}
				<div class="-mt-2">
					<ImagePreview imagePreviews={post.images} />
				</div>
			{/if}

			<footer class="flex justify-between">
				<div class="flex items-center gap-4">
					<LikeButton object={post} />
					<span class="stat-item">
						<Icon
							icon="material-symbols:comment-sharp"
							class="stat-icon"
							style="color: var(--color-muted);"
						/>
						<span class="text-sm font-medium" style="color: var(--color-base-content);">
							{post.commentCount || 0} Comments
						</span>
					</span>
				</div>
			</footer>
		</article>
	{:else}
		<section class="card-setup flex min-h-64 flex-col items-center justify-center gap-4">
			<Icon
				icon="material-symbols:error-outline"
				class="text-3xl"
				style="color: var(--color-error);"
			/>
			<p class="text-center" style="color: var(--color-error);">
				Post not found or could not be loaded
			</p>
			<button class="btn-primary btn-medium" onclick={() => window.location.reload()}>
				Try Again
			</button>
		</section>
	{/if}

	<div class="sm:hidden border-muted"></div>

	{#if $session.data?.user && post}
		<CreateComment {handleAddComment} {post} />
	{/if}

	<div class="sm:hidden border-muted"></div>

	{#if comments}
		<CommentFeed {comments} {isLoadingComments} {handleCommentDelete} />
	{/if}
</main>
