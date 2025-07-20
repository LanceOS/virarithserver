<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import ImagePreview from '../forms/ImagePreview.svelte';
	import { toast } from '@zerodevx/svelte-toast';

	let { posts } = $props<{
		posts: PostWithImage[] | undefined;
	}>();

	let loading: boolean = $state(false)

	function formatDate(dateString: Date) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const archivePost = async (post: PostWithImage) => {
		const data = {
			objectId: post.id,
			objectType: post.type
		};
			
		loading = true;

		try {
			await fetch('/admin/reported_feed/archive', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			window.location.reload();
		} catch (error: any) {
			toast.push(error.message);
		}
		finally {
			loading = false;
		}
	};

	const reinstatePost = async (post: PostWithImage) => {
		const data = {
			objectId: post.id,
			objectType: post.type
		};

		loading = true;

		try {
			await fetch('/admin/reported_feed/reinstate', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			window.location.reload();
		} catch (error: any) {
			toast.push(error.message);
		}
		finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col gap-6">
{#if posts}
	{#each posts as post, index (post.id)}
		<article class="sm:card-setup flex flex-col gap-6">
			<header class="flex flex-col gap-4">
				<div class="flex items-center gap-2">
					{#if post.user?.image}
						<div class="user-avatar flex-shrink-0">
							<img
								src={post.user?.image}
								alt={post.user?.name || 'User avatar'}
								class="h-10 w-10 rounded-full object-cover"
							/>
						</div>
					{/if}
					<div class="flex flex-col leading-tight">
						<a
							class="btn-nav font-semibold"
							style="color: var(--color-base-content)"
							href={`/pages/profile/${post.user?.id}`}
						>
							{post.user?.name}
						</a>

						<time
							class="text-sm font-light"
							datetime={post.createdAt}
							style="color: var(--color-muted);"
						>
							{formatDate(post.createdAt)}
						</time>
					</div>
				</div>

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
					<div class="mx-auto -mt-2">
						<ImagePreview imagePreviews={post.images} />
					</div>
				{/if}
			</header>

			<div class="flex items-center gap-12">
				<button type="button" class="btn-small" onclick={() => reinstatePost(post)} disabled={loading}
					>Reinstate</button
				>
				<button type="button" class="btn-delete" onclick={() => archivePost(post)} disabled={loading}>Archive</button>
			</div>
		</article>
		{#if index !== posts.length - 1}
			<div class="border-muted sm:hidden"></div>
		{/if}
	{/each}
{/if}
</div>