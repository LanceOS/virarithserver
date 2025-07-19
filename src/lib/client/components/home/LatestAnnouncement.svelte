<script lang="ts">
    import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
    import PostClient from '$lib/client/tools/PostClient.client.ts';
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    import LikeButton from '../actions/LikeButton.svelte';
    import { goto } from '$app/navigation';
    import RoleCard from '../cards/RoleCard.svelte';
	import { toast } from '@zerodevx/svelte-toast';

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
        } catch (error: any) {
            toast.push(error.message)
        } finally {
            isLoadingPost = false;
        }
    });
</script>

<section class="flex h-full w-full flex-col gap-4">
    <h1 class="text-xl sm:text-2xl" style="color: var(--color-base-content);">Latest Announcement:</h1>

    {#if isLoadingPost}
        <section class="flex flex-1 flex-col items-center justify-center gap-2">
            <Icon icon="svg-spinners:blocks-shuffle-3" class="pagination-spinner-icon text-3xl sm:text-4xl" style="color: var(--color-muted);" />
            <p class="text-sm sm:text-base" style="color: var(--color-muted);">Loading ...</p>
        </section>
    {:else if latestAnnouncement}
        <article class="card-setup flex flex-col gap-4 p-6">
            <header class="relative flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                    {#if latestAnnouncement.user.image}
                        <div class="user-avatar">
                            <img src={latestAnnouncement.user.image} alt={latestAnnouncement.user.name || 'User avatar'} />
                        </div>
                    {/if}
                    <div class="flex flex-col">
                        <button
                            class="btn-nav font-semibold sm:text-lg"
                            onclick={() => goto(`/pages/profile/${latestAnnouncement?.user.id}`)}
                        >
                            {latestAnnouncement.user.name}
                        </button>
                        <time class="text-xs font-light sm:text-sm" datetime={formatDate(latestAnnouncement.createdAt)} style="color: var(--color-muted);">
                            {formatDate(latestAnnouncement.createdAt)}
                        </time>
                    </div>
                    <RoleCard role={latestAnnouncement.user.role} />
                    {#if latestAnnouncement.isEdited}
                        <p class="text-xs" style="color: var(--color-muted);">(edited)</p>
                    {/if}
                </div>
                </header>

            <div class="mb-1 flex flex-col gap-1">
                <h1 class="text-lg sm:text-2xl" style="color: var(--color-base-content);">
                    {@html latestAnnouncement.title}
                </h1>
                <p class="space-y-4 text-sm break-words sm:text-base" style="color: var(--color-base-content);">
                    {@html latestAnnouncement.content}
                </p>
            </div>

            <footer class="flex justify-between">
                <div class="flex items-center gap-4">
                    <LikeButton object={latestAnnouncement} />
                    <span class="stat-item">
                        <Icon
                            icon="material-symbols:comment-sharp"
                            class="stat-icon"
                            style="color: var(--color-muted);"
                        />
                        <span class="text-sm font-medium" style="color: var(--color-base-content);">
                            {latestAnnouncement.commentCount || 0} Comments
                        </span>
                    </span>
                </div>
                </footer>
        </article>
    {:else}
        <section class="card-setup flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <Icon icon="material-symbols:error-outline" class="text-2xl sm:text-3xl" style="color: var(--color-error);" />
            <p class="text-center text-sm sm:text-base" style="color: var(--color-error);">
                Announcement not found or could not be loaded
            </p>
            <button
                class="btn-primary btn-medium"
                onclick={() => window.location.reload()}
            >
                Try Again
            </button>
        </section>
    {/if}
</section>