<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import Header from '$lib/client/components/landing/Header.svelte';
	import ImagePreview from '$lib/client/components/forms/ImagePreview.svelte';
	import PostClient from '$lib/client/tools/PostClient.client.ts';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import TitleInput from '$lib/client/components/forms/TitleInput.svelte';
	import ContentInput from '$lib/client/components/forms/ContentInput.svelte';
	import CategorySelect from '$lib/client/components/forms/CategorySelect.svelte';
	import ImageInput from '$lib/client/components/forms/ImageInput.svelte';
	import Icon from '@iconify/svelte';
	import type { ImageWithUrl } from '$lib/@types/IImage.ts';
	import type { PageData } from './$types.js';

	const session = authClient.useSession();
	let postId = page.params.post


	const { data } = $props<{ data: PageData }>();

	let categoryList = data.categories;

	let existingImages: ImageWithUrl[] = $state([]);
	let newImageFiles: File[] = $state([]);

	let imagePreviews: { file?: File | undefined; url: string }[] = $state([]);

	let isSubmitting: boolean = $state(false);
	let error: string = $state('');

	let currentTitle = $state('');
	let currentBody = $state('');
	let currentCategory = $state('');

	const MAX_CONTENT_CHARS = 1200;
	const MAX_TITLE_CHARS = 100;
	const MAX_FILE_SIZE = 9 * 1024 * 1024;
	const MAX_FILES = 3;
	const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

	const updateImagePreviews = () => {
		imagePreviews = [
			...existingImages.map((img) => ({ url: img.url })),
			...newImageFiles.map((file) => ({ url: URL.createObjectURL(file), file }))
		];
	};

	const handleFileChange = (event: Event) => {
		const inputElement = event.target as HTMLInputElement;
		if (!inputElement || !inputElement.files) return;

		const filesToAdd: File[] = [];
		Array.from(inputElement.files).forEach((file) => {
			if (ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
				const isDuplicate = newImageFiles.some(
					(newFile) => newFile.name === file.name && newFile.size === file.size
				);
				if (
					!isDuplicate &&
					existingImages.length + filesToAdd.length + newImageFiles.length < MAX_FILES
				) {
					filesToAdd.push(file);
				}
			} else {
				console.warn(`File ${file.name} is invalid (type or size).`);
			}
		});

		newImageFiles = [...newImageFiles, ...filesToAdd];
		updateImagePreviews();
	};

	const removeImage = (index: number) => {
		if (index < existingImages.length) {
			existingImages.splice(index, 1);
			existingImages = [...existingImages];
		} else {
			const newFileIndex = index - existingImages.length;
			if (newFileIndex >= 0 && newFileIndex < newImageFiles.length) {
				URL.revokeObjectURL(imagePreviews[index].url);
				newImageFiles.splice(newFileIndex, 1);
				newImageFiles = [...newImageFiles];
			}
		}
		updateImagePreviews();

		const fileInput = document.getElementById('file') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	const removeAllImages = () => {
		newImageFiles.forEach((file) => {
			const url = imagePreviews.find((p) => p.file === file)?.url;
			if (url) URL.revokeObjectURL(url);
		});

		existingImages = [];
		newImageFiles = [];
		updateImagePreviews();

		const fileInput = document.getElementById('file') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const formElement = event.target as HTMLFormElement;

		console.log(formElement)

		const titleInput = formElement.elements.namedItem('title') as HTMLInputElement;
		const contentInput = formElement.elements.namedItem('content') as HTMLInputElement;
		const categoryInput = formElement.elements.namedItem('category') as HTMLInputElement;


		try {
			isSubmitting = true;

			const formData = new FormData();
			if (existingImages) {
				existingImages.forEach((img) => {
					const image = {
						bucketObjectId: img.bucketObjectId,
						id: img.id,
						objectId: img.objectId
					};
					formData.append('existingImages', JSON.stringify(image));
				});
			}
			if (newImageFiles) {
				newImageFiles.forEach((img) => {
					formData.append('newImages', img);
				});
			}

			const newPost = {
				title: titleInput.value,
				content: contentInput.value,
				category: categoryInput.value,
				type: 'post',
				id: postId
			};
			formData.append('post', JSON.stringify(newPost));

			await fetch('?/submitData', {
				method: 'POST',
				body: formData
			});
		} catch (error) {
			isSubmitting = false;
			console.error(error);
		} finally {
			isSubmitting = false;
			goto('/pages/forum');
		}
	};

	const stripHtmlTags = (html: string): string => {
		if (!html) return '';
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;
		return tempDiv.textContent || tempDiv.innerText || '';
	};

	/**
	 * @return Grabbing all available topics from the database. Removing topics that include "update", "announcement",
	 * and "all", as those are specifically reserved for admins only.
	 */
	onMount(async () => {
		if (!$session.data?.user) {
			goto('/pages/forum');
			return;
		}

		try {
			const postResponse = await PostClient.getPostById(postId);

			currentTitle = stripHtmlTags(postResponse.title);
			currentBody = stripHtmlTags(postResponse.content);
			currentCategory = postResponse.category;

			if (postResponse.images && postResponse.images.length > 0) {
				existingImages = postResponse.images;
				imagePreviews = existingImages;
				updateImagePreviews();
			}
		} catch (err) {
			error = 'Failed to load post data or categories. Please check your connection and try again.';
			console.error('Error loading data:', err);
		}

		const cleanUp = () => {
			newImageFiles.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
		};
		cleanUp();
		return;
	});
</script>

<Header />
<main class="bg-base border-muted mx-auto max-w-7xl px-4 py-8">
	<div class="">
		<div class="mb-8">
			<h1 class="content mb-2 text-3xl font-bold">Edit Post</h1>
			<p class="muted">Update your post content and images.</p>
		</div>

		{#if error}
			<div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
				<p class="text-red-700">{error}</p>
			</div>
		{/if}

		<form onsubmit={handleSubmit} enctype="multipart/form-data" class="space-y-8">
			<TitleInput {currentTitle} {MAX_TITLE_CHARS} />

			<ContentInput {currentBody} {MAX_CONTENT_CHARS} />

			{#if imagePreviews.length > 0}
				<ImagePreview {imagePreviews} {removeAllImages} {removeImage} maxFiles={MAX_FILES} />
			{/if}

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<CategorySelect {currentCategory} {categoryList} />
				<ImageInput {handleFileChange} {MAX_FILES} {imagePreviews} />
			</div>

			<button
				type="submit"
				disabled={isSubmitting ||
					!currentTitle.trim() ||
					!currentBody.trim() ||
					currentTitle.length > MAX_TITLE_CHARS ||
					currentBody.length > MAX_CONTENT_CHARS}
				class="btn-big flex gap-4 items-center justify-center disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
			>
				{#if isSubmitting}
					<Icon icon="svg-spinners:blocks-shuffle-3" class="text-xl" />
					<span>
						Updating...
					</span>
				{:else}
					Update Post
				{/if}
			</button>
		</form>
	</div>
</main>
