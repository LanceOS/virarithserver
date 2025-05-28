<script lang="ts">
	import { goto } from '$app/navigation';

	let { posts } = $props();


	// Formatted date
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#snippet Feed(data)}
	{#each data as post (post.id)}
		<article class="card-setup flex flex-col gap-4 p-8">
			<header class="flex items-center justify-between gap-4">
				<div class="flex items-center">
					<!-- <img 
		  src={post.avatar} 
		  alt="{post.author}'s avatar"
		  class="avatar"
		  loading="lazy"
		/> -->
					<div class="flex flex-col gap-[0.25rem]">
						<button class="text-lg font-semibold btn-nav" onclick={() => goto(`/pages/profile/${post.user.id}`)}>{post.user.name}</button>
						<time class="text-xs font-light" datetime={post.createdAt}>
							{formatDate(post.createdAt)}
						</time>
					</div>
				</div>
				<span class="text-md">{post.category}</span>
			</header>

			<div class="mb-2 flex flex-col gap-2">
				<h3 class="text-2xl btn-nav">
					<a href="/pages/posts/{post.id}">
						{post.title}
					</a>
				</h3>
				<p class="text-md">{post.content}</p>
			</div>

			<footer class="flex justify-between">
				<div class="flex items-center gap-4">
					<span class="stat-item">
						<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
							/>
						</svg>
						{post.likesCount || 0}
					</span>
					<span class="stat-item">
						<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						</svg>
						{post.commentsCount || 0}
					</span>
				</div>
				<button
					class="read-more-btn"
					aria-label="Read more about {post.title}"
					onclick={() => goto(`/pages/posts/${post.id}`)}
				>
					Read More
					<svg class="w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>
			</footer>
		</article>
	{/each}
{/snippet}

<section class="flex flex-col w-full">
	<div>
		
	</div>
	<div class="flex flex-col gap-6">
		{@render Feed(posts)}
	</div>
</section>