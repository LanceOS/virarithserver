<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import Header from '$lib/components/landing/Header.svelte';
	import ImagePreview from '$lib/components/forms/ImagePreview.svelte';
	import CategoryClient from '$lib/tools/CategoryClient.ts';
	import { onMount } from 'svelte';
	import ContentInput from '$lib/components/forms/ContentInput.svelte';
	import Icon from '@iconify/svelte';
	import TitleInput from '$lib/components/forms/TitleInput.svelte';
	import CategorySelect from '$lib/components/forms/CategorySelect.svelte';
	import ImageInput from '$lib/components/forms/ImageInput.svelte';

	const session = authClient.useSession();

	let imagePreviews: { file: File; url: string }[] = $state([]);

	let categoryList: any = $state([]);
	let isSubmitting: boolean = $state(false);
	let error: string = $state('');

	const MAX_CONTENT_CHARS = 1200;
	const MAX_TITLE_CHARS = 100;
	const MAX_FILE_SIZE = 4 * 1024 * 1024;
	const MAX_FILES = 3;

	const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

	const handleFileChange = (event: Event) => {
		event.preventDefault();
		const inputElement = event.target as HTMLInputElement;
		if (!inputElement || !inputElement.files) return;

		console.log('New file being added to input', inputElement);

		const dataTransfer = new DataTransfer();

		imagePreviews.forEach((preview) => {
			dataTransfer.items.add(preview.file);
		});

		Array.from(inputElement.files).forEach((file) => {
			if (ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
				const isDuplicate = imagePreviews.some(
					(preview) => preview.file.name === file.name && preview.file.size === file.size
				);
				if (!isDuplicate && dataTransfer.items.length < MAX_FILES) {
					dataTransfer.items.add(file);
				}
			} else {
				console.warn(`File ${file.name} is invalid (type or size).`);
			}
		});

		inputElement.files = dataTransfer.files;

		imagePreviews = [];
		Array.from(inputElement.files).forEach((file, index) => {
			if (index < MAX_FILES) {
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target) {
						imagePreviews = [...imagePreviews, { url: e.target.result as string, file: file }];
					}
				};
				reader.readAsDataURL(file);
			}
		});
	};

	const removeImage = (index: number) => {
		const fileInput = document.getElementById('file') as HTMLInputElement;
		if (!fileInput || !fileInput.files) return;

		const dt = new DataTransfer();

		Array.from(fileInput.files).forEach((file, i) => {
			if (i !== index) {
				dt.items.add(file);
			}
		});

		fileInput.files = dt.files;

		imagePreviews.splice(index, 1);
		imagePreviews = [...imagePreviews];
	};

	const removeAllImages = () => {
		imagePreviews = [];
		const fileInput = document.getElementById('file') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';

			if (fileInput.files) {
				fileInput.files = new DataTransfer().files;
			}
		}
	};



	/**
	 * @return Grabbing all available topics from the database. Removing topics that include "update", "announcement",
	 * and "all", as those are specifically reserved for admins only.
	 */
	onMount(async () => {
		if (!$session.data?.user) {
			goto('/pages/forum');
		}

		try {
			const response = await CategoryClient.getCategories();
			let filteredCategories: string[] = [];

			for (let i = 0; i < response.length; i++) {
				const topic = response[i].topic.trim().toLowerCase();
				if (
					topic.toLowerCase() === 'updates' ||
					topic.toLowerCase() === 'announcements' ||
					topic.toLowerCase() === 'all'
				) {
					continue;
				}

				filteredCategories.push(response[i].topic);
			}

			categoryList = filteredCategories;
		} catch (err) {
			error = 'Failed to load categories. Please check your connection and try again.';
			console.error('Error loading categories:', err);
		}

		() => {
			imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
		};
	});
</script>

<Header />

<main class="bg-base border-muted mx-auto max-w-7xl px-6 py-8">
	<div class="">
		<div class="mb-8">
			<h1 class="content mb-2 text-3xl font-bold">Create New Post</h1>
			<p class="muted">Share your thoughts or ask questions about Virarith.</p>
		</div>

		{#if error}
			<div class="mb-6 border border-red-200 bg-red-50 p-4">
				<p class="text-red-700">{error}</p>
			</div>
		{/if}

		<form method="POST" action="?/submitData" enctype="multipart/form-data" class="space-y-8">
			<TitleInput {MAX_TITLE_CHARS}/>

			<ContentInput {MAX_CONTENT_CHARS} />

			{#if imagePreviews}
				<ImagePreview {imagePreviews} {removeAllImages} {removeImage} maxFiles={MAX_FILES} />
			{/if}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<CategorySelect {categoryList}/>

				<ImageInput {MAX_FILES} {imagePreviews} {handleFileChange}/>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				class="btn-big flex flex-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none disabled:pointer-events-none"
			>
				{#if isSubmitting}
					<span>
						<Icon icon="svg-spinners:blocks-shuffle-3" class="text-xl" />
						Publishing...
					</span>
				{:else}
					Create Post
				{/if}
			</button>
		</form>
	</div>
</main>
