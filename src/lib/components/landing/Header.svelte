<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import Icon from '@iconify/svelte';

	const session = authClient.useSession();

	let isMobileMenuOpen = $state(false);

	async function signOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.reload();
				}
			}
		});
	}

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
	};

	const closeMobileMenu = () => {
		isMobileMenuOpen = false;
	};

	const handleNavigation = (path: string) => {
		goto(path);
		closeMobileMenu();
	};
</script>

<header
	class="bg-base border-muted mx-auto flex h-16 w-full max-w-7xl items-center justify-end px-4"
>
	<nav class="hidden items-center gap-6 md:flex">
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
			aria-label="Go to map page"
			class="btn-nav"
			onclick={() => goto('/pages/dynmap')}>Map</button
		>
		<button
			type="button"
			aria-label="Go to wiki page"
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

	<button
		type="button"
		aria-label="Toggle mobile menu"
		class="border-muted btn-nav p-2 transition-colors md:!hidden"
		onclick={toggleMobileMenu}
	>
		{#if isMobileMenuOpen}
			<Icon icon="material-symbols:close" class="h-6 w-6" />
		{:else}
			<Icon icon="material-symbols:menu" class="h-6 w-6" />
		{/if}
	</button>

	{#if isMobileMenuOpen}
		<div class="bg-base border-muted absolute top-16 right-0 left-0 z-50 border-t md:hidden">
			<nav class="flex flex-col gap-6 px-4 py-8">
				<button
					type="button"
					aria-label="Go to home page"
					class="btn-nav border-muted px-4 py-2 text-left transition-colors"
					onclick={() => handleNavigation('/')}
				>
					Home
				</button>
				<button
					type="button"
					aria-label="Go to forum page"
					class="btn-nav border-muted px-4 py-2 text-left transition-colors"
					onclick={() => handleNavigation('/pages/forum')}
				>
					Forums
				</button>
				<button
					type="button"
					aria-label="Go to map page"
					class="btn-nav border-muted px-4 py-2 text-left transition-colors"
					onclick={() => handleNavigation('/pages/dynmap')}
				>
					Map
				</button>
				<button
					type="button"
					aria-label="Go to wiki page"
					class="btn-nav border-muted px-4 py-2 text-left transition-colors"
					onclick={() => handleNavigation('/pages/wiki')}
				>
					Wiki
				</button>
				<div class="">
					{#if !$session.data}
						<button
							type="button"
							aria-label="Log In"
							onclick={() => handleNavigation('/pages/login')}
							class="btn-small w-full"
						>
							Log In
						</button>
					{:else}
						<button
							type="button"
							aria-label="Log Out"
							onclick={() => {
								signOut();
								closeMobileMenu();
							}}
							class="btn-small w-full"
						>
							Log Out
						</button>
					{/if}
				</div>
			</nav>
		</div>
	{/if}
</header>
