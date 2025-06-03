<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import Icon from '@iconify/svelte';
	import ErrorModal from '../Popups/ErrorModal.svelte';
	import type { PostSchema } from '$lib/schemas/Posts.ts';
	import LikeClient from '$lib/tools/LikeClient.ts';

	const session = authClient.useSession();

	let { posts } = $props();


	let errorLog = $state('');
	let sendingLike = $state(false);

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const likePost = async (id: string) => {
		if (!$session.data?.user) {
			setError();
			return;
		}

		const user = $session.data.user;
		sendingLike = true;

		const postToUpdate = posts.find((post: PostSchema) => post.id === id);
		const wasLiked = postToUpdate.isLiked;

		try {
			if (wasLiked) {
				await LikeClient.unlikeObject({ userId: user.id, postId: postToUpdate.id });
			} else {
				await LikeClient.likeObject({ userId: user.id, postId: postToUpdate.id });
			}

			posts = posts.map((post: any) => {
				if (post.id === id) {
					return {
						...post,
						isLiked: !wasLiked,
						likeCount: wasLiked ? post.likeCount - 1 : post.likeCount + 1
					};
				}
				return post;
			});
		} catch (error) {
			errorLog = "Failed to like post"
		} finally {
			sendingLike = false;
		}
	};

	const setError = () => {
		errorLog = 'Must log in to like.';
		sendingLike = true;
		setTimeout(() => {
			errorLog = '';
			sendingLike = false;
		}, 2000);
	};
</script>

{#if errorLog}
	<ErrorModal {errorLog} />
{/if}
<section class="flex w-full flex-col gap-4">
	{#each posts as post (post.id)}
		<article class="card-setup flex flex-col gap-4 p-4">
			<header class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2">
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

			<button
				class="flex cursor-pointer flex-col gap-1 text-left"
				onclick={() => goto(`/pages/posts/${post.id}`)}
				type="button"
			>
				<h3 class="text-xl leading-snug font-semibold">
					{@html post.title}
				</h3>
				<p class="text-sm leading-snug">
					{@html post.content.length > 50 ? post.content.slice(0, 150) + '…' : post.content}
				</p>
			</button>

			<footer class="flex items-center justify-between text-sm">
				<div class="flex items-center gap-4">
					<button class="stat-item" onclick={() => likePost(post.id)} disabled={sendingLike}>
						<Icon
							icon="material-symbols:thumb-up"
							class={`text-xl duration-200 sm:text-xl ${post.isLiked ? 'text-green-400' : ''}`}
						/>
						{post.likeCount || 0} Likes
					</button>
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
</section>
