<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import CategoryFilter from '$lib/components/CategoryFilter.svelte';
	import Filter from '$lib/components/forum/Filter.svelte';
	import ForumFeed from '$lib/components/forum/ForumFeed.svelte';
	import Pagination from '$lib/components/forum/Pagination.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import CategoryClient from '$lib/tools/CategoryClient.ts';
	import PostClient from '$lib/tools/PostClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let isInitialLoading = $state(true);
	let isPaginationLoading = $state(false);
	let error = $state<string | null>(null);

	const session = authClient.useSession();

	let posts: any = $state();
	let pagination: any = $state();
	let categoryList: any = $state();
	let selectedCategory: string = $state('all');
	let orderBy: string = $state('desc');

		$effect(() => {
			console.log(posts)
		})

	const changeOrder = async (order: string) => {
		if (orderBy === order.toLocaleLowerCase()) return;
		orderBy = order.toLocaleLowerCase();
		await fetchPosts(1);
		return;
	};

	const changeCategory = async (selected: string) => {
		selectedCategory = selected;
		await fetchPosts(pagination.currentPage);
		return selectedCategory;
	};

	const fetchPosts = async (page: number) => {
		if (selectedCategory !== 'all') {
			const response = await PostClient.getPostsByCategory(
				orderBy,
				selectedCategory.toLocaleLowerCase(),
				page
			);
			posts = response.posts;
			pagination = response.pagination;
		} else {
			const response = await PostClient.getAllPosts(orderBy, page);
			posts = response.posts;
			pagination = response.pagination;
		}
	};

	const incrementPage = async () => {
		if (pagination.currentPage >= pagination.totalPages) {
			return;
		}

		isPaginationLoading = true;
		error = null;

		try {
			const page = pagination.currentPage + 1;
			await fetchPosts(page);
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
			const page = pagination.currentPage - 1;
			await fetchPosts(page);
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
			const response = await PostClient.getAllPosts(orderBy, 1);
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
			const postResponse = await PostClient.getAllPosts(orderBy, 1);
			const categoryResponse = await CategoryClient.getCategories();
			categoryList = categoryResponse;
			posts = postResponse.posts;
			pagination = postResponse.pagination;
		} catch (err) {
			error = 'Failed to load posts. Please check your connection and try again.';
			console.error('Error loading posts:', err);
		} finally {
			isInitialLoading = false;
		}
	});
</script>

<Header />
<main class="border-muted mx-auto mb-16 max-w-7xl">
	<Hero />
	<div class="bg-base mx-auto flex w-full flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:gap-8 lg:p-12">
		<div class="w-full lg:w-3/4">
			{#if isInitialLoading}
				<section class="flex min-h-64 flex-col items-center justify-center gap-4">
					<Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl"/>
					<p class="text-muted text-sm sm:text-base">Loading posts...</p>
				</section>
			{:else if error && !posts}
				<section class="flex min-h-64 flex-col items-center justify-center gap-4 px-4">
					<Icon icon="material-symbols:error-outline" class="text-3xl text-red-500 sm:text-4xl" />
					<p class="text-center text-sm text-red-500 sm:text-base">{error}</p>
					<button
						class="btn-big rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 sm:text-base"
						onclick={retryLoading}
					>
						Try Again
					</button>
				</section>
			{:else if posts && pagination}
				<div class="flex flex-col gap-4">
					{#if error}
						<div
							class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700 sm:text-base"
						>
							<p>{error}</p>
						</div>
					{/if}

					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex flex-col gap-2">
							<h2 class="text-2xl sm:text-3xl lg:text-4xl">Virarith Forums</h2>
							<p class="muted text-sm sm:text-base">
								Discuss the latest and greatest happening on Virarith!
							</p>
						</div>
						{#if $session.data?.user}
							<button
								class="btn-small self-start text-sm sm:self-auto sm:text-base"
								onclick={() => goto('/pages/create_post')}
							>
								Create Post
							</button>
						{/if}
					</div>

					<div class="flex flex-col gap-4 lg:hidden">
						<h4 class="text-xl sm:text-2xl">Categories</h4>
						{#if categoryList}
							<CategoryFilter {categoryList} {changeCategory} {selectedCategory} />
						{/if}
					</div>

					<div class="flex items-center justify-between gap-2">
						<div class="order-2 sm:order-1">
							<Pagination {pagination} {decrementPage} {incrementPage} {isPaginationLoading} />
						</div>
						<div class="order-1 sm:order-2">
							<Filter {changeOrder} />
						</div>
					</div>

					<div class="relative">
						{#if isPaginationLoading}
							<div class="flex min-h-64 flex-col items-center justify-center gap-4">
								<Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl"/>
								<p class="text-muted text-sm sm:text-base">Loading posts...</p>
							</div>
						{/if}
						<ForumFeed {posts} />
					</div>

					<div class="flex justify-center sm:justify-start">
						<Pagination {pagination} {decrementPage} {incrementPage} {isPaginationLoading} />
					</div>
				</div>
			{/if}
		</div>

		<aside class="hidden w-full flex-col gap-4 lg:flex lg:w-1/4 lg:gap-6">
			<h4 class="text-xl sm:text-2xl">Categories</h4>
			{#if categoryList}
				<CategoryFilter {categoryList} {changeCategory} {selectedCategory} />
			{/if}
		</aside>
	</div>
</main>
