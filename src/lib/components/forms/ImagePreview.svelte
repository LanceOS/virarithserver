<script lang="ts">
    import type { ImageWithUrl } from '$lib/@types/IImage.ts';
    import Icon from '@iconify/svelte';

    const { imagePreviews, removeAllImages, removeImage, maxFiles } = $props<{
        imagePreviews?: ImageWithUrl[] | { file?: File | undefined; url: string }[];
        maxFiles?: number;
        removeAllImages?: () => void;
        removeImage?: (index: number) => void;
    }>();

    let currentIndex: number = $state(0);

    $effect(() => {
        // Ensure currentIndex is valid after imagePreviews changes (e.g., image deleted)
        if (imagePreviews && currentIndex >= imagePreviews.length) {
            currentIndex = Math.max(0, imagePreviews.length - 1);
        }
    });

    const currentImage = $derived(imagePreviews ? imagePreviews[currentIndex] : undefined);
    const totalImages = $derived(imagePreviews ? imagePreviews.length : 0);
    const currentPage = $derived(currentIndex + 1);

    const goToPrevious = () => {
        if (currentIndex > 0) {
            currentIndex--;
        }
    };

    const goToNext = () => {
        if (imagePreviews && currentIndex < imagePreviews.length - 1) {
            currentIndex++;
        }
    };

    const goToImage = (index: number) => {
        if (imagePreviews && index >= 0 && index < imagePreviews.length) {
            currentIndex = index;
        }
    };

    const handleKeydown = (event: KeyboardEvent) => {
        if (!imagePreviews || imagePreviews.length <= 1) return;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                goToPrevious();
                break;
            case 'ArrowRight':
                event.preventDefault();
                goToNext();
                break;
        }
    };
</script>

<svelte:window onkeydown={handleKeydown} />

<section class="space-y-4"> {#if imagePreviews && imagePreviews.length > 0}
        <div class="flex items-center justify-between">
            {#if removeAllImages}
                <span class="image-preview-info-text">
                    Image Previews ({imagePreviews.length}{#if maxFiles}/{maxFiles}{/if})
                </span>
                <button
                    type="button"
                    onclick={removeAllImages}
                    class="btn-remove-all"
                    aria-label="Remove all images"
                >
                    Remove All
                </button>
            {/if}
        </div>

        <div>
            <div class="group relative overflow-hidden rounded-lg">
                <a class="relative block h-full overflow-hidden" style="aspect-ratio: attr(data-aspect);" href={currentImage?.url} target="_blank">
                    <img
                        src={currentImage?.url}
                        alt="Preview {currentImage?.file ? currentImage?.file.name : 'Image'}"
                        class="h-full w-full max-h-[35rem] object-cover"
                    />
                </a>

                {#if removeImage}
                    <button
                        type="button"
                        onclick={() => removeImage(currentIndex)}
                        class="btn-remove-image group-hover:opacity-100"
                        aria-label="Remove current image"
                    >
                        <Icon icon="mage:multiply" class="iconify" />
                    </button>
                {/if}

                {#if imagePreviews.length > 1}
                    <div class="absolute inset-y-0 left-0 flex items-center">
                        <button
                            type="button"
                            onclick={goToPrevious}
                            disabled={currentIndex === 0}
                            class="image-nav-button ml-3"
                            aria-label="Previous image"
                        >
                            <Icon icon="heroicons:chevron-left" class="iconify" />
                        </button>
                    </div>

                    <div class="absolute inset-y-0 right-0 flex items-center">
                        <button
                            type="button"
                            onclick={goToNext}
                            disabled={currentIndex === imagePreviews.length - 1}
                            class="image-nav-button mr-3"
                            aria-label="Next image"
                        >
                            <Icon icon="heroicons:chevron-right" class="iconify" />
                        </button>
                    </div>
                {/if}

                {#if currentImage?.file}
                    <div
                        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                    >
                        <div style="color: var(--color-base);"> <div class="truncate text-sm font-medium" title={currentImage.file.name}>
                                {currentImage.file.name}
                            </div>
                            <div class="text-xs opacity-90">
                                {(currentImage.file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            {#if imagePreviews.length > 1}
                                <div class="mt-1 text-xs opacity-75">
                                    {currentPage} of {totalImages}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        {#if imagePreviews.length > 1}
            <div class="flex gap-2 overflow-x-auto pb-2">
                {#each imagePreviews as preview, index}
                    <button
                        type="button"
                        onclick={() => goToImage(index)}
                        class="relative flex-shrink-0 cursor-pointer overflow-hidden rounded border-2 transition-all duration-200 {index ===
                        currentIndex
                            ? 'thumbnail-active-border'
                            : 'thumbnail-inactive-border'}"
                        aria-label="Go to image {index + 1}"
                    >
                        <div class="aspect-video w-20 overflow-hidden">
                            <img
                                src={preview.url}
                                alt="Thumbnail {index + 1}"
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <div
                            class="absolute inset-0 bg-black/20 {index === currentIndex
                                ? 'thumbnail-overlay-active'
                                : 'thumbnail-overlay-inactive'} transition-opacity duration-200"
                        ></div>
                    </button>
                {/each}
            </div>
        {/if}
    {/if}
</section>