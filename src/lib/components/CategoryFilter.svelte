<script lang="ts">
	const { changeCategory, categoryList, selectedCategory } = $props();

    $effect(() => {
        console.log(selectedCategory)
    })
</script>

<div class="flex h-fit flex-col gap-6">
	{#each categoryList as category (category.id)}
		<button
			type="button"
			aria-label="Select Topic"
			class={category.topic.toLowerCase() === selectedCategory
				? 'border-muted cursor-pointer p-2 btn-small-active text-white'
				: 'border-muted cursor-pointer p-2'}
			onclick={() => changeCategory(category.topic)}>{category.topic}</button
		>
	{/each}
</div>
