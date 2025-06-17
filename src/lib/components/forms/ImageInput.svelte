<script lang="ts">
    const { MAX_FILES, handleFileChange, imagePreviews } = $props<{
        MAX_FILES: number;
        handleFileChange: (event: Event) => void;
        imagePreviews: { file?: File | undefined, url: string }[];
    }>();
</script>

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