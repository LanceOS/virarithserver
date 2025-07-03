<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import type { UserSchema } from '$lib/schemas/authentication.ts';
	import PostClient from '$lib/tools/PostClient.ts';
	import Icon from '@iconify/svelte';

	const { post, user } = $props<{
        post: PostWithImage;
        user?: UserSchema
    }>();

	let openPostActions = $state(false);
    let errorLog = $state('')

	const deletePost = async () => {
		openPostActions = false;

		try {
			if (!post) return;

			await PostClient.deletePost(post);

			goto('/pages/forum');
		} catch (error) {
			console.log(error);
			errorLog = 'Failed to delete post';
		}
	};

	const handleClickOutsidePostActions = (event: MouseEvent) => {
		const target = event.target as Element;
		if (
			!target.closest('.actions-menu-container') &&
			!target.closest('.stat-item.actions-button')
		) {
			openPostActions = false;
		}
	};

	$effect(() => {
		if (openPostActions) {
			document.addEventListener('click', handleClickOutsidePostActions);
			return () => {
				document.removeEventListener('click', handleClickOutsidePostActions);
			};
		}
	});
</script>

<button
	class="stat-item actions-button"
	onclick={() => (openPostActions = !openPostActions)}
	aria-label="Post actions"
>
	<Icon icon="ic:outline-more-vert" class="stat-icon" />
</button>
{#if openPostActions}
	<div class="actions-menu-container absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden">
		{#if user}
			<button onclick={() => goto(`/pages/edit_post/${post?.id}`)} class="actions-menu-item">
				<Icon icon="mdi:text-box-edit-outline" />
				<span class="text-sm font-medium">Edit Post</span>
			</button>

			<div class="border-t" style="border-color: var(--color-border-subtle);"></div>

			<button onclick={deletePost} class="actions-menu-item danger">
				<Icon icon="mdi:trash-can-outline" />
				<span class="text-sm font-medium">Delete Post</span>
			</button>
		{/if}
        <button class="actions-menu-item danger">
            <Icon icon="material-symbols:report-outline" />
            <span class="text-sm font-medium">Report</span>
        </button>
	</div>
{/if}
