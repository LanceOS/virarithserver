<script lang="ts">
	import Header from '$lib/client/components/landing/Header.svelte';
	import Hero from '$lib/client/components/home/Hero.svelte';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types.js';
	import Footer from '$lib/client/components/landing/Footer.svelte';
	import RoleCard from '$lib/client/components/cards/RoleCard.svelte';
	import { PUBLIC_MC_SERVER_IP } from '$env/static/public';
	import { toast } from '@zerodevx/svelte-toast';

	const { data } = $props<{ data: PageData }>();

	const staffUsers = data.staff;

	let copied = $state(false);

	const serverIp = PUBLIC_MC_SERVER_IP

	const copyIpToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(serverIp);
			copied = true;

			setTimeout(() => (copied = false), 2000);
		} catch (error: any) {
			toast.push(error.message)
		}
	};
</script>

<Header />

<main class="space-y-8">
	<Hero />

	<div class="mx-auto flex max-w-7xl flex-col gap-8 px-4">
		<section class="h-fit w-full gap-6">
			<div class="card-setup flex flex-col gap-6 text-center">
				<h2 class="mb-4 text-3xl font-bold">Ready to Start Your Adventure?</h2>
				<p class="muted mx-auto max-w-2xl text-lg">
					VirarithMC is an MMORPG Kingdoms PvPvE server like no other. We offer a multitude of
					things from custom crafting, custom ores, custom farming, and custom cooking. Players are
					also able to create Kingdoms and expand into Nations as they begin their conquest.
				</p>

				<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<button class="btn-big"> Join Server Now </button>
					<a href="/pages/vote" class="btn-big-active"> Vote </a>
				</div>
				<div class="border-muted mx-auto w-full p-4 sm:max-w-1/2 sm:p-8">
					<div class="flex items-center justify-between gap-2 sm:gap-4">
						<code class="flex-1 w-fit text-left text-base whitespace-nowrap sm:text-lg">
							{serverIp}
						</code>
						<button
							onclick={copyIpToClipboard}
							class="btn-small {copied ? 'btn-small-active' : ''} flex-shrink-0"
						>
							{#if copied}
								<Icon icon="lucide:check" class="mr-2 h-4 w-4" />
								Copied
							{:else}
								<Icon icon="lucide:copy" class="mr-2 h-4 w-4" />
								Copy
							{/if}
						</button>
					</div>
				</div>
			</div>
		</section>
		{#if staffUsers}
			<section class="flex h-full w-full flex-col gap-4">
				<h3 class="content text-2xl font-semibold">Our Staff</h3>
				<div class="flex max-h-60 flex-wrap gap-4 overflow-y-auto pr-2">
					{#each staffUsers as staff}
						<div class="flex items-center gap-3 py-2">
							{#if staff.image && staff.image !== 'placeholder'}
								<div class="user-avatar h-10 w-10 flex-shrink-0">
									<img
										src={staff.image}
										alt="Staff Avatar"
										class="h-full w-full rounded-full object-cover"
									/>
								</div>
							{/if}
							<div class="flex flex-col items-center gap-2">
								<RoleCard role={staff.role} />
								<a
									class="btn-nav text-base font-medium"
									style="color: var(--color-base-content)"
									href={`/pages/profile/${staff.id}`}
								>
									{staff.name}
								</a>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}
		<section class="w-full">
			<div class="flex flex-col items-center gap-6 sm:flex-row">
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
					<a href="/pages/vote" class="read-more-btn">
						Vote Now
						<Icon icon="lucide:arrow-right" class="h-4 w-4" />
					</a>
				</div>
			</div>
		</section>
	</div>
</main>
<Footer />

<style>
	/* Custom animations will inherit from your app.css fade-up animation */
</style>
