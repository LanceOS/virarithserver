<script lang="ts">
    import { goto } from '$app/navigation';
    import type { IPagination, PostWithImage } from '$lib/@types/IPostSerializer.ts';
    import { authClient } from '$lib/auth-client.ts';
    import CategoryFilter from '$lib/components/forms/CategoryFilter.svelte';
    import Filter from '$lib/components/forum/Filter.svelte';
    import ForumFeed from '$lib/components/forum/ForumFeed.svelte';
    import Pagination from '$lib/components/forum/Pagination.svelte';
    import Header from '$lib/components/landing/Header.svelte';
    import PostClient from '$lib/tools/PostClient.ts';
    import CategoryClient from '$lib/tools/CategoryClient.ts';
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte'; // Import Icon for loading/error states

    let isInitialLoading = $state(true);
    let isPaginationLoading = $state(false);
    let errorLog = $state<string | null>(null);

    const session = authClient.useSession();

    let posts: PostWithImage[] | undefined = $state();
    let pagination: IPagination | undefined = $state();
    let categoryList: any = $state(); 
    let selectedCategory: string = $state('all');
    let orderBy: string = $state('desc');

    const changeOrder = async (order: string) => {
        if (orderBy === order.toLocaleLowerCase()) return;
        orderBy = order.toLocaleLowerCase();
        await fetchPosts(1);
    };

    const changeCategory = async (selected: string) => {
        if (selectedCategory === selected) return; 
        selectedCategory = selected;
        await fetchPosts(1); 
    };

    const fetchPosts = async (page: number) => {
        isPaginationLoading = true;
        errorLog = null; // Clear previous errors
        try {
            let response;
            if (selectedCategory !== 'all') {
                response = await PostClient.getPostsByCategory(
                    orderBy,
                    selectedCategory.toLocaleLowerCase(),
                    page
                );
            } else {
                response = await PostClient.getAllPosts(orderBy, page);
            }
            posts = response.posts;
            pagination = response.pagination;
        } catch (error) {
            console.error('Error loading posts:', error);
            errorLog = 'Failed to load posts. Please check your connection and try again.';
            posts = []; 
            pagination = undefined; 
        } finally {
            isPaginationLoading = false;
        }
    };

    const incrementPage = async () => {
        if (!pagination || pagination.currentPage >= pagination.totalPages) {
            return;
        }
        await fetchPosts(pagination.currentPage + 1);
    };

    const decrementPage = async () => {
        if (!pagination || pagination.currentPage <= 1) {
            return;
        }
        await fetchPosts(pagination.currentPage - 1);
    };

    const retryLoading = async () => {
        isInitialLoading = true;
        errorLog = null;
        try {
            const postResponse = await PostClient.getAllPosts(orderBy, 1);
            posts = postResponse.posts;
            pagination = postResponse.pagination;
        } catch (error) {
            errorLog = 'Failed to load posts. Please check your connection and try again.';
            console.error('Error loading posts:', error);
        } finally {
            isInitialLoading = false;
        }
    };

    onMount(async () => {
        try {
            const [postResponse, categoryResponse] = await Promise.all([
                PostClient.getAllPosts(orderBy, 1),
                CategoryClient.getCategories()
            ]);
            categoryList = categoryResponse;
            posts = postResponse.posts;
            pagination = postResponse.pagination;
        } catch (error) {
            errorLog = 'Failed to load forum content. Please check your connection and try again.';
            console.error('Error loading forum content:', error);
        } finally {
            isInitialLoading = false;
        }
    });
</script>

<Header />
<main class="mx-auto max-w-7xl px-4 py-8">
    <section class="mb-8 pb-6 card-border-subtle border-b">
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-semibold" style="color: var(--color-base-content);">Forums</h1>
                <p class="font-regular" style="color: var(--color-text-secondary);">Discuss the latest and greatest happening on Virarith!</p>
            </div>
            {#if $session.data?.user}
                <button class="btn-primary btn-medium" onclick={() => goto('/pages/create_post')}>
                    Create Post
                </button>
            {/if}
        </div>
    </section>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside class="lg:col-span-1">
            <div class="card-setup p-6 sticky top-6"> <h2 class="mb-2 text-lg font-medium" style="color: var(--color-base-content);">Categories</h2>
                {#if categoryList}
                    <CategoryFilter {categoryList} {changeCategory} {selectedCategory} />
                {:else if !isInitialLoading}
                    <p class="text-sm" style="color: var(--color-muted);">Could not load categories.</p>
                    <button class="btn-secondary btn-small mt-2" onclick={retryLoading}>Retry Categories</button>
                {/if}
            </div>
        </aside>

        <div class="lg:col-span-3">
            {#if isInitialLoading}
                <section class="flex flex-col items-center justify-center gap-2 h-64">
                    <Icon icon="svg-spinners:blocks-shuffle-3" class="pagination-spinner-icon text-4xl" style="color: var(--color-primary);" />
                    <p class="text-base" style="color: var(--color-muted);">Loading forum posts...</p>
                </section>
            {:else if errorLog}
                <section class="card-setup flex flex-col items-center justify-center gap-4 p-8 text-center min-h-64">
                    <Icon icon="material-symbols:error-outline" class="text-5xl" style="color: var(--color-error);" />
                    <p class="text-base font-medium" style="color: var(--color-error);">{errorLog}</p>
                    <button class="btn-primary btn-medium" onclick={retryLoading}>Try Again</button>
                </section>
            {:else if posts && posts.length > 0}
                <div class="mb-4 flex items-center justify-end">
                    <Filter {changeOrder} />
                </div>
                <ForumFeed {posts} />

                {#if pagination && pagination.totalPages > 1}
                    <div class="mt-8 flex justify-center">
                        <Pagination {pagination} {incrementPage} {decrementPage} {isPaginationLoading} />
                    </div>
                {/if}
            {:else}
                <section class="card-setup flex flex-col items-center justify-center gap-4 p-8 text-center min-h-64">
                    <Icon icon="material-symbols:info-outline" class="text-5xl" style="color: var(--color-muted);" />
                    <p class="text-base" style="color: var(--color-base-content);">No posts found. Be the first to create one!</p>
                    {#if $session.data?.user}
                        <button class="btn-primary btn-medium" onclick={() => goto('/pages/create_post')}>
                            Create Post
                        </button>
                    {/if}
                </section>
            {/if}
        </div>
    </div>
</main>