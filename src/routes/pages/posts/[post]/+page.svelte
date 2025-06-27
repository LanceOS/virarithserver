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
	import { page } from '$app/state';
	import ImagePreview from '$lib/components/forms/ImagePreview.svelte';
	import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import RoleCard from '$lib/components/cards/RoleCard.svelte';
	import type { SerializedComment } from '$lib/@types/ICommentSerializer.ts';

	const session = authClient.useSession();
	const postId = page.params.post;

	let post: PostWithImage | undefined = $state();
	let comments: SerializedComment[] | undefined = $state();
	let isLoadingPost: boolean = $state(true);
	let isLoadingComments: boolean = $state(false);

	let hasActions = $state(false);
	let openPostActions = $state(false);

	let errorLog = $state('');

	function formatDate(date: Date | string) {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const deletePost = async () => {
		openPostActions = false;

		try {
			if (!post) return;

			await PostClient.deletePost(post);

			goto('/pages/forum');
		} catch (error) {
			console.log(error);
			errorLog = 'Failed to delete post';
		}
	};

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

	const handleClickOutsidePostActions = (event: MouseEvent) => {
		const target = event.target as Element;
		if (
			!target.closest('.actions-menu-container') &&
			!target.closest('.stat-item.actions-button')
		) {
			openPostActions = false;
		}
	};

	$effect(() => {
		if (openPostActions) {
			document.addEventListener('click', handleClickOutsidePostActions);
			return () => {
				document.removeEventListener('click', handleClickOutsidePostActions);
			};
		}
	});

	onMount(async () => {
		isLoadingComments = true;

		try {
			const postResponse = await PostClient.getPostById(postId);
			post = postResponse;
			const commentResponse = await CommentClient.getCommentsByPost(postId);
			comments = commentResponse;
			if ($session.data?.user.id === post?.user.id) {
				hasActions = true;
			}
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
		<article class="card-setup flex flex-col gap-8 p-6">
			<header class="relative flex items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					{#if post.user.image && post.user.image !== 'placeholder'}
						<img src={post.user.image} alt={post.user.name || 'User avatar'} class="user-avatar" />
					{/if}
					<div class="flex flex-col">
						<a
							class="btn-nav font-semibold sm:text-lg"
							style="color: var(--color-base-content)"
							href={`/pages/profile/${post?.user.id}`}
						>
							{post.user.name}
						</a>
						<time
							class="text-xs font-light sm:text-sm"
							datetime={formatDate(post.createdAt)}
							style="color: var(--color-muted);"
						>
							{formatDate(post.createdAt)}
						</time>
					</div>
					<RoleCard role={post.user.role} />
					{#if post.isEdited}
						<p class="text-xs" style="color: var(--color-muted);">(edited)</p>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					<span class="text-sm sm:text-lg" style="color: var(--color-text-secondary);"
						>{post.category.toUpperCase()}</span
					>
					{#if hasActions}
						<button
							class="stat-item actions-button"
							onclick={() => (openPostActions = !openPostActions)}
							aria-label="Post actions"
						>
							<Icon icon="ic:outline-more-vert" class="stat-icon" />
						</button>
					{/if}
				</div>

				{#if openPostActions}
					<div
						class="actions-menu-container absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden"
					>
						<button onclick={() => goto(`/pages/edit_post/${post?.id}`)} class="actions-menu-item">
							<Icon icon="mdi:text-box-edit-outline" />
							<span class="text-sm font-medium">Edit Post</span>
						</button>

						<div class="border-t" style="border-color: var(--color-border-subtle);"></div>

						<button onclick={deletePost} class="actions-menu-item danger">
							<Icon icon="mdi:trash-can-outline" />
							<span class="text-sm font-medium">Delete Post</span>
						</button>
					</div>
				{/if}
			</header>

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

	{#if $session.data?.user && post}
		<CreateComment {handleAddComment} />
	{/if}

	{#if comments}
		<CommentFeed {comments} {isLoadingComments} {handleCommentDelete} />
	{/if}
</main>
