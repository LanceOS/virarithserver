<script lang="ts">
	import Icon from '@iconify/svelte';

	type Category = {
		topic: string;
		// You could add more properties here, like post counts or icons
		// postCount?: number;
		// icon?: string;
	};

	const { changeCategory, categoryList, selectedCategory } = $props<{
		changeCategory: (category: string) => void;
		categoryList: Category[];
		selectedCategory: string;
	}>();

	const getButtonClass = (categoryTopic: string) => {
		const baseClasses =
			'flex w-full items-center gap-3 rounded-md p-2 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
		if (categoryTopic === selectedCategory) {
			return `${baseClasses} bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50`;
		}
		return `${baseClasses} cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-50`;
	};
</script>

<nav class="flex flex-col gap-1" aria-label="Categories">
	<button type="button" onclick={() => changeCategory('all')} class={getButtonClass('all')}>
		<Icon icon="mdi:minecraft" />
		<span>All Posts</span>
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
