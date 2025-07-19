<script lang="ts">
    import Icon from '@iconify/svelte';

    let {
        isEditing,
        newAvatar = $bindable(),
        avatar
    } = $props<{
        isEditing?: boolean;
        newAvatar?: File | undefined;
        avatar: string | undefined;
    }>();

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    let avatarInputField: HTMLInputElement | undefined = $state();
    let selectedFile: File | undefined = $state();
    let avatarPreviewUrl: string | undefined = $state();

    $effect(() => {
        selectedFile = newAvatar;

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    avatarPreviewUrl = e.target.result as string;
                }
            };
            reader.readAsDataURL(selectedFile);
        } else {
            avatarPreviewUrl = undefined;
        }
    });

    $effect(() => {
        if(!isEditing) {
            avatarPreviewUrl = avatar
        }
    })

    const updateAvatar = () => {
        if (avatarInputField) {
            avatarInputField.click();
        }
    };

    const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        selectedFile = file;
        newAvatar = file;

        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            console.warn(
                `File ${file.name} has invalid type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
            );
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            console.warn(
                `File ${file.name} is too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            );
            return;
        }

        selectedFile = file;
        newAvatar = file;
    };
</script>

<section class="flex flex-col justify-center gap-4 lg:w-64 lg:justify-end">
    <div class="h-48 lg:h-64">
        {#if !avatar && !avatarPreviewUrl}
            <div class="flex h-full w-full items-center justify-center">
                <Icon icon="mdi:account-circle" class="text-6xl text-gray-400" />
            </div>
        {:else}
            <div class="h-full p-2">
                <img src={avatarPreviewUrl || avatar} alt="Profile Avatar" class="h-full w-full object-cover rounded-lg" />
            </div>
        {/if}
    </div>
    <!-- {#if isEditing}
        <button
            type="button"
            class="btn-small w-full"
            onclick={updateAvatar}
        >
            Change Avatar
        </button>
        <input
            type="file"
            name="avatar"
            id="avatar"
            class="hidden"
            accept={ALLOWED_TYPES.join(',')}
            bind:this={avatarInputField}
            onchange={handleFileChange}
        />
    {/if} -->
</section>