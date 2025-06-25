<script lang="ts">
    const { MAX_TITLE_CHARS, currentTitle } = $props<{
        MAX_TITLE_CHARS: number;
        currentTitle?: string;
    }>();

    let title = $state(currentTitle || "");

    $effect(() => {
        title = currentTitle;
    });

    let isTitleFocused = $state(false);

    const handleTitleFocus = () => {
        isTitleFocused = true;
    };

    const handleTitleBlur = () => {
        if (title.length === 0) {
            isTitleFocused = false;
        }
    };
</script>

<div class="relative">
    <label for="title" class="mb-2 block text-md font-medium" style="color: var(--color-base-content);">
        Post Title <span style="color: var(--color-error);">*</span>
    </label>
    <input
        id="title"
        type="text"
        name="title"
        bind:value={title}
        placeholder="Enter your post title..."
        required
        maxlength={MAX_TITLE_CHARS}
        onfocus={handleTitleFocus}
        onblur={handleTitleBlur}
        class={`
            input w-full transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none
            ${title?.length > MAX_TITLE_CHARS ? '!border-[var(--color-error)] !focus:border-[var(--color-error)]' : ''}
        `}
    />
    {#if isTitleFocused || title?.length > 0}
        <div
            class={`
                absolute right-3 bottom-3
                px-2 py-1 text-xs font-medium
                transition-all duration-200
                ${
                    title?.length > MAX_TITLE_CHARS
                        ? 'text-[var(--color-error)]'
                        : title?.length > MAX_TITLE_CHARS * 0.8
                            ? 'text-orange-400'
                            : 'text-[var(--color-muted)]'
                }
            `}
        >
            {title?.length}/{MAX_TITLE_CHARS}
        </div>
    {/if}
</div>