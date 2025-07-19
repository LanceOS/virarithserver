<script lang="ts">
    const { categoryList, currentCategory } = $props<{
        categoryList: string[];
        currentCategory?: string;
    }>();

    let selectedCategory = $state(currentCategory || 'Select a category');

    $effect(() => {
        if (currentCategory !== undefined) {
            selectedCategory = currentCategory;
        } else {
            selectedCategory = 'Select a category';
        }
    });
</script>

<div>
    <label for="category" class="mb-2 block text-md font-medium" style="color: var(--color-base-content);">
        Category <span style="color: var(--color-error);">*</span></label
    >
    <select
        id="category"
        name="category"
        bind:value={selectedCategory}
        required
        class="dropdown-selector w-full"
    >
        <option value="Select a category" disabled selected>Select a category</option>

        {#each categoryList as cat}
            <option value={cat}>{cat}</option>
        {/each}
    </select>
</div>