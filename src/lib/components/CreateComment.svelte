<script lang="ts">
    import { authClient } from "$lib/auth-client.ts";
	import CommentFeed from "./CommentFeed.svelte";
    
    let { addComment, isSubmittingComment } = $props()

    let body = $state('');
    let isFocused = $state(false);
    const MAX_CHARS = 800;

    const session = authClient.useSession();

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

    const handleSubmit = async (event: Event) => {
		event?.preventDefault()
        await addComment(body) // Pass the body to addComment
        console.log('Comment submitted:', body);
        body = '';
        isFocused = false;
    }
</script>

<section class="card-setup p-6 space-y-4 -mb-12">
	<p class="font-semibold">Create Comment</p>
    <form class="flex flex-col gap-4" onsubmit={handleSubmit}>
        <div class="relative">
            <textarea
                placeholder="What's on your mind?"
                aria-label="Create your post body"
                class={`
                    input w-full resize-none outline-none
                    transition-all duration-200 ease-in-out
                    border border-transparent
                    focus:border-[var(--color-primary)]
                    ${isFocused || body.length > 0 ? 'min-h-32' : 'min-h-12'} 
                    ${body.length > MAX_CHARS ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : ''}
                    ${isSubmittingComment ? 'opacity-50 cursor-not-allowed' : ''}
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
                        absolute bottom-3 right-3 
                        px-2 py-1 text-xs font-medium
                        transition-all duration-200
                        ${body.length > MAX_CHARS 
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

        <div class="flex justify-between items-center">
            <div class="text-sm">
                {#if body.length > MAX_CHARS}
                    <span class="color-error font-medium">Character limit exceeded</span>
                {:else if body.length > MAX_CHARS * 0.8}
                    <span class="text-orange-400 font-medium">Approaching character limit</span>
                {/if}
            </div>
            
            <button
                type="submit"
                class={`
                    font-bold text-sm flex items-center gap-2
                    transition-all duration-200 ease-in-out
                    focus:outline-none
                    ${body.length === 0 || body.length > MAX_CHARS || isSubmittingComment
                        ? 'bg-[var(--color-input)] muted cursor-not-allowed opacity-50 border-muted p-2'
                        : 'btn-small hover:transform hover:scale-[1.02] active:scale-[0.98]'
                    }
                `}
                disabled={body.length === 0 || body.length > MAX_CHARS || isSubmittingComment}
            >
                {#if isSubmittingComment}
                    <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                    Posting...
                {:else}
                    Post Comment
                {/if}
            </button>
        </div>
    </form>
</section>

<style>
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>