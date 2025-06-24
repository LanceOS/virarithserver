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
	import type { NewComment } from '$lib/@types/ICommentSerializer.ts';
	import RoleCard from '$lib/components/cards/RoleCard.svelte';

	const session = authClient.useSession();
	const postId = page.params.post;

	let post: PostWithImage | undefined = $state();
	let comments: NewComment[] | undefined = $state();
	let isLoadingPost: boolean = $state(true);
	let isLoadingComments: boolean = $state(false);

	let hasActions = $state(false);
	let openPostActions = $state(false);
	let actionsRef = $state();

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
			if(!post) return;

			await PostClient.deletePost(post);

			goto('/pages/forum');
		} catch (error) {
			console.log(error);
			errorLog = 'Failed to delete post';
		}
	};

	const handleCommentDelete = (commentId: string) => {
		if(!comments) return;
		comments = comments.filter((comment: NewComment) => comment.id !== commentId);
		if (post) {
			post.commentCount = post.commentCount - 1;
		}
	};

	const handleAddComment = (comment: NewComment) => {
		if(!comments) return;
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
			if ($session.data?.user.id === post?.user.id) {
				hasActions = true;
			}
		} catch (error: any) {
			console.error('Failed to load post:', error.error);
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
<main class="border-muted mx-auto flex max-w-7xl flex-col gap-8 p-3 pb-12 sm:p-8">
	{#if isLoadingPost}
		<section class="flex min-h-64 flex-col items-center justify-center gap-2">
			<Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl" />
			<p class="text-muted">Loading post...</p>
		</section>
	{:else if post}
		<article class="card-setup flex flex-col gap-8 p-6">
			<header class="relative flex items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					{#if post.user.image && post.user.image !== 'placeholder'}
					<div class="user-avatar">
						<img src={post.user.image} alt=""/>
					</div>
					{/if}
					<div class="flex flex-col">
						<span class="btn-nav font-semibold sm:text-lg">{post.user.name}</span>
						<time class="text-xs font-light sm:text-sm" datetime={formatDate(post.createdAt)}>
							{formatDate(post.createdAt)}
						</time>
					</div>
					<RoleCard role={post.user.role}/>
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
								onclick={() => goto(`/pages/edit_post/${post?.id}`)}
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

			<div class="mb-1 flex flex-col gap-2">
				<h1 class="text-lg sm:text-3xl">
					{@html post.title}
				</h1>
				<p class="space-y-4 text-sm sm:text-base break-words">
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
							class="text-base duration-200 active:text-blue-700"
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
				class="btn-big rounded bg-blue-500 px-3 py-1.5 text-sm content hover:bg-blue-600"
				onclick={() => window.location.reload()}
			>
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
