<script lang="ts">

    const { MAX_TITLE_CHARS } = $props();

    let title = $state("")

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
	<label for="title" class="content text-md mb-2 block font-medium">
		Post Title <span class="color-error">*</span></label
	>
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
		class="input border-muted w-full transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
	/>
	{#if isTitleFocused || title.length > 0}
		<div
			class={`
                absolute right-3 bottom-3
                px-2 py-1 text-xs font-medium
                transition-all duration-200
                ${
									title.length > MAX_TITLE_CHARS
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
