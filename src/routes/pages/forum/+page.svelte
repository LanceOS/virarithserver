<script lang="ts">
	import { goto } from '$app/navigation';
	import type { IPagination, PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import { authClient } from '$lib/auth-client.ts';
	import CategoryFilter from '$lib/components/forms/CategoryFilter.svelte';
	import Filter from '$lib/components/forum/Filter.svelte';
	import ForumFeed from '$lib/components/forum/ForumFeed.svelte';
	import Pagination from '$lib/components/forum/Pagination.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import PostClient from '$lib/tools/PostClient.ts';
	import CategoryClient from '$lib/tools/CategoryClient.ts';
	import { onMount } from 'svelte';

	let isInitialLoading = $state(true);
	let isPaginationLoading = $state(false);
	let errorLog = $state<string | null>(null);

	const session = authClient.useSession();

	let posts: PostWithImage[] | undefined = $state();
	let pagination: IPagination | undefined = $state();
	let categoryList: any = $state();
	let selectedCategory: string = $state('all');
	let orderBy: string = $state('desc');

	const changeOrder = async (order: string) => {
		if (orderBy === order.toLocaleLowerCase()) return;
		orderBy = order.toLocaleLowerCase();
		await fetchPosts(1);
		return;
	};

	const changeCategory = async (selected: string) => {
		selectedCategory = selected;
		await fetchPosts(pagination?.currentPage!);
		return selectedCategory;
	};

	const fetchPosts = async (page: number) => {
		isPaginationLoading = true;
		try {
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
		} catch (error) {
			console.error('Error loading posts:', error);
			errorLog = 'Failed to load posts. Please check your connection and try again.';
		} finally {
			isPaginationLoading = false;
		}
	};

	const incrementPage = async () => {
		if (pagination?.currentPage! >= pagination?.totalPages!) {
			return;
		}
		const page = pagination?.currentPage! + 1;
		await fetchPosts(page);
	};

	const decrementPage = async () => {
		if (pagination?.currentPage! <= 1) {
			return;
		}
		const page = pagination?.currentPage! - 1;
		await fetchPosts(page);
	};

	const retryLoading = async () => {
		isInitialLoading = true;
		errorLog = null;
		try {
			const response = await PostClient.getAllPosts(orderBy, 1);
			posts = response.posts;
			pagination = response.pagination;
		} catch (error) {
			errorLog = 'Failed to load posts. Please check your connection and try again.';
			console.error('Error loading posts:', error);
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
		} catch (error) {
			errorLog = 'Failed to load posts. Please check your connection and try again.';
			console.error('Error loading posts:', error);
		} finally {
			isInitialLoading = false;
		}
	});
</script>

<Header />
<main class="mx-auto max-w-7xl px-4 py-8">
	<section class="mb-8 border-b-1 border-[var(--color-muted)] pb-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h1 class="text-3xl font-semibold">Forums</h1>
				<p class="font-regular">Discuss the latest and greatest happening on Virarith!</p>
			</div>
			{#if $session.data?.user}
				<button class="btn-small-active" onclick={() => goto('/pages/create_post')}>
					Create Post
				</button>
			{/if}
		</div>
	</section>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
		<aside class="lg:col-span-1">
			<div class="border-muted bg-card sticky top-6 p-6">
				<h2 class="mb-2 text-lg font-light">Categories</h2>
				{#if categoryList}
					<CategoryFilter {categoryList} {changeCategory} {selectedCategory} />
				{:else if !isInitialLoading}
					<p class="muted">Could not load categories.</p>
				{/if}
			</div>
		</aside>

		<div class="lg:col-span-3">
			{#if posts && posts.length > 0}
				<div class="mb-4 flex items-center justify-end">
					<Filter {changeOrder} />
				</div>
			{/if}

			<ForumFeed {posts} />

			{#if pagination && pagination.totalPages > 1}
				<div class="mt-8 flex justify-center">
					<Pagination {pagination} {incrementPage} {decrementPage} {isPaginationLoading} />
				</div>
			{/if}
		</div>
	</div>
</main>
