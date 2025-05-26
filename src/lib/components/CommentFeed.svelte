<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';

	const { comments } = $props();
	
	const session = authClient.useSession();
</script>

{#snippet Comments(data)}
	{#each data as comment (comment.id)}
		<div class="p-6 card-setup flex flex-col gap-2">
			<button class="text-md font-semibold w-fit btn-nav" onclick={() => goto(`/pages/profile/${comment.user.id}`)}>{comment.user.name}</button>

			<p class="text-lg">{comment.content}</p>

			<div class="flex justify-between">
				<div class="flex items-center gap-4">
					<button class="stat-item">
						<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
							/>
						</svg>
						{comments.likesCount || 0} Likes
					</button>
				</div>
			</div>
		</div>

	{/each}
{/snippet}

<section>
	{@render Comments(comments)}
</section>
