<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
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

<section class="flex w-full flex-col">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each posts as post (post.id)}
			<article class="card-setup flex flex-col gap-2 p-4">
				<header class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2">
						<!-- avatar placeholder -->
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
					</div>
					<span class="text-sm font-medium">{post.category.toUpperCase()}</span>
				</header>

				<div class="flex flex-col gap-1">
					<h3 class="btn-nav text-xl leading-snug font-semibold">
						<a href="/pages/posts/{post.id}">{post.title}</a>
					</h3>
					<p class="text-sm leading-snug">
						{post.content.length > 50 ? post.content.slice(0, 50) + '…' : post.content}
					</p>
				</div>

				<footer class="flex items-center justify-between text-sm">
					<div class="flex items-center gap-4">
						<button class="stat-item">
							<Icon
								icon="material-symbols:thumb-up"
								class="text-xl duration-200 active:text-blue-400 sm:text-xl"
							/>
							{post.likesCount || 0} Likes
						</button>
						<span class="stat-item">
							<Icon
								icon="material-symbols:comment-sharp"
								class="text-xl duration-200 sm:text-xl"
							/>
							{post.commentsCount || 0} Comments
						</span>
					</div>
				</footer>
			</article>
		{/each}
	</div>
</section>
