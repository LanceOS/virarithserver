<script lang="ts">
    import { authClient } from "$lib/auth-client.ts";
    import { page } from '$app/state';
    import CommentClient from "$lib/client/tools/CommentClient.client.ts";
	import { toast } from "@zerodevx/svelte-toast";
    
    const session = authClient.useSession();
    const postId = page.params.post;

    const { handleAddComment, post } = $props()

    let body = $state('');
    let isFocused = $state(false);
    let isSubmittingComment: boolean = $state(false);

    const MAX_CHARS = 800;


        /**
     * @param body
     * @returns Adds new comment to database and then refetches comments
     */
    const addComment = async (body: string) => {
        if (!$session.data?.user || !postId) {
            return;
        }

        const user = $session.data.user;

        isSubmittingComment = true;

        const data = {
            postUser: post.user.id,
            userId: user.id,
            postId: postId,
            content: body
        };

        try {
            const response = await CommentClient.createComment(data);
            const newComment = { ...response[0], user: user };
            handleAddComment(newComment)
        } catch (error: any) {
            toast.push(error.message)
        } finally {
            isSubmittingComment = false;
        }
    };

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
        await addComment(body)
        body = '';
        isFocused = false; 
    }
</script>

<section class="space-y-4">
    <p class="font-semibold text-xl" style="color: var(--color-base-content);">Create Comment</p>
    <form class="sm:card-setup space-y-4" onsubmit={handleSubmit}>
        <div class="relative">
            <textarea
                placeholder="What's on your mind?"
                aria-label="Create your post body"
                class="input w-full resize-none"
                bind:value={body}
                onfocus={handleFocus}
                onblur={handleBlur}
                oninput={autoGrow}
                maxlength={MAX_CHARS}
                disabled={isSubmittingComment}
                style={`
                    ${isFocused || body.length > 0 ? 'min-height: 8rem;' : 'min-height: 3rem;'} /* Use min-h-32 (8rem) or min-h-12 (3rem) */
                    ${body.length > MAX_CHARS ? 'border-color: var(--color-error);' : ''}
                    ${isSubmittingComment ? 'opacity: 0.7; cursor: not-allowed;' : ''}
                `}
            >
            </textarea>

            {#if isFocused || body.length > 0}
                <div 
                    class={`
                        absolute bottom-3 right-3 
                        px-2 py-1 text-xs font-medium
                        transition-all duration-200
                    `}
                    style={`
                        color: ${body.length > MAX_CHARS 
                            ? 'var(--color-error)' 
                            : body.length > MAX_CHARS * 0.8 
                                ? 'var(--color-warning)' 
                                : 'var(--color-muted)'
                        };
                    `}
                >
                    {body.length}/{MAX_CHARS}
                </div>
            {/if}
        </div>

        <div class="flex justify-between items-center">
            <div class="text-sm">
                {#if body.length > MAX_CHARS}
                    <span style="color: var(--color-error); font-weight: 500;">Character limit exceeded</span>
                {:else if body.length > MAX_CHARS * 0.8}
                    <span style="color: var(--color-warning); font-weight: 500;">Approaching character limit</span>
                {/if}
            </div>
            
            <button
                type="submit"
                class={`
                    ${body.length === 0 || body.length > MAX_CHARS || isSubmittingComment
                        ? 'btn-small' 
                        : 'btn-small'
                    }
                `}
                style={`
                    ${body.length === 0 || body.length > MAX_CHARS || isSubmittingComment
                        ? 'background-color: var(--color-disabled-background); color: var(--color-disabled-content); cursor: not-allowed; opacity: 0.8; box-shadow: none; transform: none;'
                        : ''
                    }
                `}
                disabled={body.length === 0 || body.length > MAX_CHARS || isSubmittingComment}
            >
                {#if isSubmittingComment}
                    <div class="pagination-spinner-icon"></div> Posting...
                {:else}
                    Post Comment
                {/if}
            </button>
        </div>
    </form>
</section>