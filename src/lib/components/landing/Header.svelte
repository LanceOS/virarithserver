<script lang="ts">
    import { goto } from '$app/navigation';
    import { authClient } from '$lib/auth-client.ts';
    import Icon from '@iconify/svelte';

    const session = authClient.useSession();
    let isMobileMenuOpen = $state(false);

    const navigationItems = [
        { label: 'Home', path: '/', ariaLabel: 'Go to home page' },
        { label: 'Forums', path: '/pages/forum', ariaLabel: 'Go to forum page' },
        { label: 'Map', path: '/pages/dynmap', ariaLabel: 'Go to map page' },
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

    function handleNavigation(path: string) {
        goto(path, { replaceState: true, invalidateAll: true });
        closeMobileMenu();
    }
</script>

<header class="bg-base mx-auto flex py-4 w-full max-w-7xl items-center justify-end px-4">
    <nav class="hidden items-center gap-6 md:flex">
        {#each navigationItems as item}
            <button
                type="button"
                aria-label={item.ariaLabel}
                class="btn-nav"
                onclick={() => goto(item.path)}
            >
                {item.label}
            </button>
        {/each}

        {#if !$session.data}
            <button
                type="button"
                aria-label="Log In"
                class="border-muted py-2 px-4 hover:bg-[var(--color-secondary)] bg-[var(--color-primary)] cursor-pointer duration-200"
                onclick={() => goto('/pages/login')}
            >
                Log In
            </button>
        {:else}
            <button
                type="button"
                aria-label="View notifications"
                class="border-muted py-2 px-4 hover:bg-[var(--color-secondary)] bg-[var(--color-primary)] cursor-pointer duration-200"
                onclick={() => goto('/pages/notifications')}
            >
                <Icon icon="material-symbols:notifications-outline" class="h-6 w-6" />
            </button>
            <button
                type="button"
                aria-label="View profile"
                class="border-muted py-2 px-4 hover:bg-[var(--color-secondary)] bg-[var(--color-primary)] cursor-pointer duration-200"
                onclick={() => goto(`/pages/profile/${$session.data?.user.id}`)}
            >
                <Icon icon="material-symbols:person-outline" class="h-6 w-6" />
            </button>
            <button
                type="button"
                aria-label="Log Out"
                class="border-muted py-2 px-4 hover:bg-[var(--color-secondary)] bg-[var(--color-primary)] cursor-pointer duration-200"
                onclick={handleSignOut}
            >
                Log Out
            </button>
        {/if}
    </nav>

    <button
        type="button"
        aria-label="Toggle mobile menu"
        class="border-muted btn-nav p-2 transition-colors md:!hidden"
        onclick={toggleMobileMenu}
    >
        <Icon 
            icon={isMobileMenuOpen ? "material-symbols:close" : "material-symbols:menu"} 
            class="h-6 w-6" 
        />
    </button>

    {#if isMobileMenuOpen}
        <div class="bg-base border-muted absolute top-16 right-0 left-0 z-50 border-t md:hidden">
            <nav class="flex flex-col gap-6 px-4 py-8">
                {#each navigationItems as item}
                    <button
                        type="button"
                        aria-label={item.ariaLabel}
                        class="btn-nav border-muted w-full px-4 py-2 text-left transition-colors"
                        onclick={() => handleNavigation(item.path)}
                    >
                        {item.label}
                    </button>
                {/each}

                <div class="flex flex-col gap-4">
                    {#if !$session.data}
                        <button
                            type="button"
                            aria-label="Log In"
                            class="border-muted py-2 px-4 hover:bg-[var(--color-secondary)] bg-[var(--color-primary)] cursor-pointer duration-200 w-full"
                            onclick={() => handleNavigation('/pages/login')}
                        >
                            Log In
                        </button>
                    {:else}
                        <button
                            type="button"
                            aria-label="View notifications"
                            class="border-muted py-2 px-4 hover:bg-[var(--color-secondary)] bg-[var(--color-primary)] cursor-pointer duration-200 w-full"
                            onclick={() => handleNavigation('/pages/notifications')}
                        >
                            Notifications
                        </button>
                        <button
                            type="button"
                            aria-label="View profile"
                            class="border-muted py-2 px-4 hover:bg-[var(--color-secondary)] bg-[var(--color-primary)] cursor-pointer duration-200 w-full"
                            onclick={() => handleNavigation(`/pages/profile/${$session.data?.user.id}`)}
                        >
                            Profile
                        </button>
                        <button
                            type="button"
                            aria-label="Log Out"
                            class="border-muted py-2 px-4 hover:bg-[var(--color-secondary)] bg-[var(--color-primary)] cursor-pointer duration-200 w-full"
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
</header>