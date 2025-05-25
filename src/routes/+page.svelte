<script lang="ts">
	import ForumFeed from '$lib/components/ForumFeed.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import Links from '$lib/components/Links.svelte';
	
	export let data;
</script>

<Header />
<main class="flex flex-col pb-16">

	<section class="relative flex h-fit min-h-[20rem] items-center overflow-hidden mb-10">
		<img src="/images/green.png" alt="" class="absolute inset-0 -z-10 object-center blur-sm" />

		<div class="mx-auto flex w-full max-w-7xl -mt-10 justify-center px-4">
			<img src="/images/virarith.png" alt="" class="w-[45rem]" />
		</div>
	</section>


	<div class="w-full mx-auto flex max-w-7xl gap-6 px-4 bg-base">
        <ForumFeed loadedPosts={data.posts}/>

        <Links />
	</div>
</main>
