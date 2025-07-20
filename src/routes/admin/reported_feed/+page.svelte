<script lang="ts">
	import type { IPagination } from '$lib/@types/IPagination.ts';
	import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import Pagination from '$lib/client/components/forum/Pagination.svelte';
	import Header from '$lib/client/components/landing/Header.svelte';
	import type { CommentSchema } from '$lib/server/schemas/Comments.ts';
	import { onMount } from 'svelte';
	import ReportedPostFeed from '$lib/client/components/report/ReportedPostFeed.svelte';
	import ReportedCommentFeed from '$lib/client/components/report/ReportedCommentFeed.svelte';
	import { toast } from '@zerodevx/svelte-toast';

	let posts: PostWithImage[] | undefined = $state();
	let comments: CommentSchema[] | undefined = $state();

	let pagination: IPagination | undefined = $state();
	let postPagination: IPagination | undefined = $state();
	let commentPagination: IPagination | undefined = $state();

	let usernameInput: string = $state('');

	let orderBy: string = $state('desc');
	let isPaginationLoading: boolean = $state(false);
	let activeTab: 'posts' | 'comments' = $state('posts');

	/**
	 * Fetches either posts or comments based on the specified type and page.
	 */
	const fetchData = async (type: 'posts' | 'comments', page: number) => {
		isPaginationLoading = true;
		try {
			const response = await fetch(
				`/admin/reported_feed/${type}?page=${page}&orderBy=${orderBy}&username=${usernameInput || ''}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				}
			);

			if (response.status !== 200) {
				throw new Error(`Failed to fetch ${type}`);
			}

			const data = await response.json();

			if (type === 'posts') {
				posts = data.posts;
				postPagination = data.pagination;
				pagination = postPagination;
			} else {
				comments = data.comments;
				commentPagination = data.pagination;
				pagination = commentPagination;
			}
		} catch (error: any) {
			toast.push(`Error loading ${type}`);
			if (type === 'posts') {
				posts = [];
			} else {
				comments = [];
			}
		} finally {
			isPaginationLoading = false;
		}
	};

	const incrementPage = async () => {
		if (!pagination || pagination.currentPage >= pagination.totalPages) {
			return;
		}
		await fetchData(activeTab, pagination.currentPage + 1);
	};

	const decrementPage = async () => {
		if (!pagination || pagination.currentPage <= 1) {
			return;
		}
		await fetchData(activeTab, pagination.currentPage - 1);
	};

	/**
	 * Switches the active tab and fetches its data if it hasn't been loaded yet.
	 */
	const changeTab = async (tab: 'posts' | 'comments') => {
		activeTab = tab;
		if (tab === 'posts') {
			if (!posts) {
				await fetchData('posts', 1);
			} else {
				pagination = postPagination;
			}
		} else {
			if (!comments) {
				await fetchData('comments', 1);
			} else {
				pagination = commentPagination;
			}
		}
	};

	const getByName = async () => {
		await fetchData(activeTab, 1)
		console.log("data")
	}

	onMount(async () => {
		await fetchData(activeTab, 1);
	});
</script>

<Header />
<main class="mx-auto max-w-7xl space-y-4 px-4 pb-16">
	<section class="card-setup space-y-4">
		<h1 class="text-2xl">Search post or comments by username.</h1>
		<input type="text" class="input" bind:value={usernameInput}/>
		<button type="button" class="btn-small" onclick={getByName}>Search</button>
	</section>

	<div>
		<div class="card-border-subtle mb-6 border-b">
			<nav class="-mb-px flex space-x-6">
				<button
					onclick={() => changeTab('posts')}
					class:text-[var(--color-primary)]={activeTab === 'posts'}
					class:border-[var(--color-primary)]={activeTab === 'posts'}
					class:border-transparent={activeTab !== 'posts'}
					class="btn-nav inline-flex items-center border-b-2 px-1 py-3 text-base font-semibold"
				>
					Posts
				</button>
				<button
					onclick={() => changeTab('comments')}
					class:text-[var(--color-primary)]={activeTab === 'comments'}
					class:border-[var(--color-primary)]={activeTab === 'comments'}
					class:border-transparent={activeTab !== 'comments'}
					class="btn-nav inline-flex items-center border-b-2 px-1 py-3 text-base font-semibold"
				>
					Comments
				</button>
			</nav>
		</div>

		{#if pagination && pagination.totalPages > 1}
			<div class="mb-8 flex justify-center">
				<Pagination {pagination} {incrementPage} {decrementPage} {isPaginationLoading} />
			</div>
		{/if}

		{#if activeTab === 'posts'}
			<ReportedPostFeed {posts} />
		{:else if activeTab === 'comments'}
			<ReportedCommentFeed {comments} />
		{/if}

		{#if pagination && pagination.totalPages > 1}
			<div class="mt-8 flex justify-center">
				<Pagination {pagination} {incrementPage} {decrementPage} {isPaginationLoading} />
			</div>
		{/if}
	</div>
</main>
