<script lang="ts">
	import ForumFeed from '$lib/components/ForumFeed.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import Links from '$lib/components/Links.svelte';
	
	export let data;
	const posts = data.posts
</script>

<Header />
<main class="flex flex-col pb-16 max-w-7xl mx-auto border-muted">
	<section class="relative flex h-fit min-h-[20rem] items-center overflow-hidden mb-10">
		<img src="/images/green.png" alt="" class="absolute inset-0 -z-10 object-center blur-sm" />

		<div class="mx-auto flex w-full -mt-10 justify-center px-4">
			<img src="/images/virarith.png" alt="" class="w-[45rem]" />
		</div>
	</section>


	<div class="w-full mx-auto flex gap-6 px-4 bg-base">
		<div class="w-full">
			<section class="flex flex-col gap-2 p-8 -mb-8">
				<h2 class="text-4xl text-white">Change Logs</h2>
				<p class="muted text-lg">Stay updated with the latest changes and improvements</p>
			</section>
			<ForumFeed { posts }/>
		</div>


        <Links />
	</div>
</main>
