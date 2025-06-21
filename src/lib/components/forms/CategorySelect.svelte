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
	<label for="category" class="text-md mb-2 block font-medium">
		Category <span class="color-error">*</span></label
	>
	<select
		id="category"
		name="category"
		bind:value={selectedCategory}
		required
		class="input border-muted w-full cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
	>
		<option value="Select a category" disabled selected>Select a category</option>

		{#each categoryList as cat}
			<option value={cat}>{cat}</option>
		{/each}
	</select>
</div>
