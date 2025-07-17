<script lang="ts">
	import CommentClient from "$lib/client/CommentClient.client.ts";


    const { cancelEdit, comment, commentFeedUpdate } = $props()

	let isFocused = $state(false);
	let body: string = $state('');
    let isSubmittingComment: boolean = $state(false);

	const MAX_CHARS = 800;

	function autoGrow(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	function handleFocus() {
		isFocused = true;
	}

	function handleBlur() {
		if (body.length === 0) {
			isFocused = false;
		}
	}

    const confirmEdit = async () => {
        try {
            isSubmittingComment = true;

            if(body === '') {
                throw new Error("Comment must contain text")
            }

            const newComment = {
                ...comment,
                content: body
            }
            console.log(newComment)
            await CommentClient.updateComment(newComment)
            commentFeedUpdate(newComment)
            cancelEdit()
        }
        catch(error) {

        }
        finally {
            isSubmittingComment = false;
        }
    }
</script>

<div class="relative flex flex-col gap-2">
	<textarea
		placeholder="What's on your mind?"
		aria-label="Create your post body"
		class={`
            input w-full resize-none border
            border-transparent transition-all duration-200
            ease-in-out outline-none
            focus:border-[var(--color-primary)]
            ${isFocused || body.length > 0 ? 'min-h-32' : 'min-h-12'} 
            ${body.length > MAX_CHARS ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : ''}
            ${isSubmittingComment ? 'cursor-not-allowed opacity-50' : ''}
        `}
		bind:value={body}
		onfocus={handleFocus}
		onblur={handleBlur}
		oninput={autoGrow}
		maxlength={MAX_CHARS}
		disabled={isSubmittingComment}
	>
	</textarea>


	{#if isFocused || body.length > 0}
		<div
			class={`
                absolute right-3 bottom-3 
                px-2 py-1 text-xs font-medium
                transition-all duration-200
                ${
                    body.length > MAX_CHARS
                        ? 'color-error'
                        : body.length > MAX_CHARS * 0.8
                            ? 'text-orange-400'
                            : 'muted'
                }
            `}
		>
			{body.length}/{MAX_CHARS}
		</div>
	{/if}
</div>
<div class="w-fit flex gap-2 self-end">
    <button class="btn-small w-fit" type="button" onclick={() => cancelEdit()}>
        Cancel
    </button>
    <button class="btn-small w-fit" type="button" onclick={() => confirmEdit()}>
        Submit
    </button>
</div>
