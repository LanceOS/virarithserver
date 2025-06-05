<script lang="ts">
	const { changeCategory, categoryList, selectedCategory } = $props();

	const handleSelectChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		changeCategory(target.value);
	};
</script>

<!-- Mobile View -->
<div class="block lg:hidden">
	<label for="category-select" class="sr-only">Select Category</label>
	<select
		id="category-select"
		class="border-muted w-full px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
		value={selectedCategory}
		onchange={handleSelectChange}
	>
		{#if categoryList}
			{#each categoryList as category}
				<option value={category.topic} class="bg-base">{category.topic.toUpperCase()}</option>
			{/each}
		{/if}
	</select>
</div>

<!-- Desktop View -->
<div class="hidden h-fit flex-col gap-6 lg:flex">
	{#if categoryList}
		{#each categoryList as category}
			<button
				type="button"
				aria-label="Select Topic"
				class={category.topic === selectedCategory
					? 'border-muted btn-small-active cursor-pointer p-2 text-white'
					: 'border-muted cursor-pointer p-2'}
				onclick={() => changeCategory(category.topic)}
			>
				{category.topic.toUpperCase()}
			</button>
		{/each}
	{/if}
</div>
