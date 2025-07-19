<script lang="ts">
    const { MAX_FILES, handleFileChange, imagePreviews } = $props<{
        MAX_FILES: number;
        handleFileChange: (event: Event) => void;
        imagePreviews: { file?: File | undefined, url: string }[];
    }>();
</script>

<div>
    <label for="file" class="mb-2 block text-md font-medium" style="color: var(--color-base-content);">
        Images
        <span class="text-xs font-normal" style="color: var(--color-muted);"
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
        class={`
            dropdown-selector w-full transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none
            ${
                imagePreviews.length >= MAX_FILES
                    ? 'pointer-events-none cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
            }
        `}
    />
    {#if imagePreviews.length >= MAX_FILES}
        <p class="mt-1 text-xs" style="color: var(--color-muted);">Maximum number of images reached</p>
    {/if}
</div>