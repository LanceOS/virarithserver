<script lang="ts">
    import { goto } from '$app/navigation';
    import { authClient } from '$lib/auth-client.ts';
    import Header from '$lib/components/landing/Header.svelte';
    import CategoryClient from '$lib/tools/CategoryClient.ts';
    import PostClient from '$lib/tools/PostClient.ts';
    import { onMount } from 'svelte';

    const session = authClient.useSession();

    let title: string = $state('');
    let content: string = $state('');
    let categoryList: any = $state([]);
    let selectedCategory: string | null = $state('');
    let isSubmitting: boolean = $state(false);
    let error: string = $state('');

    let isContentFocused = $state(false);
    let isTitleFocused = $state(false);

    const MAX_CONTENT_CHARS = 600;
    const MAX_TITLE_CHARS = 100;
    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        if (!selectedCategory) {
            console.log('Failed to get selected category');
            return;
        }
        if (!$session.data?.user.id) {
            goto('/pages/login');
            return;
        }

        isSubmitting = true;

        const postData = {
            title: title,
            content: content,
            category: selectedCategory,
            userId: $session.data.user.id
        };

        try {
            const response = await PostClient.createPost(postData);
            return response;
        } catch (error: any) {
            if (!error) {
                console.error('Failed to get error and submit post');
            }
            error = error.message;
            return 'Error';
        } finally {
            isSubmitting = false;
            goto('/pages/forum');
        }
    };

    function autoGrow(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function handleContentFocus() {
        isContentFocused = true;
    }

    function handleContentBlur() {
        if (content.length === 0) {
            isContentFocused = false;
        }
    }

    // New focus/blur handlers for the title input
    function handleTitleFocus() {
        isTitleFocused = true;
    }

    function handleTitleBlur() {
        if (title.length === 0) {
            isTitleFocused = false;
        }
    }

    /**
     * @return Grabbing all available topics from the database. Removing topics that include "update", "announcement",
     * and "all", as those are specifically reserved for admins only.
     */
    onMount(async () => {
        if (!$session.data?.user) {
            goto('/pages/forum');
        }

        try {
            const response = await CategoryClient.getCategories();
            let filteredCategories: string[] = [];

            for (let i = 0; i < response.length; i++) {
                const topic = response[i].topic;

                if (topic === 'Updates' || topic === 'Announcements' || topic === 'All') {
                    continue;
                }

                filteredCategories.push(response[i].topic);
            }

            categoryList = filteredCategories;
        } catch (err) {
            error = 'Failed to load categories. Please check your connection and try again.';
            console.error('Error loading categories:', err);
        }
    });
</script>

<Header />
<main class="bg-base border-muted mx-auto max-w-7xl px-6 py-8">
    <div class="">
        <div class="animate-fade-up mb-8">
            <h1 class="content mb-2 text-3xl font-bold">Create New Post</h1>
            <p class="muted">Share your thoughts or ask questions about Virarith.</p>
        </div>

        {#if error}
            <div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
                <p class="text-red-700">{error}</p>
            </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-8">
            <div class="relative">
                <label for="title" class="content text-md mb-2 block font-medium">
                    Post Title <span class="color-error">*</span></label
                >
                <input
                    id="title"
                    type="text"
                    bind:value={title}
                    placeholder="Enter your post title..."
                    required
                    maxlength={MAX_TITLE_CHARS}
                    onfocus={handleTitleFocus}
                    onblur={handleTitleBlur}
                    class="input border-muted w-full transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none
                    {$session.data?.user ? '' : 'disabled:cursor-not-allowed disabled:opacity-50'}"
                />
                {#if isTitleFocused || title.length > 0}
                    <div
                        class={`
                            absolute bottom-3 right-3
                            px-2 py-1 text-xs font-medium
                            transition-all duration-200
                            ${title.length > MAX_TITLE_CHARS
                                ? 'color-error'
                                : title.length > MAX_TITLE_CHARS * 0.8
                                    ? 'text-orange-400'
                                    : 'muted'
                            }
                        `}
                    >
                        {title.length}/{MAX_TITLE_CHARS}
                    </div>
                {/if}
            </div>

            <div class="relative">
                <label for="content" class="content text-md mb-2 block font-medium">
                    Content <span class="color-error">*</span></label
                >
                <textarea
                    placeholder="What's on your mind?"
                    aria-label="Create your post body"
                    class={`
                        input w-full resize-none outline-none
                        transition-all duration-200 ease-in-out
                        border border-transparent
                        focus:border-[var(--color-primary)]
                        ${isContentFocused || content.length > 0 ? 'min-h-32' : 'min-h-12'}
                        ${content.length > MAX_CONTENT_CHARS ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : ''}
                    `}
                    bind:value={content}
                    onfocus={handleContentFocus}
                    onblur={handleContentBlur}
                    oninput={autoGrow}
                    maxlength={MAX_CONTENT_CHARS}
                    id="content"
                >
                </textarea>

                {#if isContentFocused || content.length > 0}
                    <div
                        class={`
                            absolute bottom-3 right-3
                            px-2 py-1 text-xs font-medium
                            transition-all duration-200
                            ${content.length > MAX_CONTENT_CHARS
                                ? 'color-error'
                                : content.length > MAX_CONTENT_CHARS * 0.8
                                    ? 'text-orange-400'
                                    : 'muted'
                            }
                        `}
                    >
                        {content.length}/{MAX_CONTENT_CHARS}
                    </div>
                {/if}
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label for="category" class="content text-md mb-2 block font-medium">
                        Category <span class="color-error">*</span></label
                    >
                    <select
                        id="category"
                        bind:value={selectedCategory}
                        class="input border-muted w-full transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    >
                        <option value="">Select a category</option>
                        {#each categoryList as cat}
                            <option value={cat}>{cat}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim() || title.length > MAX_TITLE_CHARS || content.length > MAX_CONTENT_CHARS}
                class="btn-big flex flex-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
                {#if isSubmitting}
                    <span class="flex items-center justify-center">
                        <svg
                            class="mr-2 -ml-1 h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Publishing...
                    </span>
                {:else}
                    Create Post
                {/if}
            </button>
        </form>
    </div>
</main>