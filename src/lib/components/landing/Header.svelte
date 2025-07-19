<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import type { UserSchema } from '$lib/server/schemas/authentication.ts';
	import Icon from '@iconify/svelte';

	const session = authClient.useSession();
	let isMobileMenuOpen = $state(false);

	let user: UserSchema | undefined = $state();

	$effect(() => {
		user = $session.data?.user
	})

	const navigationItems = [
		{ label: 'Home', path: '/', ariaLabel: 'Go to home page' },
		{ label: 'Forums', path: '/pages/forum', ariaLabel: 'Go to forum page' },
		{ label: 'Map', path: '/pages/map', ariaLabel: 'Go to map page' },
		{ label: 'Wiki', path: '/pages/wiki', ariaLabel: 'Go to wiki page' }
	];

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.reload();
				}
			}
		});
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

</script>

<header class="bg-base px-4 py-4">
	<div class="mx-auto flex w-full max-w-7xl items-center justify-end">
		<nav class="hidden items-center gap-6 md:flex">
			{#if user?.role === "admin" || user?.role === "founder" || user?.role === "developer"}
				<a
					type="button"
					aria-label="Admin Dashboard"
					class="btn-nav"
					href="/admin/interface"
				>
					Dashboard
				</a>
			{/if}

			{#each navigationItems as item}
				<a type="button" aria-label={item.ariaLabel} class="btn-nav" href={item.path}>
					{item.label}
				</a>
			{/each}

			{#if !user}
				<a
					type="button"
					aria-label="Log In"
					class="btn-small cursor-pointer px-4 py-2 duration-200"
					href="/pages/login"
				>
					Log In
				</a>
			{:else}
				<a
					type="button"
					aria-label="View notifications"
					class="btn-small cursor-pointer px-4 py-2 duration-200"
					href={`/pages/notifications/${user.id}`}
				>
					<Icon icon="material-symbols:notifications-outline" class="h-6 w-6" />
				</a>
				<a
					type="button"
					aria-label="View profile"
					class="btn-small cursor-pointer px-4 py-2 duration-200"
					href={`/pages/profile/${user.id}`}
				>
					<Icon icon="material-symbols:person-outline" class="h-6 w-6" />
				</a>
				<button
					type="button"
					aria-label="Log Out"
					class="btn-small cursor-pointer px-4 py-2 duration-200"
					onclick={handleSignOut}
				>
					Log Out
				</button>
			{/if}
		</nav>

		<button
			type="button"
			aria-label="Toggle mobile menu"
			class="btn-nav p-2 transition-colors md:!hidden"
			onclick={toggleMobileMenu}
		>
			<Icon
				icon={isMobileMenuOpen ? 'material-symbols:close' : 'material-symbols:menu'}
				class="h-6 w-6"
			/>
		</button>

		{#if isMobileMenuOpen}
			<div class="bg-base absolute top-16 right-0 left-0 z-50 border-t md:hidden">
				<nav class="flex flex-col gap-6 px-4 py-8">
					{#each navigationItems as item}
						<a
							type="button"
							aria-label={item.ariaLabel}
							class="btn-nav w-full px-4 py-2 text-left transition-colors"
							href={item.path}
						>
							{item.label}
						</a>
					{/each}

					<div class="flex flex-col gap-4">
						{#if !$session.data}
							<a
								type="button"
								aria-label="Log In"
								class="btn-small w-full cursor-pointer px-4 py-2 duration-200"
								href="/pages/login"
							>
								Log In
							</a>
						{:else}
							<a
								type="button"
								aria-label="View notifications"
								class="btn-small w-full cursor-pointer px-4 py-2 duration-200"
								href={`/pages/notifications/${user?.id}`}
							>
								Notifications
							</a>
							<a
								type="button"
								aria-label="View profile"
								class="btn-small w-full px-4 py-2"
								href={`/pages/profile/${user?.id}`}
							>
								Profile
							</a>
							<button
								type="button"
								aria-label="Log Out"
								class="btn-small w-full px-4 py-2"
								onclick={() => {
									handleSignOut();
									closeMobileMenu();
								}}
							>
								Log Out
							</button>
						{/if}
					</div>
				</nav>
			</div>
		{/if}
	</div>
</header>
