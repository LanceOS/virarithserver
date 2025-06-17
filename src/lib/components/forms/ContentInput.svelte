<script lang="ts">

    const { MAX_CONTENT_CHARS, currentBody } = $props<{
		MAX_CONTENT_CHARS: number;
		currentBody?: string;
	}>()

    let content = $state(currentBody || "")

	$effect(() => {
		content = currentBody
	})

	let isContentFocused = $state(false);

	const autoGrow = (event: Event) => {
		const textarea = event.target as HTMLInputElement;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	};

	const handleContentFocus = () => {
		isContentFocused = true;
	};

	const handleContentBlur = () => {
		if (content.length === 0) {
			isContentFocused = false;
		}
	};
</script>

<div class="relative">
	<label for="content" class="content text-md mb-2 block font-medium">
		Content <span class="color-error">*</span></label
	>
	<textarea
		placeholder="What's on your mind?"
		aria-label="Create your post body"
		class={`
            input w-full resize-none border
            border-transparent transition-all duration-200
            ease-in-out outline-none
            focus:border-[var(--color-primary)]
            ${isContentFocused || content?.length > 0 ? 'min-h-32' : 'min-h-12'}
            ${content?.length > MAX_CONTENT_CHARS ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : ''}
        `}
		bind:value={content}
		onfocus={handleContentFocus}
		onblur={handleContentBlur}
		oninput={autoGrow}
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
										? 'color-error'
										: content?.length > MAX_CONTENT_CHARS * 0.8
											? 'text-orange-400'
											: 'muted'
								}
            `}
		>
			{content?.length}/{MAX_CONTENT_CHARS}
		</div>
	{/if}
</div>
