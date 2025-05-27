<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';

	const session = authClient.useSession();

	async function signOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.reload();
				}
			}
		});
	}
</script>

<header
	class="bg-base border-muted mx-auto flex h-16 w-full max-w-7xl items-center justify-between p-4"
>
	<button
		type="button"
		aria-label="Go to home page"
		onclick={() => goto('/')}
		class="cursor-pointer"
	>
		<img src="/images/virarith.png" alt="" class="w-24" />
	</button>
	<nav class="flex items-center gap-6">
		<button type="button" aria-label="Go to home page" class="btn-nav" onclick={() => goto('/')}>
			Home
		</button>
		<button
			type="button"
			aria-label="Go to forum page"
			class="btn-nav"
			onclick={() => goto('/pages/forum')}>Forums</button
		>
		<button
			type="button"
			aria-label="Go to log in"
			class="btn-nav"
			onclick={() => goto('/pages/dynmap')}>Dynmap</button
		>
		<button
			type="button"
			aria-label="Go to log in"
			class="btn-nav"
			onclick={() => goto('/pages/wiki')}>Wiki</button
		>
		{#if !$session.data}
			<button
				type="button"
				aria-label="Log In"
				onclick={() => goto('/pages/login')}
				class="btn-small">Log In</button
			>
		{:else}
			<button type="button" aria-label="Log Out" onclick={() => signOut()} class="btn-small"
				>Log Out</button
			>
		{/if}
	</nav>
</header>
