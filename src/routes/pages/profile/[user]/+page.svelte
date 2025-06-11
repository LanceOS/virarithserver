<script lang="ts">
	import ProfileClient from "$lib/tools/ProfileClient.ts";
	import { page } from '$app/state';
	import { onMount } from "svelte";
	
	const userId = page.params.user;
	
	let profile: any = $state()


	onMount(async () => {
		const userResponse = await ProfileClient.getUserProfile(userId)
		profile = userResponse;
	})
</script>

<main>
	<h1>Placeholder</h1>
</main>