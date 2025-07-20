<script lang="ts">
	import type { CommentSchema } from '$lib/server/schemas/Comments.ts';
	import { toast } from '@zerodevx/svelte-toast';

	let { comments } = $props<{
		comments: CommentSchema[] | undefined;
	}>();

	function formatDate(dateString: Date) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const archiveComment = async (comment: CommentSchema) => {
		const data = {
			objectId: comment.id,
			objectType: comment.type
		};

		try {
			await fetch('/admin/reported_feed/archive', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		} catch (error: any) {
			toast.push(error.message);
		}
	};

	const reinstateComment = async (comment: CommentSchema) => {
		const data = {
			objectId: comment.id,
			objectType: comment.type
		};

		try {
			await fetch('/admin/reported_feed/reinstate', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		} catch (error: any) {
			toast.push(error.message);
		}
	};
</script>

{#if comments}
	{#each comments as comment, index (comment.id)}
		<article class="sm:card-setup flex flex-col gap-6">
			<header class="flex flex-col gap-4">
				<div class="flex items-center gap-2">
					{#if comment.user?.image}
						<div class="user-avatar flex-shrink-0">
							<img
								src={comment.user?.image}
								alt={comment.user?.name || 'User avatar'}
								class="h-10 w-10 rounded-full object-cover"
							/>
						</div>
					{/if}
					<div class="flex flex-col leading-tight">
						<a
							class="btn-nav font-semibold"
							style="color: var(--color-base-content)"
							href={`/pages/profile/${comment.user?.id}`}
						>
							{comment.user?.name}
						</a>

						<time
							class="text-sm font-light"
							datetime={comment.createdAt}
							style="color: var(--color-muted);"
						>
							{formatDate(comment.createdAt)}
						</time>
					</div>
				</div>
				{@html comment.content.length > 50 ? comment.content.slice(0, 350) + '…' : comment.content}
			</header>

			<div class="flex items-center gap-12">
				<button type="button" class="btn-small" onclick={() => reinstateComment(comment)}
					>Reinstate</button
				>
				<button type="button" class="btn-delete" onclick={() => archiveComment(comment)}
					>Archive</button
				>
			</div>
		</article>
		{#if index !== comments.length - 1}
			<div class="border-muted sm:hidden"></div>
		{/if}
	{/each}
{/if}
