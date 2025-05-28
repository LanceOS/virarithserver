<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import ForumFeed from '$lib/components/ForumFeed.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Links from '$lib/components/Links.svelte';
	import PostClient from '$lib/tools/PostClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let isInitialLoading = $state(true);
	let isPaginationLoading = $state(false);
	let error = $state<string | null>(null);

	const session = authClient.useSession();

	let posts: any = $state();
	let pagination: any = $state();

	$effect(() => {
		console.log(pagination);
	});

	const increasePage = async () => {
		if (pagination.currentPage >= pagination.totalPages) {
			console.log('returning');
			return;
		}

		isPaginationLoading = true;
		error = null;

		try {
			const nextPage = pagination.currentPage + 1;
			const response = await PostClient.getPostsByCategory({ category: "devlogs", page: nextPage });
			posts = response.posts;
			pagination = response.pagination;
		} catch (err) {
			error = 'Failed to load next page. Please try again.';
			console.error('Error loading next page:', err);
		} finally {
			isPaginationLoading = false;
		}
	};

	const decrementPage = async () => {
		if (pagination.currentPage <= 1) {
			return;
		}

		isPaginationLoading = true;
		error = null;

		try {
			const lastPage = pagination.currentPage - 1;
			const response = await PostClient.getPostsByCategory({ category: "devlogs", page: lastPage });
			posts = response.posts;
			pagination = response.pagination;
		} catch (err) {
			error = 'Failed to load previous page. Please try again.';
			console.error('Error loading previous page:', err);
		} finally {
			isPaginationLoading = false;
		}
	};

	const retryLoading = async () => {
		isInitialLoading = true;
		error = null;

		try {
			const response = await PostClient.getPostsByCategory({ category: "devlogs", page: 1 });
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
			const response = await PostClient.getPostsByCategory({ category: "devlogs", page: 1 });
			posts = response.posts;
			pagination = response.pagination;
		} catch (err) {
			error = 'Failed to load posts. Please check your connection and try again.';
			console.error('Error loading posts:', err);
		} finally {
			isInitialLoading = false;
		}
	});
</script>

<Header />
<main class="border-muted mx-auto flex max-w-7xl flex-col pb-16">
	<Hero />

	<div class="bg-base mx-auto flex w-full gap-8 p-12">
		<div class="flex w-full flex-col gap-8">
			{#if isInitialLoading}
				<div class="flex min-h-64 flex-col items-center justify-center gap-4 p-8">
					<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-current"></div>
					<p class="text-muted">Loading posts...</p>
				</div>
			{:else if error && !posts}
				<div class="flex min-h-64 flex-col items-center justify-center gap-4 p-8">
					<Icon icon="material-symbols:error-outline" class="text-4xl text-red-500" />
					<p class="text-center text-red-500">{error}</p>
					<button
						class="btn-big rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						onclick={retryLoading}
					>
						Try Again
					</button>
				</div>
			{:else if posts && pagination}
				<div class="flex flex-col gap-4">
					{#if error}
						<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
							<p>{error}</p>
						</div>
					{/if}

					<div class="flex flex-col gap-2">
						<h2 class="text-4xl">Devlogs</h2>
						<p class="muted">See the latest updates from Virarith</p>
					</div>

					<div class="flex items-center gap-4">
						<button
							onclick={() => decrementPage()}
							disabled={!pagination.hasPrevious || isPaginationLoading}
							type="button"
							aria-label="Previous Page"
							class={`${!pagination.hasPrevious || isPaginationLoading ? 'muted border-muted opacity-50' : 'content border'} cursor-pointer p-2 text-xl transition-opacity`}
						>
							{#if isPaginationLoading}
								<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-current"></div>
							{:else}
								<Icon icon="material-symbols:arrow-left-alt" />
							{/if}
						</button>
						<p>{pagination.currentPage}</p>
						<p>...</p>
						{#if pagination.hasNext}
							<p>{pagination.totalPages}</p>
						{:else}
							<p>...</p>
						{/if}
						<button
							onclick={() => increasePage()}
							disabled={!pagination.hasNext || isPaginationLoading}
							type="button"
							aria-label="Next Page"
							class={`${!pagination.hasNext || isPaginationLoading ? 'muted border-muted opacity-50' : 'content border'} cursor-pointer p-2 text-xl transition-opacity`}
						>
							{#if isPaginationLoading}
								<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-current"></div>
							{:else}
								<Icon icon="material-symbols:arrow-right-alt" />
							{/if}
						</button>
					</div>

					<div class="relative">
						{#if isPaginationLoading}
							<div class="flex min-h-64 flex-col items-center justify-center gap-4 p-8">
								<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-current"></div>
								<p class="text-muted">Loading posts...</p>
							</div>
						{/if}
						<ForumFeed {posts} />
					</div>

					<div class="flex items-center gap-4">
						<button
							onclick={() => decrementPage()}
							disabled={!pagination.hasPrevious || isPaginationLoading}
							type="button"
							aria-label="Previous Page"
							class={`${!pagination.hasPrevious || isPaginationLoading ? 'muted border-muted opacity-50' : 'content border'} cursor-pointer p-2 text-xl transition-opacity`}
						>
							{#if isPaginationLoading}
								<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-current"></div>
							{:else}
								<Icon icon="material-symbols:arrow-left-alt" />
							{/if}
						</button>
						<p>{pagination.currentPage}</p>
						<p>...</p>
						{#if pagination.hasNext}
							<p>{pagination.totalPages}</p>
						{:else}
							<p>...</p>
						{/if}
						<button
							onclick={() => increasePage()}
							disabled={!pagination.hasNext || isPaginationLoading}
							type="button"
							aria-label="Next Page"
							class={`${!pagination.hasNext || isPaginationLoading ? 'muted border-muted opacity-50' : 'content border'} cursor-pointer p-2 text-xl transition-opacity`}
						>
							{#if isPaginationLoading}
								<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-current"></div>
							{:else}
								<Icon icon="material-symbols:arrow-right-alt" />
							{/if}
						</button>
					</div>
				</div>
			{/if}
			<ForumFeed {posts} />
		</div>

		<Links />
	</div>
</main>
