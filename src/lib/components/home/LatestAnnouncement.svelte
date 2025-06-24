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
    <h1 class="text-xl sm:text-2xl">Latest Announcement:</h1>

    {#if isLoadingPost}
        <section class="flex flex-1 flex-col items-center justify-center gap-2">
            <Icon icon="svg-spinners:blocks-shuffle-3" class="text-3xl sm:text-4xl" />
            <p class="text-muted text-sm sm:text-base">Loading post...</p>
        </section>
    {:else if latestAnnouncement}
        <article class="card-setup flex flex-col md:flex-row gap-4 p-3 sm:gap-6 sm:p-4 items-start">
            <div class="flex flex-col items-center gap-3">
                {#if latestAnnouncement.user.image}
                    <div class="user-avatar w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <img src={latestAnnouncement.user.image} alt="User Avatar" class="rounded-full object-cover w-full h-full"/>
                    </div>
                {/if}
                <div class="flex flex-col items-center leading-tight text-center">
                    <button
                        class="btn-nav text-sm sm:text-base font-semibold"
                        onclick={() => goto(`/pages/profile/${latestAnnouncement?.user.id}`)}
                    >
                        {latestAnnouncement.user.name}
                    </button>
                    <RoleCard role={latestAnnouncement.user.role}/>
                    <time class="text-xs font-light" datetime={formatDate(latestAnnouncement.createdAt)}>
                        {formatDate(latestAnnouncement.createdAt)}
                    </time>
                    {#if latestAnnouncement.isEdited}
                        <p class="text-xs">(edited)</p>
                    {/if}
                </div>
            </div>

            <div class="flex flex-col gap-2 flex-1 min-w-0">
                <header class="flex flex-wrap items-center justify-between gap-2">
                    <button
                        class="flex-1 cursor-pointer text-left min-w-0"
                        onclick={() => goto(`/pages/posts/${latestAnnouncement?.id}`)}
                        type="button"
                    >
                        <h3 class="text-lg sm:text-xl leading-snug font-semibold break-words truncate">
                            {@html latestAnnouncement.title}
                        </h3>
                    </button>
                    <span class="text-xs sm:text-sm font-medium flex-shrink-0">{latestAnnouncement.category.toUpperCase()}</span>
                </header>

                <p class="text-xs sm:text-sm leading-snug break-words line-clamp-3">
                    {@html latestAnnouncement.content.length > 50 ? latestAnnouncement.content.slice(0, 400) + '…' : latestAnnouncement.content}
                </p>

                {#if latestAnnouncement.images && latestAnnouncement.images.length > 0}
                    <div class="mt-2 -mb-2">
                        <ImagePreview imagePreviews={latestAnnouncement.images} />
                    </div>
                {/if}

                <footer class="flex flex-wrap gap-3 sm:gap-4 items-center justify-between text-sm mt-auto pt-2">
                    <div class="flex items-center gap-3 sm:gap-4">
                        <LikeButton object={latestAnnouncement} />
                        <div class="stat-item flex items-center gap-1">
                            <Icon icon="material-symbols:comment-sharp" class="stat-icon text-base sm:text-xl" />
                            <span class="text-xs sm:text-sm font-medium">
                                {latestAnnouncement.commentCount || 0} Comments
                            </span>
                        </div>
                    </div>
                    <button class="read-more-btn px-3 py-1.5 text-xs sm:text-sm" onclick={() => goto(`/pages/posts/${latestAnnouncement?.id}`)}>
                        Read More
                    </button>
                </footer>
            </div>
        </article>
    {:else}
        <section class="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
            <Icon icon="material-symbols:error-outline" class="text-2xl sm:text-3xl text-red-500" />
            <p class="text-center text-red-500 text-sm sm:text-base">Post not found or could not be loaded</p>
            <button
                class="btn-big rounded bg-blue-500 px-3 py-1.5 text-sm hover:bg-blue-600"
                onclick={() => window.location.reload()}
            >
                Try Again
            </button>
        </section>
    {/if}
</section>