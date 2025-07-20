<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import Icon from '@iconify/svelte';

	const session = authClient.useSession();

	type Category = {
		topic: string;
	};

	const { changeCategory, categoryList, selectedCategory } = $props<{
		changeCategory: (category: string) => void;
		categoryList: Category[];
		selectedCategory: string;
	}>();

	const getButtonClass = (categoryTopic: string) => {
		// Base classes apply to all buttons
		const baseClasses =
			'flex w-full items-center gap-3 rounded-md p-2 text-left text-sm ' +
			'transition-all duration-200 ease-in-out outline-none ' + // Smoother transitions, remove default outline
			'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]'; // Consistent focus ring

		// Classes specific to the selected category
		const selectedStateClasses =
			'bg-[var(--color-input)] text-[var(--color-base-content)] font-semibold cursor-default'; // cursor-default for selected

		// Classes for unselected, interactive categories
		const unselectedInteractiveClasses =
			'cursor-pointer text-[var(--color-muted)] font-medium ' +
			'hover:bg-[var(--color-input)] hover:text-[var(--color-base-content)]';

		if (categoryTopic === selectedCategory) {
			return `${baseClasses} ${selectedStateClasses}`;
		}

		return `${baseClasses} ${unselectedInteractiveClasses}`;
	};
</script>

<nav class="flex flex-col gap-1" aria-label="Categories">
	<button type="button" onclick={() => changeCategory('all')} class={getButtonClass('all')}>
		<Icon icon="mdi:minecraft" class="text-xl" /> <span>ALL</span>
	</button>

	{#if $session.data?.user}
		<button
			type="button"
			onclick={() => changeCategory('followers')}
			class={getButtonClass('followers')}
		>
			<Icon icon="mdi:minecraft" class="text-xl" /> <span>FOLLOWING</span>
		</button>
	{/if}

	{#if categoryList}
		{#each categoryList as category}
			<button
				type="button"
				onclick={() => changeCategory(category.category)}
				class={getButtonClass(category.category)}
			>
				<Icon icon="mdi:minecraft" class="text-xl" />
				<span class="truncate">{category.category.toUpperCase()}</span>
			</button>
		{/each}
	{/if}
</nav>
