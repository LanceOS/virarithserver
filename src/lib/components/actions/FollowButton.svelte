<script lang="ts">
	import Icon from "@iconify/svelte";

	let { profile = $bindable() } = $props();

    let isSubmitting = $state(profile.isFollowed);

    const handleFollow = async () => {
        
    }

</script>

<button onclick={handleFollow} class={`flex items-center gap-2 ${isSubmitting ? 'btn-small-active' : 'btn-small'}`}>
	<Icon icon={profile.isFollowed ? 'mdi:account-check' : 'mdi:account-plus'} class="iconify"></Icon>
	{profile.isFollowed ? 'Following' : 'Follow'}
</button>
