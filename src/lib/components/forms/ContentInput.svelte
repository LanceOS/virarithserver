<script lang="ts">
    const { MAX_CONTENT_CHARS, currentBody } = $props<{
        MAX_CONTENT_CHARS: number;
        currentBody?: string;
    }>();

    let content = $state(currentBody || "");


    const autoGrow = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    let isContentFocused = $state(false);
    let contentRef: HTMLTextAreaElement;

    $effect(() => {
        content = currentBody || "";
        if (contentRef) {
            autoGrow(contentRef);
        }
    });

    const handleContentFocus = (event: FocusEvent) => {
        isContentFocused = true;
        if (contentRef) {
            autoGrow(contentRef);
        }
    };

    const handleContentBlur = () => {
        if (content.length === 0) {
            isContentFocused = false;
        }
    };

    const handleContentInput = (event: Event) => {
        autoGrow(event.target as HTMLTextAreaElement);
    };

    $effect(() => {
        if (contentRef) {
            autoGrow(contentRef);
        }
    });
</script>

<div class="relative">
    <label for="content" class="mb-2 block text-md font-medium" style="color: var(--color-base-content);">
        Content <span style="color: var(--color-error);">*</span>
    </label>
    <textarea
        placeholder="What's on your mind?"
        aria-label="Create your post body"
        class={`
            input w-full resize-none
            transition-all duration-200 ease-in-out
            ${isContentFocused || content?.length > 0 ? 'min-h-32' : 'min-h-12'}
            ${content?.length > MAX_CONTENT_CHARS ? '!border-[var(--color-error)] !focus:border-[var(--color-error)]' : ''}
        `}
        bind:value={content}
        bind:this={contentRef}
        onfocus={handleContentFocus}
        onblur={handleContentBlur}
        oninput={handleContentInput}
        maxlength={MAX_CONTENT_CHARS}
        id="content"
        name="content"
        required
    >
    </textarea>

    {#if isContentFocused || content?.length > 0}
        <div
            class={`
                absolute right-3 bottom-3
                px-2 py-1 text-xs font-medium
                transition-all duration-200
                ${
                    content?.length > MAX_CONTENT_CHARS
                        ? 'text-[var(--color-error)]'
                        : content?.length > MAX_CONTENT_CHARS * 0.8
                            ? 'text-orange-400'
                            : 'text-[var(--color-muted)]'
                }
            `}
        >
            {content?.length}/{MAX_CONTENT_CHARS}
        </div>
    {/if}
</div>