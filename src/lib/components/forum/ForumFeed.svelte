<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import LikeButton from '../actions/LikeButton.svelte';
	import ImagePreview from '../posts/ImagePreview.svelte';

	let { posts } = $props();

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<section class="flex w-full flex-col gap-4">
	{#if posts}
		{#each posts as post (post.id)}
			<article class="card-setup flex flex-col gap-6 p-4">
				<header class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-4">
						<div class="flex flex-col leading-tight">
							<button
								class="btn-nav text-base font-semibold"
								onclick={() => goto(`/pages/profile/${post.user.id}`)}
							>
								{post.user.name}
							</button>
							<time class="text-xs font-light" datetime={post.createdAt}>
								{formatDate(post.createdAt)}
							</time>
						</div>
						{#if post.isEdited}
							<p class="text-xs">(edited)</p>
						{/if}
					</div>
					<span class="text-sm font-medium">{post.category.toUpperCase()}</span>
				</header>

				<button
					class="flex cursor-pointer flex-col gap-4 text-left"
					onclick={() => goto(`/pages/posts/${post.id}`)}
					type="button"
				>
					<h3 class="text-xl leading-snug font-semibold break-words">
						{@html post.title}
					</h3>
					<p class="text-sm leading-snug break-words">
						{@html post.content.length > 50 ? post.content.slice(0, 256) + '…' : post.content}
					</p>
				</button>

				{#if post.images}
				<div class="-mt-2">
					<ImagePreview imagePreviews={post.images} />
				</div>
				{/if}
				

				<footer class="flex items-center justify-between text-sm">
					<div class="flex items-center gap-4">
						<LikeButton object={post} />
						<span class="stat-item">
							<Icon icon="material-symbols:comment-sharp" class="text-xl duration-200 sm:text-xl" />
							{post.commentCount || 0} Comments
						</span>
					</div>
					<button class="read-more-btn" onclick={() => goto(`/pages/posts/${post.id}`)}>
						Read More
					</button>
				</footer>
			</article>
		{/each}
	{/if}
</section>
