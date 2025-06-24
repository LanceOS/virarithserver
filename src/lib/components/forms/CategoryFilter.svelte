<script lang="ts">
    import Icon from '@iconify/svelte';

    type Category = {
        topic: string;
    };

    const { changeCategory, categoryList, selectedCategory } = $props<{
        changeCategory: (category: string) => void;
        categoryList: Category[];
        selectedCategory: string;
    }>();

    const getButtonClass = (categoryTopic: string) => {

        const baseClasses =
            'flex w-full items-center gap-3 rounded-md p-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] focus:ring-offset-[var(--color-base)]';

        if (categoryTopic === selectedCategory) {
            return `${baseClasses} bg-[var(--color-input)] text-[var(--color-base-content)] font-semibold`;
        }
        
        return `${baseClasses} cursor-pointer text-[var(--color-muted)] font-medium hover:bg-[var(--color-input)] hover:text-[var(--color-base-content)]`;
    };
</script>

<nav class="flex flex-col gap-1" aria-label="Categories">
    <button type="button" onclick={() => changeCategory('all')} class={getButtonClass('all')}>
        <Icon icon="mdi:minecraft" />
        <span>ALL</span>
    </button>

    {#if categoryList}
        {#each categoryList as category}
            <button
                type="button"
                onclick={() => changeCategory(category.topic)}
                class={getButtonClass(category.topic)}
            >
                <Icon icon="mdi:minecraft" />
                <span class="truncate">{category.topic.toUpperCase()}</span>
            </button>
        {/each}
    {/if}
</nav>