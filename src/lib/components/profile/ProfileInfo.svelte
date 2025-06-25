<script lang="ts">
    import Icon from '@iconify/svelte';
    const { isEditing, newProfileInfo = $bindable(), profile } = $props();

    let isBioFocused = $state(false);

    const MAX_BIO_CHARS = 400;

    const autoGrow = (event: Event) => {
        const textarea = event.target as HTMLTextAreaElement; 
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    const handleBioFocus = () => {
        isBioFocused = true;
    };

    const handleBioBlur = () => {
        if (newProfileInfo.bio?.length === 0) {
            isBioFocused = false;
        }
    };
</script>

<div class="relative">
    {#if isEditing}
        <textarea
            placeholder="What's on your mind?"
            aria-label="Create your post body"
            class={`
                input resize-none
                ${isBioFocused || newProfileInfo.bio?.length > 0 ? 'min-h-32' : 'min-h-12'}
                ${newProfileInfo.bio?.length > MAX_BIO_CHARS ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : ''}
            `}
            bind:value={newProfileInfo.bio}
            onfocus={handleBioFocus}
            onblur={handleBioBlur}
            oninput={autoGrow}
            maxlength={MAX_BIO_CHARS}
            id="bio"
            name="bio"
            required
        >
        </textarea>

        {#if isBioFocused || newProfileInfo.bio?.length > 0}
            <div
                class={`
                    absolute right-3 bottom-3
                    px-2 py-1 text-xs font-medium
                    transition-all duration-200
                    ${
                        newProfileInfo.bio?.length > MAX_BIO_CHARS
                            ? 'text-[var(--color-error)]' 
                            : newProfileInfo.bio?.length > MAX_BIO_CHARS * 0.8
                                ? 'text-orange-400'
                                : 'text-[var(--color-muted)]' 
                    }
                `}
            >
                {newProfileInfo.bio?.length}/{MAX_BIO_CHARS}
            </div>
        {/if}
    {:else}
        <h2 class="space-y-3 text-2xl" style="color: var(--color-base-content);">Bio</h2>
        <p class="text-base" style="color: var(--color-base-content);">
            {@html profile.bio || 'This user has not set a bio yet.'}
        </p>
    {/if}
</div>

<section class="space-y-3">
    <h3 class="text-lg font-semibold" style="color: var(--color-base-content);">Gaming Info</h3>

    <div class="input p-3"> <div class="mb-1 flex items-center gap-2">
            <Icon icon="vscode-icons:file-type-minecraft" class="text-lg"></Icon>
            <span class="text-[var(--color-muted)] text-sm font-medium">Minecraft</span>
        </div>
        {#if isEditing}
            <input
                type="text"
                bind:value={newProfileInfo.minecraftName}
                placeholder="Enter Minecraft username"
                class="input"
                maxlength="50"
            />
        {:else}
            <p class="text-[var(--color-base-content)] text-sm">
                {profile.minecraftName || 'Not set'}
            </p>
        {/if}
    </div>

    <div class="input p-3"> <div class="mb-1 flex items-center gap-2">
            <Icon icon="logos:discord-icon" class="text-lg"></Icon>
            <span class="text-[var(--color-muted)] text-sm font-medium">Discord</span>
        </div>
        {#if isEditing}
            <input
                type="text"
                bind:value={newProfileInfo.discordName}
                placeholder="Enter Discord username"
                class="input"
                maxlength="50"
            />
        {:else}
            <p class="text-[var(--color-base-content)] text-sm">
                {profile.discordName || 'Not set'}
            </p>
        {/if}
    </div>
</section>