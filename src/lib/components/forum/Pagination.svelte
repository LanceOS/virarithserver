<script lang="ts">
    import Icon from '@iconify/svelte';

    let { pagination, decrementPage, incrementPage, isPaginationLoading } = $props<{
        pagination: {
            currentPage: number;
            totalPages: number;
            hasPrevious: boolean;
            hasNext: boolean;
        };
        decrementPage: () => void;
        incrementPage: () => void;
        isPaginationLoading: boolean;
    }>();
</script>

<div class="flex items-center gap-4">
    <button
        onclick={() => decrementPage()}
        disabled={!pagination.hasPrevious || isPaginationLoading}
        type="button"
        aria-label="Previous Page"
        class="pagination-button"
    >
        {#if isPaginationLoading}
            <Icon icon="svg-spinners:blocks-shuffle-3" class="pagination-spinner-icon" />
        {:else}
            <Icon icon="material-symbols:arrow-left-alt" />
        {/if}
    </button>

    <p class="pagination-info">{pagination.currentPage}</p>

    {#if pagination.currentPage < pagination.totalPages && pagination.totalPages > 1}
        <p class="pagination-info">...</p>
    {/if}

    {#if pagination.totalPages > 1 && pagination.currentPage !== pagination.totalPages}
        <p>{pagination.totalPages}</p>
    {/if}

    <button
        onclick={() => incrementPage()}
        disabled={!pagination.hasNext || isPaginationLoading}
        type="button"
        aria-label="Next Page"
        class="pagination-button"
    >
        {#if isPaginationLoading}
            <Icon icon="svg-spinners:blocks-shuffle-3" class="pagination-spinner-icon" />
        {:else}
            <Icon icon="material-symbols:arrow-right-alt" />
        {/if}
    </button>
</div>