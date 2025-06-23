<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import LikeButton from '../actions/LikeButton.svelte';
	import { authClient } from '$lib/auth-client.ts';
	import CommentClient from '$lib/tools/CommentClient.ts';
	import CommentEdit from './CommentEdit.svelte';
	import type { CommentSchema } from '$lib/schemas/Comments.ts';
	import RoleCard from '../cards/RoleCard.svelte';

	let { comments, isLoadingComments, handleCommentDelete } = $props<{
		comments: CommentSchema[];
		isLoadingComments?: boolean;
		handleCommentDelete?: Function | undefined;
	}>();

	const session = authClient.useSession();

	let openActionsCommentId: string | null = $state(null);
	let editingCommentId: string | null = $state(null);

	const cancelEdit = () => {
		editingCommentId = null;
	};

	const toggleActionsMenu = (commentId: string) => {
		openActionsCommentId = openActionsCommentId === commentId ? null : commentId;
	};

	const closeActionsMenu = () => {
		openActionsCommentId = null;
	};

	const openEdit = (commentId: string) => {
		editingCommentId = commentId;
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
		editingCommentId = null;
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
	{#if handleCommentDelete}
		<h4 class="content text-xl">Comments</h4>
	{/if}

	{#if isLoadingComments}
		<section class="flex min-h-32 flex-col items-center justify-center gap-2">
			<Icon icon="svg-spinners:blocks-shuffle-3" class="muted text-4xl" />
			<p class="muted">Loading comments...</p>
		</section>
	{:else if comments && comments.length > 0}
		{#each comments as comment (comment.id)}
			<div class="card-setup flex flex-col gap-4">
				<div class="relative flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div class="user-avatar">
							<img src={comment.user.image} alt="" />
						</div>
						<button
							class="btn-nav text-base font-semibold"
							onclick={() => goto(`/pages/profile/${comment.user.id}`)}
						>
							{comment.user.name}
						</button>
						<RoleCard role={comment.user.role}/>
					</div>

					{#if comment.userId === $session.data?.user.id}
						<button
							class="stat-item actions-button"
							onclick={() => toggleActionsMenu(comment.id)}
							aria-label="Comment actions"
						>
							<Icon icon="ic:outline-more-vert" class="text-xl" />
						</button>
					{/if}

					{#if openActionsCommentId === comment.id}
						<div
							class="actions-menu bg-base border-muted absolute top-full right-0 z-50 mt-2 w-44 overflow-hidden"
						>
							<button
								onclick={() => openEdit(comment.id)}
								class="hover:bg-primary content flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150"
								style="background-color: var(--color-card);"
							>
								<Icon icon="mdi:text-box-edit-outline" class="text-base" />
								<span class="text-sm font-medium">Edit Comment</span>
							</button>

							<div class="border-t" style="border-color: var(--color-card-border);"></div>

							<button
								onclick={() => deleteComment(comment)}
								class="color-error flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-red-900/20"
								style="background-color: var(--color-card);"
							>
								<Icon icon="mdi:trash-can-outline" class="text-base" />
								<span class="text-sm font-medium">Delete Comment</span>
							</button>
						</div>
					{/if}
				</div>

				{#if editingCommentId === comment.id}
					<CommentEdit {cancelEdit} {comment} {commentFeedUpdate} />
				{:else}
					<p class="content text-sm sm:text-base">
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
		<section class="card-setup flex flex-col gap-1">
			<h2 class="content mb-2 text-lg sm:text-xl">Comments</h2>
			<p class="muted text-sm sm:text-base">No comments yet!</p>
		</section>
	{/if}
</section>
