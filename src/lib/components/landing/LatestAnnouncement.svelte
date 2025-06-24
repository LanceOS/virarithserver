<script lang="ts">
	import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import PostClient from '$lib/tools/PostClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import ImagePreview from '../forms/ImagePreview.svelte';
	import LikeButton from '../actions/LikeButton.svelte';
	import { goto } from '$app/navigation';
	import RoleCard from '../cards/RoleCard.svelte';

	let latestAnnouncement: PostWithImage | undefined = $state();
	let isLoadingPost = $state(false);

	function formatDate(date: Date | string) {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	onMount(async () => {
		isLoadingPost = true;
		try {
			latestAnnouncement = await PostClient.getLatestAnnouncementPost();
		} catch (error) {
			console.error(error);
		} finally {
			isLoadingPost = false;
		}
	});
</script>

<section class="flex h-full w-full flex-col gap-4">
	<h1 class="text-2xl">Latest Announcement:</h1>

	{#if isLoadingPost}
		<section class="flex flex-1 flex-col items-center justify-center gap-2">
			<Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl" />
			<p class="text-muted">Loading post...</p>
		</section>
	{:else if latestAnnouncement}
	<article class="card-setup flex flex-col gap-6 p-4">
		<header class="flex items-center justify-between gap-2">
			<div class="flex items-center gap-2">
				{#if latestAnnouncement.user.image}
				<div class="user-avatar">
					<img src={latestAnnouncement.user.image} alt=""/>
				</div>
				{/if}
				<div class="flex flex-col leading-tight">
					<button
						class="btn-nav text-base font-semibold"
						onclick={() => goto(`/pages/profile/${latestAnnouncement?.user.id}`)}
					>
						{latestAnnouncement.user.name}
					</button>
					<time class="text-xs font-light" datetime={formatDate(latestAnnouncement.createdAt)}>
						{formatDate(latestAnnouncement.createdAt)}
					</time>
				</div>
				<RoleCard role={latestAnnouncement.user.role}/>
				{#if latestAnnouncement.isEdited}
					<p class="text-xs">(edited)</p>
				{/if}
			</div>
			<span class="text-sm font-medium">{latestAnnouncement.category.toUpperCase()}</span>
		</header>

		<button
			class="flex cursor-pointer flex-col gap-1 text-left"
			onclick={() => goto(`/pages/posts/${latestAnnouncement?.id}`)}
			type="button"
		>
			<h3 class="text-xl leading-snug font-semibold break-words">
				{@html latestAnnouncement.title}
			</h3>
			<p class="text-sm leading-snug break-words">
				{@html latestAnnouncement.content.length > 50 ? latestAnnouncement.content.slice(0, 350) + '…' : latestAnnouncement.content}
			</p>
		</button>

		{#if latestAnnouncement.images}
			<div class="-mt-2">
				<ImagePreview imagePreviews={latestAnnouncement.images} />
			</div>
		{/if}

		<footer class="flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-sm">
			<div class="flex items-center gap-4">
				<LikeButton object={latestAnnouncement} />
				<div class="stat-item">
					<Icon icon="material-symbols:comment-sharp" class="stat-icon" />
					<span class="text-sm font-medium">
						{latestAnnouncement.commentCount || 0} Comments
					</span>
				</div>
			</div>
			<button class="read-more-btn" onclick={() => goto(`/pages/posts/${latestAnnouncement?.id}`)}>
				Read More
			</button>
		</footer>
	</article>
	{:else}
		<section class="flex flex-1 flex-col items-center justify-center gap-2">
			<Icon icon="material-symbols:error-outline" class="text-3xl text-red-500" />
			<p class="text-center text-red-500">Post not found or could not be loaded</p>
			<button
				class="btn-big rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
				onclick={() => window.location.reload()}
			>
				Try Again
			</button>
		</section>
	{/if}
</section>
