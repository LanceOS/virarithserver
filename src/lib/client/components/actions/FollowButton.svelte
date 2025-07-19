<script lang="ts">
	import UserClient from '$lib/client/tools/UserClient.client.ts';
	import Icon from '@iconify/svelte';

	let { profile = $bindable() } = $props();

	let errorLog = $state('');
	let isSubmitting = $state(false);

	const handleFollow = async () => {
		isSubmitting = true;
		let wasFollowed: boolean = profile.isFollowed;
		errorLog = '';

		try {
			if (wasFollowed === true) {
				await UserClient.unfollowUser({
					receiverId: profile.user.id,
					objectId: profile.id
				});
			} else {
				await UserClient.followUser({
					receiverId: profile.user.id,
					objectId: profile.id
				});
			}
		} catch (error) {
			console.error(`Failed to follow user due to: ${error}`);
			errorLog = 'Failed to follow user.';
		} finally {
			profile = {
				...profile,
				isFollowed: !wasFollowed
			};
			setTimeout(() => {
				isSubmitting = false;
			}, 1500);
		}
	};
</script>

<button
	onclick={handleFollow}
	disabled={isSubmitting}
	class={`flex items-center gap-2 ${isSubmitting ? 'btn-small-active' : 'btn-small'}`}
>
	<Icon icon={profile.isFollowed ? 'mdi:account-check' : 'mdi:account-plus'} class="iconify"></Icon>
	{#if isSubmitting}
		{profile.isFollowed ? 'Following...' : 'Unfollowing...'}
	{:else}
		{profile.isFollowed ? 'Following' : 'Follow'}
	{/if}
</button>
