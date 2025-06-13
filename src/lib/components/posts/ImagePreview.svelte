<script lang="ts">
	import type { ImageWithBuffer } from '$lib/@types/IImage.ts';
	import Icon from '@iconify/svelte';

	const { imagePreviews, removeAllImages, removeImage, maxFiles } = $props<{
		imagePreviews: Array<ImageWithBuffer>;
		maxFiles?: number;
		removeAllImages?: () => void;
		removeImage?: (index: number) => void;
	}>();

	let currentIndex: number = $state(0);

	$effect(() => {
		if (currentIndex >= imagePreviews.length) {
			currentIndex = Math.max(0, imagePreviews.length - 1);
		}
	});

	const currentImage = $derived(imagePreviews[currentIndex]);
	const totalImages = $derived(imagePreviews.length);
	const currentPage = $derived(currentIndex + 1);

	const goToPrevious = () => {
		if (currentIndex > 0) {
			currentIndex--;
		}
	};

	const goToNext = () => {
		if (currentIndex < imagePreviews.length - 1) {
			currentIndex++;
		}
	};

	const goToImage = (index: number) => {
		if (index >= 0 && index < imagePreviews.length) {
			currentIndex = index;
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (imagePreviews.length <= 1) return;

		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				goToPrevious();
				break;
			case 'ArrowRight':
				event.preventDefault();
				goToNext();
				break;
		}
	};
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="">
	{#if imagePreviews.length > 0}
		<div class="">
			<div class="mb-4 flex items-center justify-between">
				{#if removeAllImages}
					<span class="content text-sm font-medium">
						Image Previews ({imagePreviews.length}/{maxFiles})
					</span>
					<button
						type="button"
						onclick={removeAllImages}
						class="cursor-pointer text-sm text-red-600 transition-colors duration-200 hover:text-red-800"
						aria-label="Remove all images"
					>
						Remove All
					</button>
				{/if}
			</div>

			<!-- Main Image Display -->
			<div class="mb-4">
				<div class="group border-muted relative overflow-hidden rounded-lg">
					<div class="relative aspect-video overflow-hidden">
						<img
							src={currentImage?.url}
							alt="Preview {currentImage?.file ? currentImage?.file.name : 'Image'}"
							class="h-full w-full object-cover"
						/>
					</div>

					<!-- Remove Current Image Button -->
					{#if removeImage}
						<button
							type="button"
							onclick={() => removeImage(currentIndex)}
							class="absolute top-2 right-2 cursor-pointer rounded-full bg-red-600 p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-red-700"
							aria-label="Remove current image"
						>
							<Icon icon="mage:multiply" />
						</button>
					{/if}

					<!-- Navigation Arrows -->
					{#if imagePreviews.length > 1}
						<div
							class="absolute top-1/2 flex w-full -translate-y-1/2 transform justify-between px-4"
						>
							<button
								type="button"
								onclick={goToPrevious}
								disabled={currentIndex === 0}
								class="cursor-pointer rounded-full bg-black/50 p-2 text-2xl text-white transition-colors duration-200 hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Previous image"
							>
								<Icon icon="mage:chevron-left" />
							</button>
							<button
								type="button"
								onclick={goToNext}
								disabled={currentIndex === imagePreviews.length - 1}
								class="cursor-pointer rounded-full bg-black/50 p-2 text-2xl text-white transition-colors duration-200 hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Next image"
							>
								<Icon icon="mage:chevron-right" />
							</button>
						</div>
					{/if}

					<!-- Image Info -->
					{#if currentImage.file}
						<div
							class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4"
						>
							<div class="text-white">
								<div class="truncate text-sm font-medium" title={currentImage?.file.name}>
									{currentImage?.file.name}
								</div>
								<div class="text-xs opacity-90">
									{(currentImage?.file.size / 1024 / 1024).toFixed(2)} MB
								</div>
								{#if imagePreviews.length > 1}
									<div class="mt-1 text-xs opacity-75">
										{currentPage} of {totalImages}
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Thumbnail Navigation -->
			{#if imagePreviews.length > 1}
				<div class="flex gap-2 overflow-x-auto pb-2">
					{#each imagePreviews as preview, index}
						<button
							type="button"
							onclick={() => goToImage(index)}
							class="relative flex-shrink-0 rounded cursor-pointer overflow-hidden border-2 transition-all duration-200 {index ===
							currentIndex
								? 'border-blue-500'
								: 'border-gray-300 hover:border-gray-400'}"
							aria-label="Go to image {index + 1}"
						>
							<div class="aspect-video w-20 overflow-hidden">
								<img
									src={preview.url}
									alt="Thumbnail {index + 1}"
									class="h-full w-full object-cover"
								/>
							</div>
							<div
								class="absolute inset-0 bg-black/20 {index === currentIndex
									? 'opacity-0'
									: 'opacity-100'} transition-opacity duration-200"
							></div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
