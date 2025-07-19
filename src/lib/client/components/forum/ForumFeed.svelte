<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import LikeButton from '../actions/LikeButton.svelte';
	import ImagePreview from '../forms/ImagePreview.svelte';
	import CardHeader from '../cards/CardHeader.svelte';
	import { authClient } from '$lib/auth-client.ts';

	let { posts } = $props();

	const session = authClient.useSession();
</script>

<section class="flex w-full flex-col gap-12 sm:gap-4">
	{#if posts}
		{#each posts as post, index (post.id)}
			<article class="sm:card-setup flex flex-col gap-6">
				<CardHeader data={post} user={$session.data?.user} />

				<button
					class="flex cursor-pointer flex-col gap-1 text-left"
					onclick={() => goto(`/pages/posts/${post.id}`)}
					type="button"
				>
					<h3 class="text-xl leading-snug break-words" style="color: var(--color-base-content);">
						{@html post.title}
					</h3>
					<p class="text-sm leading-snug break-words" style="color: var(--color-base-content);">
						{@html post.content.length > 50 ? post.content.slice(0, 350) + '…' : post.content}
					</p>
				</button>

				{#if post.images}
					<div class="-mt-2">
						<ImagePreview imagePreviews={post.images} />
					</div>
				{/if}

				<footer class="flex flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center">
					<div class="flex items-center gap-4">
						<LikeButton object={post} />
						<div class="stat-item">
							<Icon icon="material-symbols:comment-sharp" class="stat-icon" />
							<span class="text-sm font-medium" style="color: var(--color-base-content);">
								{post.commentCount || 0} Comments
							</span>
						</div>
					</div>
					<button class="btn-secondary btn-small" onclick={() => goto(`/pages/posts/${post.id}`)}>
						Read More
					</button>
				</footer>
			</article>
			{#if index !== posts.length - 1}
				<div class="border-muted sm:hidden"></div>
			{/if}
		{/each}
	{/if}
</section>
