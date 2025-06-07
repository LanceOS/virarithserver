<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import LikeButton from '../actions/LikeButton.svelte';
	import { authClient } from '$lib/auth-client.ts';
	import CommentClient from '$lib/tools/CommentClient.ts';
	import CommentEdit from './CommentEdit.svelte';
	import type { CommentSchema } from '$lib/schemas/Comments.ts';

	let { comments, isLoadingComments, handleCommentDelete } = $props();

	const session = authClient.useSession();

	let openActionsCommentId: string | null = $state(null);
	let isEditingComment: boolean = $state(false);

	const cancelEdit = () => {
		isEditingComment = false;
	};

	const toggleActionsMenu = (commentId: string) => {
		openActionsCommentId = openActionsCommentId === commentId ? null : commentId;
	};

	const closeActionsMenu = () => {
		openActionsCommentId = null;
	};

	const openEdit = () => {
		isEditingComment = true;
		closeActionsMenu();
	};

	const commentFeedUpdate = (comment: CommentSchema) => {
		const newCommentArr = comments.map((item: CommentSchema) => {
			if (item.id === comment.id) {
				return {
					...item,
					content: comment.content
				};
			} else {
				return item;
			}
		});

		comments = newCommentArr;
	};

	const deleteComment = async (comment: any) => {
		try {
			await CommentClient.deleteComment(comment);
			handleCommentDelete(comment.id);
		} catch (error) {
			console.log(error);
		} finally {
			closeActionsMenu();
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as Element;
		if (!target.closest('.actions-menu') && !target.closest('.actions-button')) {
			closeActionsMenu();
		}
	};

	$effect(() => {
		if (openActionsCommentId) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<section class="flex flex-col gap-4">
	<h4 class="text-xl">Comments</h4>
	{#if isLoadingComments}
		<section class="flex min-h-32 flex-col items-center justify-center gap-2">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-current"></div>
			<p class="text-muted">Loading comments...</p>
		</section>
	{:else if comments && comments.length > 0}
		{#each comments as comment (comment.id)}
			<div class="card-setup flex flex-col gap-2 p-6">
				<div class="relative flex items-center justify-between">
					<button
						class="text-md btn-nav w-fit font-semibold"
						onclick={() => goto(`/pages/profile/${comment.user.id}`)}
					>
						{comment.user.name}
					</button>

					{#if comment.userId === $session.data?.user.id}
						<button
							class="stat-item actions-button"
							onclick={() => toggleActionsMenu(comment.id)}
							aria-label="Comment actions"
						>
							<Icon icon="ic:outline-more-vert" class="text-xl duration-200 sm:text-xl" />
						</button>
					{/if}

					{#if openActionsCommentId === comment.id}
						<div
							class="actions-menu bg-base absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden"
						>
							<button
								onclick={() => openEdit()}
								class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-gray-600"
							>
								<Icon icon="mdi:text-box-edit-outline" />
								<span class="text-sm font-medium">Edit Comment</span>
							</button>

							<div class="border-muted border-t"></div>

							<button
								onclick={() => deleteComment(comment)}
								class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-red-600 transition-colors duration-150 hover:bg-red-200"
							>
								<Icon icon="mdi:trash-can-outline" />
								<span class="text-sm font-medium">Delete Post</span>
							</button>
						</div>
					{/if}
				</div>

				{#if isEditingComment}
					<CommentEdit {cancelEdit} {comment} {commentFeedUpdate} />
				{:else}
					<p class="text-sm sm:text-base">
						{@html comment.content}
					</p>
				{/if}

				<div class="flex justify-between">
					<div class="flex items-center gap-4">
						<LikeButton object={comment} />
					</div>
				</div>
			</div>
		{/each}
	{:else if comments && comments.length === 0}
		<section class="card-setup flex flex-col gap-1 p-6">
			<h2 class="mb-2 text-lg text-white sm:text-2xl">Comments</h2>
			<p class="muted text-sm sm:text-base">No comments yet. Be the first to leave one!</p>
		</section>
	{/if}
</section>

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
