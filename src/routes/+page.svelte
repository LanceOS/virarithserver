<script lang="ts">
	import type { IPagination, PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import Header from '$lib/components/landing/Header.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import LatestAnnouncement from '$lib/components/landing/LatestAnnouncement.svelte';
	import Links from '$lib/components/Links.svelte';
	import PostClient from '$lib/tools/PostClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let isInitialLoading = $state(true);
	let isPaginationLoading = $state(false);
	let error = $state<string | null>(null);

	let posts: PostWithImage | undefined = $state();
	let pagination: IPagination | undefined = $state();

	let orderBy: string = $state('desc');

	// Animation states
	let discordVisible = false;
	let featuresVisible = false;
	let communityVisible = false;

	const scrollToTop = () => {
		window.scrollTo(0, 0);
	};

	const changeOrder = async (order: string) => {
		if (orderBy === order.toLocaleLowerCase()) return;
		orderBy = order.toLocaleLowerCase();
		await fetchPosts(1);
		return;
	};

	const fetchPosts = async (page: number) => {
		const response = await PostClient.getPostsByCategory(orderBy, 'updates', page);
		posts = response.posts;
		pagination = response.pagination;
	};

	const retryLoading = async () => {
		isInitialLoading = true;
		error = null;

		try {
			const response = await PostClient.getPostsByCategory(orderBy, 'updates', 1);
			posts = response.posts;
			pagination = response.pagination;
		} catch (err) {
			error = 'Failed to load posts. Please check your connection and try again.';
			console.error('Error loading posts:', err);
		} finally {
			isInitialLoading = false;
		}
	};

	onMount(async () => {
		try {
			const response = await PostClient.getPostsByCategory(orderBy, 'updates', 1);
			posts = response.posts;
			pagination = response.pagination;
		} catch (err) {
			error = 'Failed to load posts. Please check your connection and try again.';
			console.error('Error loading posts:', err);
		} finally {
			isInitialLoading = false;
		}

		// Trigger animations with delays
		setTimeout(() => discordVisible = true, 200);
		setTimeout(() => featuresVisible = true, 400);
		setTimeout(() => communityVisible = true, 600);
	});

	const features = [
		{
			title: "Custom Game Modes",
			description: "Experience unique survival, creative, and minigame experiences crafted by our team",
			icon: "🎮"
		},
		{
			title: "Economy System",
			description: "Build your wealth through trading, shops, and completing challenging quests",
			icon: "💰"
		},
		{
			title: "Ranks & Perks",
			description: "Unlock exclusive privileges and show off your status as you progress",
			icon: "⭐"
		},
		{
			title: "24/7 Support",
			description: "Our dedicated staff team is always here to help with any issues",
			icon: "🛡️"
		}
	];
</script>

<Header />
<main class="mx-auto max-w-7xl flex flex-col pb-16 gap-12 px-4 sm:px-6 lg:px-8">
	<Hero />
	
	<!-- Latest Announcement & Discord Section -->
	<section class="w-full flex flex-col lg:flex-row gap-8">
		<div class="w-full lg:w-3/4">
			<LatestAnnouncement />
		</div>
		<div class="w-full lg:w-1/4 flex flex-col gap-8" class:animate-fade-up={discordVisible}>
			<div class="flex flex-col gap-4 w-full">
				<h3 class="text-lg font-semibold content">Join Our Discord</h3>
				<button class="btn-discord flex items-center gap-2">
					<Icon icon="ic:baseline-discord" class="w-5 h-5" />
					Discord
				</button>
			</div>
			<div class="flex flex-col gap-4 w-full">
				<h3 class="text-lg font-semibold content">Our Staff</h3>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="w-full" class:animate-fade-up={featuresVisible}>
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold content mb-4">Why Choose Our Server?</h2>
			<p class="muted text-lg max-w-2xl mx-auto">
				Discover what makes our Minecraft server the perfect place to build, explore, and make friends
			</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each features as feature}
				<div class="card-setup rounded-lg text-center hover:shadow-lg transition-all duration-300 group">
					<div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
						{feature.icon}
					</div>
					<h3 class="text-xl font-semibold content mb-3">{feature.title}</h3>
					<p class="muted text-sm leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Community & Join Section -->
	<section class="w-full" class:animate-fade-up={communityVisible}>
		<div class="card-setup rounded-lg text-center">
			<h2 class="text-3xl font-bold content mb-4">Ready to Start Your Adventure?</h2>
			<p class="muted text-lg mb-8 max-w-2xl mx-auto">
				Join thousands of players in our thriving community. Whether you're a builder, explorer, or competitor, there's a place for you here.
			</p>
			
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
				<button class="btn-big">
					Join Server Now
				</button>
				<button class="btn-discord">
					Join Discord
				</button>
			</div>

			<div class="bg-card p-6 rounded-lg border-muted inline-block">
				<p class="muted text-sm mb-2">Server IP:</p>
				<p class="content text-xl font-mono font-semibold" style="color: var(--color-primary)">
					play.yourserver.com
				</p>
			</div>
		</div>
	</section>

	<!-- Quick Links -->
	<section class="w-full">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="card-setup rounded-lg text-center">
				<h3 class="text-lg font-semibold content mb-3">Server Rules</h3>
				<p class="muted text-sm mb-4">Read our community guidelines to ensure everyone has a great time</p>
				<button class="read-more-btn">
					View Rules
					<Icon icon="lucide:arrow-right" class="w-4 h-4" />
				</button>
			</div>
			
			<div class="card-setup rounded-lg text-center">
				<h3 class="text-lg font-semibold content mb-3">Staff Applications</h3>
				<p class="muted text-sm mb-4">Interested in helping manage our community? Apply to join our team</p>
				<button class="read-more-btn">
					Apply Now
					<Icon icon="lucide:arrow-right" class="w-4 h-4" />
				</button>
			</div>
			
			<div class="card-setup rounded-lg text-center">
				<h3 class="text-lg font-semibold content mb-3">Vote for Us</h3>
				<p class="muted text-sm mb-4">Support the server and earn rewards by voting on server lists</p>
				<button class="read-more-btn">
					Vote Now
					<Icon icon="lucide:arrow-right" class="w-4 h-4" />
				</button>
			</div>
		</div>
	</section>
</main>

<style>
	/* Custom animations will inherit from your app.css fade-up animation */
</style>