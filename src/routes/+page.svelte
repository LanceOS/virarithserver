<script lang="ts">
	import type { IPagination, PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import Header from '$lib/components/landing/Header.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
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

	const incrementPage = async () => {
		if (pagination?.currentPage! >= pagination?.totalPages!) {
			console.log('returning');
			return;
		}

		isPaginationLoading = true;
		error = null;

		try {
			const nextPage = pagination?.currentPage! + 1;
			const response = await PostClient.getPostsByCategory(orderBy, 'updates', nextPage);
			posts = response.posts;
			pagination = response.pagination;
		} catch (err) {
			error = 'Failed to load next page. Please try again.';
			console.error('Error loading next page:', err);
		} finally {
			isPaginationLoading = false;
			scrollToTop();
		}
	};

	const decrementPage = async () => {
		if (pagination?.currentPage! <= 1) {
			return;
		}

		isPaginationLoading = true;
		error = null;

		try {
			const lastPage = pagination?.currentPage! - 1;
			const response = await PostClient.getPostsByCategory(orderBy, 'updates', lastPage);
			posts = response.posts;
			pagination = response.pagination;
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
	});
</script>

<Header />
<main class="mx-auto border-muted max-w-7xl flex flex-col pb-16">
	<Hero />

</main>
