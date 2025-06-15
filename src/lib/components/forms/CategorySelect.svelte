<script lang="ts">
    const { categoryList } = $props();
</script>

<div>
    <label for="category" class="content text-md mb-2 block font-medium">
        Category <span class="color-error">*</span></label
    >
    <select
        id="category"
        name="category"
        required
        class="input border-muted w-full cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
    >
        <option value="">Select a category</option>
        {#each categoryList as cat}
            <option value={cat}>{cat}</option>
        {/each}
    </select>
</div>