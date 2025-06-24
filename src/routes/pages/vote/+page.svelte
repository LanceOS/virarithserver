<script lang="ts">
	import Footer from '$lib/components/landing/Footer.svelte';
    import Header from '$lib/components/landing/Header.svelte';
    import Icon from '@iconify/svelte';

    // Define your voting sites here
    const voteSites = [
        {
            name: 'MinecraftServers.org',
            url: 'https://minecraftservers.org/vote/YOUR_SERVER_ID_1', // Replace with actual link
            icon: 'material-symbols:how-to-vote' // Generic vote icon
        },
        {
            name: 'TopG.org',
            url: 'https://topg.org/minecraft-servers/server-YOUR_SERVER_ID_2', // Replace with actual link
            icon: 'material-symbols:how-to-vote'
        },
        {
            name: 'Minecraft-MP.com',
            url: 'https://minecraft-mp.com/server/YOUR_SERVER_ID_3/vote/', // Replace with actual link
            icon: 'material-symbols:how-to-vote'
        },
        {
            name: 'PlanetMinecraft.com',
            url: 'https://www.planetminecraft.com/server/YOUR_SERVER_ID_4/vote/', // Replace with actual link
            icon: 'material-symbols:how-to-vote'
        },
        // Add more voting sites as needed
        {
            name: 'MC-Serverlist.com',
            url: 'https://mc-serverlist.com/server/YOUR_SERVER_ID_5/vote/', // Replace with actual link
            icon: 'material-symbols:how-to-vote'
        },
    ];
</script>

<Header />

<main class="space-y-12 pb-16">
    <div class="mx-auto flex max-w-7xl flex-col gap-12 px-8">

        <section class="w-full text-center py-8">
            <h1 class="content text-4xl sm:text-5xl font-bold mb-4">Support Us! Vote for VirarithMC</h1>
            <p class="muted mx-auto max-w-3xl text-lg sm:text-xl">
                Every vote helps our server grow and climb the rankings, bringing in new players and strengthening our community.
                As a thank you, you'll receive valuable in-game rewards!
            </p>
        </section>

        <section class="w-full">
            <div class="card-setup p-6 sm:p-8 flex flex-col gap-6">
                <h2 class="content text-3xl font-semibold text-center mb-4">Choose a Voting Site:</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each voteSites as site}
                        <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="card-setup flex flex-col items-center justify-between p-5 text-center transition-transform transform hover:scale-105"
                        >
                            <Icon icon={site.icon} class="text-6xl text-primary mb-4" />
                            <h3 class="content text-xl font-semibold mb-2">{site.name}</h3>
                            <p class="muted text-sm mb-4">Click to vote and claim your rewards!</p>
                            <button class="btn-big flex items-center gap-2">
                                Vote Now
                                <Icon icon="lucide:arrow-right" class="h-4 w-4" />
                            </button>
                        </a>
                    {/each}
                </div>
            </div>
        </section>

        <section class="w-full text-center">
            <div class="card-setup p-6 sm:p-8">
                <h2 class="content text-2xl font-semibold mb-3">How Voting Rewards Work:</h2>
                <p class="muted max-w-2xl mx-auto mb-4">
                    After voting on any of the sites above, simply log into the VirarithMC server.
                    Your rewards will be automatically added to your in-game inventory or accessible via a command.
                    You can vote on each site once every 24 hours.
                </p>
                <div class="bg-card border-muted inline-block rounded-lg p-4">
                    <p class="muted mb-2 text-sm">Our Server IP:</p>
                    <p class="content font-mono text-xl font-semibold" style="color: var(--color-primary)">
                        54.39.250.197:25598
                    </p>
                </div>
            </div>
        </section>

    </div>
</main>

<Footer />