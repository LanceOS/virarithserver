<script lang="ts">
    import { goto } from '$app/navigation';
    import { authClient } from '$lib/auth-client.ts';
    import Header from '$lib/components/landing/Header.svelte';
    import ImagePreview from '$lib/components/forms/ImagePreview.svelte';
    import CategoryClient from '$lib/tools/CategoryClient.ts';
    import PostClient from '$lib/tools/PostClient.ts';
    import { page } from '$app/state';
    import { onMount } from 'svelte';
	import type { ImageWithBuffer } from '$lib/@types/IImage.ts';

    const session = authClient.useSession();
    const postId = page.params.post;

    let title: string = $state('');
    let content: string = $state('');
    let imagePreviews: { file: File; url: string }[] = $state([]);
    let categoryList: string[] = $state([]);
    let selectedCategory: string | null = $state('');
    let isSubmitting: boolean = $state(false);
    let error: string = $state('');

    let isContentFocused = $state(false);
    let isTitleFocused = $state(false);

    const MAX_CONTENT_CHARS = 1200;
    const MAX_TITLE_CHARS = 100;
    const MAX_FILE_SIZE = 9 * 1024 * 1024;
    const MAX_FILES = 3;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    const handleFileChange = (event: Event) => {
        event.preventDefault();
        const inputElement = event.target as HTMLInputElement;
        if (!inputElement || !inputElement.files) return;

        const dataTransfer = new DataTransfer();

        imagePreviews.forEach((preview) => {
            dataTransfer.items.add(preview.file);
        });

        Array.from(inputElement.files).forEach((file) => {
            if (ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
                const isDuplicate = imagePreviews.some(
                    (preview) => preview.file.name === file.name && preview.file.size === file.size
                );
                if (!isDuplicate && dataTransfer.items.length < MAX_FILES) {
                    dataTransfer.items.add(file);
                }
            } else {
                console.warn(`File ${file.name} is invalid (type or size).`);
            }
        });

        inputElement.files = dataTransfer.files;

        imagePreviews = [];
        Array.from(inputElement.files).forEach((file, index) => {
            if (index < MAX_FILES) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target) {
                        imagePreviews = [...imagePreviews, { url: e.target.result as string, file: file }];
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeImage = (index: number) => {
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (!fileInput || !fileInput.files) return;

        const dt = new DataTransfer();

        Array.from(fileInput.files).forEach((file, i) => {
            if (i !== index) {
                dt.items.add(file);
            }
        });

        fileInput.files = dt.files;

        imagePreviews.splice(index, 1);
        imagePreviews = [...imagePreviews];
    };

    const removeAllImages = () => {
        imagePreviews = [];
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';

            if (fileInput.files) {
                fileInput.files = new DataTransfer().files;
            }
        }
    };

    const autoGrow = (event: Event) => {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    const handleContentFocus = () => {
        isContentFocused = true;
    }

    const handleContentBlur = () => {
        if (content.length === 0) {
            isContentFocused = false;
        }
    }

    const handleTitleFocus = () => {
        isTitleFocused = true;
    }

    const handleTitleBlur = () => {
        if (title.length === 0) {
            isTitleFocused = false;
        }
    }

    // Function to strip HTML tags from text
    const stripHtmlTags = (html: string): string => {
        if (!html) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

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
            const postResponse = await PostClient.getPostById(postId);
            let filteredCategories: string[] = [];
            title = stripHtmlTags(postResponse.title);
            content = stripHtmlTags(postResponse.content);
            selectedCategory = postResponse.category;
            if (postResponse.images && postResponse.images.length > 0) {
                imagePreviews = postResponse.images.map((img: ImageWithBuffer, index: number) => ({
                    url: img.url,
                    file: new File([], `existing-image-${index}`, { type: 'image/*' })
                }));
            }

            for (let i = 0; i < response.length; i++) {
                const topic = response[i].topic;

                if (topic === 'updates' || topic === 'announcements' || topic === 'all') {
                    continue;
                }

                filteredCategories.push(response[i].topic);
            }

            categoryList = filteredCategories;
        } catch (err) {
            error = 'Failed to load categories. Please check your connection and try again.';
            console.error('Error loading categories:', err);
        }
        () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    });
</script>

<Header />
<main class="bg-base border-muted mx-auto max-w-7xl px-6 py-8">
    <div class="">
        <div class="mb-8">
            <h1 class="content mb-2 text-3xl font-bold">Edit Post</h1>
            <p class="muted">Update your post content and images.</p>
        </div>

        {#if error}
            <div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
                <p class="text-red-700">{error}</p>
            </div>
        {/if}

        <form method="POST" action="?/submitData" enctype="multipart/form-data" class="space-y-8">
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

            {#if imagePreviews}
                <ImagePreview {imagePreviews} {removeAllImages} {removeImage} maxFiles={MAX_FILES} />
            {/if}

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label for="category" class="content text-md mb-2 block font-medium">
                        Category <span class="color-error">*</span></label
                    >
                    <select
                        id="category"
                        bind:value={selectedCategory}
                        class="input border-muted w-full cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    >
                        <option value="">Select a category</option>
                        {#each categoryList as cat}
                            <option value={cat}>{cat}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label for="file" class="content text-md mb-2 block font-medium">
                        Images
                        <span class="muted text-xs font-normal"
                            >(max {MAX_FILES} images, 3MB each, JPEG/PNG/GIF/WebP)</span
                        >
                    </label>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onchange={handleFileChange}
                        readonly={imagePreviews.length >= MAX_FILES}
                        class={`input border-muted w-full transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none ${
                            imagePreviews.length >= MAX_FILES
                                ? 'pointer-events-none cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                        }`}
                    />
                    {#if imagePreviews.length >= MAX_FILES}
                        <p class="mt-1 text-xs text-gray-500">Maximum number of images reached</p>
                    {/if}
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
                        Updating...
                    </span>
                {:else}
                    Update Post
                {/if}
            </button>
        </form>
    </div>
</main>