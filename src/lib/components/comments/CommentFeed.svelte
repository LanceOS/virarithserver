<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import LikeButton from '../actions/LikeButton.svelte';
	import { authClient } from '$lib/auth-client.ts';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import CommentClient from '$lib/tools/CommentClient.ts';

	const session = authClient.useSession();
	const pageParam = $page.params.post || $page.params.user;

	let comments: any = $state();
	let isLoadingComments: boolean = $state(true);
	let openPostActions: boolean = $state(false);
	let actionsRef = $state();

	const handleDelete = () => {
		console.log('Delete post clicked');
		openPostActions = false;
		// Add your delete logic here
	};

	onMount(async () => {
		try {
			const commentResponse = await CommentClient.getCommentsByPost(pageParam);
			comments = commentResponse;
		} catch (error) {
			console.log(error);
		} finally {
			isLoadingComments = false;
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
				<div class="flex items-center justify-between relative">
					<button
						class="text-md btn-nav w-fit font-semibold"
						onclick={() => goto(`/pages/profile/${comment.user.id}`)}>{comment.user.name}</button
					>
					{#if comment.userId === $session.data?.user.id}
						<button class="stat-item" onclick={() => (openPostActions = !openPostActions)}>
							<Icon icon="ic:outline-more-vert" class="text-xl duration-200 sm:text-xl" />
						</button>
					{/if}

					{#if openPostActions}
						<div
							bind:this={actionsRef}
							class="bg-base absolute top-full right-0 z-50 w-48 overflow-hidden mt-2"
						>
							<div class="">
								<button
									onclick={() => ""}
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
				</div>

				<p>
					{@html comment.content}
				</p>

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
