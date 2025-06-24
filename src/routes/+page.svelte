<script lang="ts">
    import Header from '$lib/components/landing/Header.svelte';
    import Hero from '$lib/components/home/Hero.svelte';
    import LatestAnnouncement from '$lib/components/home/LatestAnnouncement.svelte';
    import Icon from '@iconify/svelte';
    import type { PageData } from './$types.js';
	import Footer from '$lib/components/landing/Footer.svelte';

    const { data } = $props<{ data: PageData }>();

    const staffUsers = data.staff;

    // Animation states (keeping them for consistency if you use them elsewhere)
    let discordVisible = false;
    let featuresVisible = false;
    let communityVisible = false;
</script>

<Header />
<main class="space-y-12 pb-16">
	
    <Hero />

    <div class="mx-auto flex max-w-7xl flex-col gap-12 px-8">
        <section class="flex w-full flex-col gap-8 md:flex-row">
            <div class="flex w-full flex-col gap-8 md:w-3/4" class:animate-fade-up={communityVisible}>
                <div class="card-setup text-center">
                    <h2 class="content mb-4 text-3xl font-bold">Ready to Start Your Adventure?</h2>
                    <p class="muted mx-auto mb-8 max-w-2xl text-lg">
                        VirarithMC is an MMORPG Kingdoms PvPvE server like no other. We offer a multitude of
                        things from custom crafting, custom ores, custom farming, and custom cooking. Players are
                        also able to create Kingdoms and expand into Nations as they begin their conquest.
                    </p>

                    <div class="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button class="btn-big"> Join Server Now </button>
                        <button class="btn-discord"> Join Discord </button>
                    </div>

                    <div class="bg-card border-muted inline-block p-6">
                        <p class="muted mb-2 text-sm">Server IP:</p>
                        <p class="content font-mono text-xl font-semibold">
                            54.39.250.197:25598
                        </p>
                    </div>
                </div>
            </div>

            <div class="card-setup flex w-full flex-col gap-8 p-4 md:w-1/4">
                <div class="flex w-full flex-col gap-4" class:animate-fade-up={discordVisible}>
                    <h3 class="content text-2xl font-semibold">Join Our Discord</h3>
                    <button class="btn-discord flex items-center justify-center gap-2">
                        <Icon icon="ic:baseline-discord" class="h-5 w-5" />
                        Discord
                    </button>
                </div>

                <div class="flex w-full flex-col gap-4">
                    <h3 class="content text-2xl font-semibold">Our Staff</h3>
                    <div class="grid grid-cols-1 gap-4">
                        {#each staffUsers as staff}
                            <div class="flex items-center gap-3">
                                {#if staff.image && staff.image !== 'placeholder'}
                                    <div class="user-avatar w-10 h-10 flex-shrink-0">
                                        <img src={staff.image} alt="Staff Avatar" class="rounded-full object-cover w-full h-full" />
                                    </div>
                                {/if}
                                <div class="flex flex-col gap-0.5">
                                    <button class="btn-nav text-base font-medium">{staff.name}</button>
                                    <p class="text-xs text-muted">{staff.role.toUpperCase()}</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </section>

        <section class="w-full">
            <LatestAnnouncement />
        </section>

        <section class="w-full">
            <div class="flex items-center gap-6 flex-col sm:flex-row">
                <div class="card-setup w-full text-center">
                    <h3 class="content mb-3 text-lg font-semibold">Server Rules</h3>
                    <p class="muted mb-4 text-sm">
                        Read our community guidelines to ensure everyone has a great time
                    </p>
                    <button class="read-more-btn">
                        View Rules
                        <Icon icon="lucide:arrow-right" class="h-4 w-4" />
                    </button>
                </div>

                <div class="card-setup w-full text-center">
                    <h3 class="content mb-3 text-lg font-semibold">Vote for Us</h3>
                    <p class="muted mb-4 text-sm">
                        Support the server and earn rewards by voting on server lists
                    </p>
                    <button class="read-more-btn">
                        Vote Now
                        <Icon icon="lucide:arrow-right" class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    </div>
</main>
<Footer />

<style>
    /* Custom animations will inherit from your app.css fade-up animation */
</style>