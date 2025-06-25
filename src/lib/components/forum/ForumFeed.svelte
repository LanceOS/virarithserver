<script lang="ts">
    import { goto } from '$app/navigation';
    import Icon from '@iconify/svelte';
    import LikeButton from '../actions/LikeButton.svelte';
    import ImagePreview from '../forms/ImagePreview.svelte';
    import RoleCard from '../cards/RoleCard.svelte';

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
                    <div class="flex items-center gap-2">
                        {#if post.user.image && post.user.image !== 'placeholder'}
                            <div class="user-avatar">
                                <img src={post.user.image} alt={post.user.name || 'User avatar'} />
                            </div>
                        {/if}
                        <div class="flex flex-col leading-tight">
                            <button
                                class="btn-nav text-base font-semibold"
                                onclick={() => goto(`/pages/profile/${post.user.id}`)}
                            >
                                {post.user.name}
                            </button>
                            <time class="text-xs font-light" datetime={post.createdAt} style="color: var(--color-muted);">
                                {formatDate(post.createdAt)}
                            </time>
                        </div>
                        <RoleCard role={post.user.role} />
                        {#if post.isEdited}
                            <p class="text-xs" style="color: var(--color-muted);">(edited)</p>
                        {/if}
                    </div>
                    <span class="text-sm font-medium" style="color: var(--color-text-secondary);">{post.category.toUpperCase()}</span>
                </header>

                <button
                    class="flex cursor-pointer flex-col gap-1 text-left"
                    onclick={() => goto(`/pages/posts/${post.id}`)}
                    type="button"
                >
                    <h3 class="text-xl leading-snug font-semibold break-words" style="color: var(--color-base-content);">
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
        {/each}
    {/if}
</section>