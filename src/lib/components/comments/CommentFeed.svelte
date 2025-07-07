<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import LikeButton from '../actions/LikeButton.svelte';
	import { authClient } from '$lib/auth-client.ts';
	import CommentClient from '$lib/tools/CommentClient.ts';
	import CommentEdit from './CommentEdit.svelte';
	import type { CommentSchema } from '$lib/schemas/Comments.ts';
	import RoleCard from '../cards/RoleCard.svelte';
	import type { SerializedComment } from '$lib/@types/ICommentSerializer.ts';

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

	const deleteComment = async (comment: SerializedComment) => {
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
		if (
			!target.closest('.actions-menu-container') &&
			!target.closest('.stat-item.actions-button')
		) {
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
	{#if isLoadingComments}
		<section class="flex min-h-32 flex-col items-center justify-center gap-2">
			<Icon
				icon="svg-spinners:blocks-shuffle-3"
				class="pagination-spinner-icon text-4xl"
				style="color: var(--color-muted);"
			/>
			<p style="color: var(--color-muted);">Loading comments...</p>
		</section>
	{:else if comments && comments.length > 0}
		{#each comments as comment (comment.id)}
			<div class="card-setup flex flex-col gap-4">
				<div class="relative flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div class="user-avatar">
							<img src={comment.user.image} alt={comment.user.name || 'User avatar'} />
						</div>
						<button
							class="btn-nav text-base font-semibold"
							onclick={() => goto(`/pages/profile/${comment.user.id}`)}
						>
							{comment.user.name}
						</button>
						<RoleCard role={comment.user.role} />
					</div>

					<button
						class="stat-item actions-button cursor-pointer"
						onclick={() => toggleActionsMenu(comment.id)}
						aria-label="Comment actions"
					>
						<Icon icon="ic:outline-more-vert" class="stat-icon" />
					</button>

					{#if openActionsCommentId === comment.id}
						<div
							class="actions-menu-container absolute top-full right-0 -mt-2 z-50 w-48 overflow-hidden"
						>
							{#if $session.data?.user}
								<button onclick={() => openEdit(comment.id)} class="actions-menu-item">
									<Icon icon="mdi:text-box-edit-outline" />
									<span class="text-sm font-medium">Edit</span>
								</button>

								<div class="border-t" style="border-color: var(--color-border-subtle);"></div>

								<button onclick={() => deleteComment(comment)} class="actions-menu-item danger">
									<Icon icon="mdi:trash-can-outline" />
									<span class="text-sm font-medium">Delete</span>
								</button>
							{/if}
							<button class="actions-menu-item danger">
								<Icon icon="material-symbols:report-outline" />
								<span class="text-sm font-medium">Report</span>
							</button>
						</div>
					{/if}
				</div>

				{#if editingCommentId === comment.id}
					<CommentEdit {cancelEdit} {comment} {commentFeedUpdate} />
				{:else}
					<p class="text-sm sm:text-base" style="color: var(--color-base-content);">
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
			<h2 class="mb-2 text-lg sm:text-xl" style="color: var(--color-base-content);">Comments</h2>
			<p class="text-sm sm:text-base" style="color: var(--color-muted);">No comments yet!</p>
		</section>
	{/if}
</section>
