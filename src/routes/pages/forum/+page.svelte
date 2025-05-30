<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import CategoryFilter from '$lib/components/CategoryFilter.svelte';
	import Create from '$lib/components/Create.svelte';
	import ForumFeed from '$lib/components/forum/ForumFeed.svelte';
	import Pagination from '$lib/components/forum/Pagination.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import CategoryClient from '$lib/tools/CategoryClient.ts';
	import PostClient from '$lib/tools/PostClient.ts';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let createPost = $state(false);
	let isInitialLoading = $state(true);
	let isPaginationLoading = $state(false);
	let error = $state<string | null>(null);

	const session = authClient.useSession();

	let posts: any = $state();
	let pagination: any = $state();
	let selectedCategory: string = $state("all");
	let categoryList: any = $state();

	const scrollToTop = () => {
		window.scrollTo(0, 0);
	};

	const changeCategory = async (selected: string) => {
		selectedCategory = selected.toLocaleLowerCase();
		await fetchPosts(pagination.currentPage)
		return selectedCategory;
	};

	const fetchPosts = async (page: number) => {
		if (selectedCategory !== 'all') {
			const response =  await PostClient.getPostsByCategory(selectedCategory, page);
			posts = response.posts;
			pagination = response.pagination;
		} else {
			const response = await PostClient.getAllPosts(page);
			posts = response.posts;
			pagination = response.pagination;
		}
	};

	const increasePage = async () => {
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
			scrollToTop();
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
			scrollToTop();
		}
	};

	const retryLoading = async () => {
		isInitialLoading = true;
		error = null;

		try {
			const response = await PostClient.getAllPosts(1);
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
			const postResponse = await PostClient.getAllPosts(1);
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
	<div class="bg-base mx-auto flex w-full gap-8 p-12">
		<div class="w-full">
			{#if isInitialLoading}
				<div class="flex min-h-64 flex-col items-center justify-center gap-4">
					<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-current"></div>
					<p class="text-muted">Loading posts...</p>
				</div>
			{:else if error && !posts}
				<div class="flex min-h-64 flex-col items-center justify-center gap-4">
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

					<div class="flex items-center justify-between">
						<h2 class="text-4xl">Virarith Forums</h2>
						{#if $session}
							<button class="btn-small" onclick={() => (createPost = !createPost)}
								>Create Post</button
							>
						{/if}

						{#if $session && createPost}
							<Create />
						{/if}
					</div>

					<div class="flex items-center justify-between">
						<Pagination {pagination} {decrementPage} {increasePage} {isPaginationLoading} />
					</div>

					<div class="relative">
						{#if isPaginationLoading}
							<div class="flex min-h-64 flex-col items-center justify-center gap-4">
								<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-current"></div>
								<p class="text-muted">Loading posts...</p>
							</div>
						{/if}
						<ForumFeed {posts} />
					</div>

					<Pagination {pagination} {decrementPage} {increasePage} {isPaginationLoading} />
				</div>
			{/if}
		</div>
		<div class="flex w-1/4 flex-col gap-6">
			<h4 class="text-2xl">Topics</h4>
			{#if categoryList}
				<CategoryFilter {categoryList} {changeCategory} {selectedCategory} />
			{/if}
		</div>
	</div>
</main>
