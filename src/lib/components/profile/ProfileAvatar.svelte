<script lang="ts">
	import Icon from "@iconify/svelte";

    const { isEditing, newAvatar = $bindable() } = $props();

	let avatarInputField: HTMLInputElement | undefined = $state();
    let selectedFile: File | undefined = $state();

    $effect(() => {
        selectedFile = newAvatar
    })

	const updateAvatar = () => {
        if (avatarInputField) {
            avatarInputField.click();
        }
	}

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		selectedFile = file;
	}
</script>

<section class="flex flex-col justify-center gap-4 lg:w-64 lg:justify-end">
    <div class="h-48 lg:h-64">
        <div class="flex h-full w-full items-center justify-center rounded-lg bg-gray-700">
            <Icon icon="mdi:account-circle" class="text-6xl text-gray-400" />
        </div>
    </div>
    {#if isEditing}
        <button
            type="button"
            class="p-4 border-muted w-full cursor-pointer font-semibold flex justify-center items-center"
            onclick={updateAvatar}
        >
            Change Avatar
        </button>
        <input
            type="file"
            name="avatar"
            id="avatar"
            class="hidden"
            bind:this={avatarInputField}
            onchange={handleFileChange}
        />
    {/if}
</section>