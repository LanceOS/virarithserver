<script lang="ts">
	import { PUBLIC_MC_SERVER_IP } from '$env/static/public';
    import Footer from '$lib/client/components/landing/Footer.svelte';
    import Header from '$lib/client/components/landing/Header.svelte';
    import Icon from '@iconify/svelte';

    const voteSites = [
        {
            name: 'MinecraftServers.org',
            url: 'https://minecraftservers.org/vote/659007',
            description: 'One of the oldest and most trusted server lists'
        },
        {
            name: 'PlanetMinecraft.com',
            url: 'https://www.planetminecraft.com/server/virarith-an-mmorpg-geopolitical-experience/vote/',
            description: 'Vote on the largest Minecraft platform'
        },
        {
            name: 'MC-Serverlist.com',
            url: 'https://minecraft-server-list.com/server/511369/vote/',
            description: 'Another trusted server directory'
        },
    ];

    const serverIp = PUBLIC_MC_SERVER_IP
    let copied = $state(false);

    const copyIpToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(serverIp);
            copied = true;
            setTimeout(() => copied = false, 2000);
        } catch (err) {
            console.error('Failed to copy IP: ', err);
            alert('Failed to copy IP. Please copy it manually: ' + serverIp);
        }
    }
</script>

<Header />

<main class="max-w-7xl mx-auto px-4 py-12 space-y-16">
    <section class="text-center space-y-6">
        <h1 class="text-4xl font-bold content">
            Vote for VirarithMC
        </h1>
        <p class="text-lg muted max-w-2xl mx-auto">
            Support our server by voting on these platforms. Each vote helps us grow and earn you in-game rewards.
        </p>
    </section>

    <section class="space-y-6">
        <h2 class="text-2xl font-semibold content mb-6">
            Voting Sites
        </h2>
        <div class="space-y-6">
            {#each voteSites as site}
                <a href={site.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   class="block card-setup">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-medium content">
                                {site.name}
                            </h3>
                            <p class="text-sm muted mt-1">
                                {site.description}
                            </p>
                        </div>
                        <div class="btn-small">
                            Vote
                            <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    </section>

    <section class="space-y-4">
        <h2 class="text-2xl font-semibold content">
            Join Our Server
        </h2>
        <div class="">
            <p class="muted mb-4">
                After voting, join our server to claim your rewards. You can vote on each site once every 24 hours.
            </p>
            <div class="card-setup">
                <div class="flex items-center justify-between gap-4">
                    <code class="text-lg content flex-1">
                        {serverIp}
                    </code>
                    <button onclick={copyIpToClipboard}
                            class="btn-small {copied ? 'btn-small-active' : ''}">
                        {#if copied}
                            <Icon icon="lucide:check" class="w-4 h-4 mr-2" />
                            Copied
                        {:else}
                            <Icon icon="lucide:copy" class="w-4 h-4 mr-2" />
                            Copy
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </section>
</main>

<Footer />