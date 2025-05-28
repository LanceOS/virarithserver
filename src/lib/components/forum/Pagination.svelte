<script lang="ts">
	import Icon from '@iconify/svelte';

	let { pagination, decrementPage, increasePage, isPaginationLoading } = $props();
</script>

{#snippet Pagination()}
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
{/snippet}

<div class="flex items-center gap-4">
    {@render Pagination()}
</div>
