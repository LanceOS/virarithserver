<script lang="ts">
	import CardHeader from '$lib/components/cards/CardHeader.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import type { UserSchema } from '$lib/schemas/authentication.ts';
	import UserClient from '$lib/tools/UserClient.ts';

	const roles: string[] = ['admin', 'developer', 'founder', 'moderator', 'user'];

	let searchedUser: UserSchema | undefined = $state();
	let nameInput: string = $state('');

	const searchUser = async () => {
		try {
			const response = await UserClient.getUserByName(nameInput);
			if(response) {
				searchedUser = response;
			}
		}
		catch(error) {
			console.error(error)
		}
	}
</script>

<Header />
<main class="bg-base min-h-screen px-4 py-16">
	<div class="card-setup mx-auto flex max-w-7xl flex-col gap-8">
		<div class="space-y-4">
			<h1 class="text-3xl font-bold">Admin User Management</h1>
			<p>Here you can search for a user and modify their role. You can demote and promote users as well as delete them.</p>
		</div>

		<div class="flex items-center gap-4">
			<input
				type="text"
				placeholder="Search users by name..."
				bind:value={nameInput}
				class="input w-full"
				aria-label="Search users"
			/>
			<button type="button" class="btn-small" onclick={searchUser}>
				Search
			</button>
		</div>

		<div class="space-y-4">
			{#if searchedUser}
				<CardHeader user={searchedUser}/>
			{/if}
		</div>
	</div>
</main>

