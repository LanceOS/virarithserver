<script lang="ts">
	import ForumFeed from '$lib/components/ForumFeed.svelte';
	import Header from '$lib/components/Header.svelte';
	import Links from '$lib/components/Links.svelte';
	import ServerInfo from '$lib/components/ServerInfo.svelte';
</script>

<Header />
<main class="flex flex-col">
    <!-- Hero -->
	<section class="relative flex h-fit min-h-[30rem] items-center overflow-hidden">
		<img src="/images/green.png" alt="" class="absolute inset-0 -z-10 object-center blur-sm" />

		<div class="mx-auto flex w-full max-w-7xl justify-center px-4">
			<img src="/images/.png" alt="" class="w-[45rem]" />
		</div>
	</section>

    <!-- Main sections -->
	<div class="flex-warp mx-auto flex max-w-7xl gap-6 px-4">
        <ServerInfo />

        <ForumFeed />

        <Links />
	</div>
</main>
