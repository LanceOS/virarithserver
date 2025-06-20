<script lang="ts">
	import Icon from '@iconify/svelte';

	let {
		isEditing,
		newAvatar = $bindable(),
		avatar
	} = $props<{
		isEditing: boolean;
		newAvatar: File | undefined;
		avatar: string | undefined;
	}>();

	let avatarInputField: HTMLInputElement | undefined = $state();
	let selectedFile: File | undefined = $state();

	$effect(() => {
		selectedFile = newAvatar;
	});
	

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
	};
</script>

<section class="flex flex-col justify-center gap-4 lg:w-64 lg:justify-end">
	<div class="h-48 lg:h-64">
		{#if !avatar}
			<div class="flex h-full w-full items-center justify-center rounded-lg bg-gray-700">
				<Icon icon="mdi:account-circle" class="text-6xl text-gray-400" />
			</div>
		{:else}
			<img src={avatar} alt="" />
		{/if}
	</div>
	{#if isEditing}
		<button
			type="button"
			class="border-muted flex w-full cursor-pointer items-center justify-center p-4 font-semibold"
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
