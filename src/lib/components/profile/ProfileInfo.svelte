<script lang="ts">
	import Icon from "@iconify/svelte";

    const { isEditing, newProfileInfo = $bindable(), profile } = $props();

</script>

<div>
    <h3 class="mb-3 text-lg font-semibold text-white">Bio</h3>
    {#if isEditing}
        <textarea
            bind:value={newProfileInfo.bio}
            placeholder="Enter your bio..."
            class="input w-full resize-none p-3"
            rows="3"
        ></textarea>
    {:else}
        <p class="content">
            {profile.bio || 'This user has not set a bio yet.'}
        </p>
    {/if}
</div>

<section class="space-y-3">
    <h3 class="text-lg font-semibold text-white">Gaming Info</h3>

    <div class="input p-3">
        <div class="mb-1 flex items-center gap-2">
            <Icon icon="vscode-icons:file-type-minecraft" class="text-lg"></Icon>
            <span class="muted text-sm font-medium">Minecraft</span>
        </div>
        {#if isEditing}
            <input
                type="text"
                bind:value={newProfileInfo.minecraftName}
                placeholder="Enter Minecraft username"
                class="input w-full text-md border-muted"
            />
        {:else}
            <p class="content text-sm">
                {profile.minecraftName || 'Not set'}
            </p>
        {/if}
    </div>

    <div class="input p-3">
        <div class="mb-1 flex items-center gap-2">
            <Icon icon="logos:discord-icon" class="text-lg"></Icon>
            <span class="muted text-sm font-medium">Discord</span>
        </div>
        {#if isEditing}
            <input
                type="text"
                bind:value={newProfileInfo.discordName}
                placeholder="Enter Discord username"
                class="input w-full text-md border-muted"
            />
        {:else}
            <p class="content text-sm">
                {profile.discordName || 'Not set'}
            </p>
        {/if}
    </div>
</section>