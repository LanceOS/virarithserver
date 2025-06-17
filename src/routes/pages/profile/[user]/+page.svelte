<script lang="ts">
	import { onMount } from 'svelte';
	import ProfileClient from '$lib/tools/ProfileClient.ts';
	import { page } from '$app/state';
	import Header from '$lib/components/landing/Header.svelte';
	import Icon from '@iconify/svelte';
	import ImagePreview from '$lib/components/forms/ImagePreview.svelte';

	let profile: any = $state(null);
	let posts: any[] = $state([]);
	let comments: any[] = $state([]);
	let likes: any[] = $state([]);
	let activeTab: 'posts' | 'comments' | 'likes' = $state('posts');
	let isFollowing: boolean = $state(false);
	let isEditing: boolean = $state(false);

	let editBio: string = $state('');
	let editMinecraftUsername: string = $state('');
	let editDiscordUsername: string = $state('');

	onMount(async () => {
		const userId = page.params.user;
		profile = await ProfileClient.getUserProfile(userId);

		if (profile) {
			editBio = profile.bio || '';
			editMinecraftUsername = profile.minecraftUsername || '';
			editDiscordUsername = profile.discordUsername || '';
		}
	});

	const handleFollow = () => {
		isFollowing = !isFollowing;

	};

	const handleEdit = () => {
		if (isEditing) {
			handleSave();
		} else {
			isEditing = true;
			editBio = profile.bio || '';
			editMinecraftUsername = profile.minecraftUsername || '';
			editDiscordUsername = profile.discordUsername || '';
		}
	};

	const handleSave = async () => {
		try {
			const updatedProfile = {
				...profile,
				bio: editBio,
				minecraftUsername: editMinecraftUsername,
				discordUsername: editDiscordUsername
			};


			profile = updatedProfile;
			isEditing = false;
		} catch (error) {
			console.error('Error saving profile:', error);
		}
	};

	const handleCancel = () => {
		editBio = profile.bio || '';
		editMinecraftUsername = profile.minecraftUsername || '';
		editDiscordUsername = profile.discordUsername || '';
		isEditing = false;
	};
</script>

<Header />
<main class="bg-base text-base-content min-h-screen p-4 sm:p-6 lg:p-8 border-muted mx-auto max-w-7xl">
	<div class="container w-full">
		{#if profile}
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div class="card-setup h-fit p-6 lg:col-span-1">
					<div class="flex flex-col items-center">
						<ImagePreview />
						<h1 class="mt-4 text-4xl font-bold text-white">{profile.user.name}</h1>
						<p class="muted mt-2">Joined on {new Date(profile.createdAt).toLocaleDateString()}</p>

						<div class="mt-4 w-full">
							{#if isEditing}
								<textarea
									bind:value={editBio}
									placeholder="Enter your bio..."
									class="input w-full resize-none rounded-md p-3 text-center"
									rows="3"
								></textarea>
							{:else}
								<p class="content text-center">
									{profile.bio || 'This user has not set a bio yet.'}
								</p>
							{/if}
						</div>

						<div class="mt-6 w-full space-y-3">
							<h3 class="text-center text-lg font-semibold text-white">Gaming Info</h3>

							<!-- Minecraft Username -->
							<div class="input rounded-md p-3">
								<div class="mb-1 flex items-center gap-2">
									<Icon icon="vscode-icons:file-type-minecraft" class="text-lg"></Icon>
									<span class="muted text-sm font-medium">Minecraft</span>
								</div>
								{#if isEditing}
									<input
										type="text"
										bind:value={editMinecraftUsername}
										placeholder="Enter Minecraft username"
										class="input w-full rounded-md p-2 text-sm"
									/>
								{:else}
									<p class="content text-sm">
										{profile.minecraftUsername || 'Not set'}
									</p>
								{/if}
							</div>

							<div class="input rounded-md p-3">
								<div class="mb-1 flex items-center gap-2">
									<Icon icon="logos:discord-icon" class="text-lg"></Icon>
									<span class="muted text-sm font-medium">Discord</span>
								</div>
								{#if isEditing}
									<input
										type="text"
										bind:value={editDiscordUsername}
										placeholder="Enter Discord username"
										class="input w-full rounded-md p-2 text-sm"
									/>
								{:else}
									<p class="content text-sm">
										{profile.discordUsername || 'Not set'}
									</p>
								{/if}
							</div>
						</div>

						<div class="mt-6 w-full space-y-3">
							{#if !isEditing}
								<button
									onclick={handleFollow}
									class="btn-big-active flex w-full cursor-pointer items-center justify-center gap-2"
								>
									<Icon
										icon={isFollowing ? 'mdi:account-check' : 'mdi:account-plus'}
										class="text-lg"
									></Icon>
									{isFollowing ? 'Following' : 'Follow'}
								</button>
							{/if}

							{#if isEditing}
								<div class="flex gap-2">
									<button
										onclick={handleSave}
										class="btn-big-active flex flex-1 cursor-pointer items-center justify-center gap-2"
									>
										<Icon icon="mdi:content-save" class="text-lg"></Icon>
										Save
									</button>
									<button
										onclick={handleCancel}
										class="btn-small border-muted flex flex-1 cursor-pointer items-center justify-center gap-2"
									>
										<Icon icon="mdi:close" class="text-lg"></Icon>
										Cancel
									</button>
								</div>
							{:else}
								<button
									onclick={handleEdit}
									class="btn-small border-muted flex w-full cursor-pointer items-center justify-center gap-2"
								>
									<Icon icon="mdi:account-edit" class="text-lg"></Icon>
									Edit Profile
								</button>
							{/if}
						</div>
					</div>
				</div>

				<div class="card-setup rounded-lg p-6 lg:col-span-2">
					<div class="mb-4 border-b" style="border-color: var(--color-card-border);">
						<nav class="flex space-x-4">
							<button
								onclick={() => (activeTab = 'posts')}
								class="btn-nav cursor-pointer border-b-2 px-1 py-2 font-semibold transition-colors duration-200"
							>
								Posts ({posts.length})
							</button>
							<button
								onclick={() => (activeTab = 'comments')}
								class="btn-nav cursor-pointer border-b-2 px-1 py-2 font-semibold transition-colors duration-200"
							>
								Comments ({comments.length})
							</button>
							<button
								onclick={() => (activeTab = 'likes')}
								class="btn-nav cursor-pointer border-b-2 px-1 py-2 font-semibold transition-colors duration-200"
							>
								Likes ({likes.length})
							</button>
						</nav>
					</div>

					<div>
						{#if activeTab === 'posts'}
							<div class="space-y-4">
								{#each posts as post (post.id)}
									<div class="input flex items-center justify-between rounded-md p-4">
										<div>
											<a
												href="/posts/{post.id}"
												class="text-input-content hover:text-primary cursor-pointer text-lg font-semibold"
												>{post.title}</a
											>
											<p class="muted text-sm">
												in <span class="font-semibold" style="color: var(--color-primary);"
													>{post.category}</span
												>
												on {new Date(post.date).toLocaleDateString()}
											</p>
										</div>
										<a href="/posts/{post.id}" class="read-more-btn cursor-pointer"> View Post </a>
									</div>
								{:else}
									<p class="muted">This user has not made any posts yet.</p>
								{/each}
							</div>
						{:else if activeTab === 'comments'}
							<div class="space-y-4">
								{#each comments as comment (comment.id)}
									<div class="input rounded-md p-4">
										<p class="content">"{comment.text}"</p>
										<p class="muted mt-2 text-sm">
											commented on <a
												href="/posts/{comment.postId}"
												class="cursor-pointer hover:underline"
												style="color: var(--color-primary);">{comment.postTitle}</a
											>
										</p>
									</div>
								{:else}
									<p class="muted">This user has not made any comments yet.</p>
								{/each}
							</div>
						{:else if activeTab === 'likes'}
							<div class="space-y-4">
								{#each likes as like (like.id)}
									<div class="input flex items-center justify-between rounded-md p-4">
										<div>
											<a
												href="/posts/{like.postId}"
												class="text-input-content hover:text-primary cursor-pointer text-lg font-semibold"
												>{like.postTitle}</a
											>
											<p class="muted text-sm">
												liked on {new Date(like.likedAt).toLocaleDateString()} • by
												<span class="font-semibold" style="color: var(--color-primary);"
													>{like.postAuthor}</span
												>
												in
												<span class="font-semibold" style="color: var(--color-primary);"
													>{like.postCategory}</span
												>
											</p>
										</div>
										<div class="flex items-center gap-3">
											<div class="muted flex items-center gap-1 text-sm">
												<Icon icon="mdi:heart" class="text-red-500"></Icon>
												<span>{like.postLikes}</span>
											</div>
											<a href="/posts/{like.postId}" class="read-more-btn cursor-pointer">
												View Post
											</a>
										</div>
									</div>
								{:else}
									<p class="muted">This user has not liked any posts yet.</p>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<div class="h-64 items-center justify-center flex flex-col gap-12">
				<Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl" />

				<p class="muted text-2xl">Loading profile...</p>
			</div>
		{/if}
	</div>
</main>
