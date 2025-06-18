<script lang="ts">
	import ProfileClient from '$lib/tools/ProfileClient.ts';
	import Header from '$lib/components/landing/Header.svelte';
	import Icon from '@iconify/svelte';
	import ImagePreview from '$lib/components/forms/ImagePreview.svelte';
	import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import type { CommentSchema } from '$lib/schemas/Comments.ts';
	import type { LikeSchema } from '$lib/schemas/Likes.ts';
	import type { PageData } from '../$types.js';
	import ForumFeed from '$lib/components/forum/ForumFeed.svelte';
	import CommentFeed from '$lib/components/comments/CommentFeed.svelte';

    const { data } = $props<{ data: PageData }>(); 
    
    let profile = $state(data.profile)
    let user = $state(data.profile.user)

    let posts: PostWithImage[] = $state(data.posts.posts);
	let comments: CommentSchema[] = $state([]);
	let likes: LikeSchema[] = $state([]);
	let activeTab: 'posts' | 'comments' | 'likes' = $state('posts');
	let isFollowing: boolean = $state(false);
	let isEditing: boolean = $state(false);

	let editBio: string = $state('');
	let editMinecraftUsername: string = $state('');
	let editDiscordUsername: string = $state('');

    
	const handleFollow = () => {
        isFollowing = !isFollowing;
        
	};
    
	const handleEdit = () => {
        if (isEditing) {
            handleSave();
		} else {
            isEditing = true;
			editBio = profile.bio || '';
			editMinecraftUsername = profile.minecraftName || '';
			editDiscordUsername = profile.discordName || '';
		}
	};
    
	const handleSave = async () => {
        try {
            const updatedProfile = {
                ...profile,
				bio: editBio,
				minecraftName: editMinecraftUsername,
				discordName: editDiscordUsername
			};
            
            
			profile = updatedProfile;
			isEditing = false;
		} catch (error) {
            console.error('Error saving profile:', error);
		}
	};
    
	const handleCancel = () => {
        editBio = profile.bio || '';
		editMinecraftUsername = profile.minecraftName || '';
		editDiscordUsername = profile.discordName || '';
		isEditing = false;
	};

</script>

<Header />
<main class="bg-base text-base-content min-h-screen p-4 sm:p-6 lg:p-8 border-muted mx-auto max-w-7xl">
	<div class="container w-full">
		{#if profile}
			<div class="space-y-8">
				<!-- Profile Info Section -->
				<div class="card-setup p-6">
					<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
						<!-- User Info Section (Left) -->
						<div class="flex-1 space-y-6">
							<!-- Name -->
							<div>
								<h1 class="text-4xl font-bold text-white">{user.name}</h1>
								<!-- <p class="muted mt-2">Joined on {profile.createdAt.toLocaleDateString()}</p> -->
							</div>

							<!-- Bio -->
							<div>
								<h3 class="text-lg font-semibold text-white mb-3">Bio</h3>
								{#if isEditing}
									<textarea
										bind:value={editBio}
										placeholder="Enter your bio..."
										class="input w-full resize-none p-3"
										rows="3"
									></textarea>
								{:else}
									<p class="content">
										{profile.bio || 'This user has not set a bio yet.'}
									</p>
								{/if}
							</div>

							<!-- Gaming Info -->
							<div class="space-y-3">
								<h3 class="text-lg font-semibold text-white">Gaming Info</h3>

								<div class="input p-3">
									<div class="mb-1 flex items-center gap-2">
										<Icon icon="vscode-icons:file-type-minecraft" class="text-lg"></Icon>
										<span class="muted text-sm font-medium">Minecraft</span>
									</div>
									{#if isEditing}
										<input
											type="text"
											bind:value={editMinecraftUsername}
											placeholder="Enter Minecraft username"
											class="input w-full p-2 text-sm"
										/>
									{:else}
										<p class="content text-sm">
											{profile.minecraftName || 'Not set'}
										</p>
									{/if}
								</div>

								<div class="input p-3">
									<div class="mb-1 flex items-center gap-2">
										<Icon icon="logos:discord-icon" class="text-lg"></Icon>
										<span class="muted text-sm font-medium">Discord</span>
									</div>
									{#if isEditing}
										<input
											type="text"
											bind:value={editDiscordUsername}
											placeholder="Enter Discord username"
											class="input w-full p-2 text-sm"
										/>
									{:else}
										<p class="content text-sm">
											{profile.discordName || 'Not set'}
										</p>
									{/if}
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="space-y-3">
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

						<!-- Avatar Section (Right) -->
						<div class="flex justify-center lg:justify-end">
							<div class="w-48 h-48 lg:w-64 lg:h-64">
								<!-- <ImagePreview /> -->
								<div class="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
									<Icon icon="mdi:account-circle" class="text-6xl text-gray-400" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Feed Section -->
				<div class="card-setup p-6">
					<div class="mb-4 border-b" style="border-color: var(--color-card-border);">
						<nav class="flex space-x-4">
							<button
								onclick={() => (activeTab = 'posts')}
								class={`btn-nav cursor-pointer border-b-2 px-1 py-2 font-semibold transition-colors duration-200 ${activeTab === 'posts' ? "text-[var(--color-primary)]" : ""}`}
							>
								Posts
							</button>
							<button
								onclick={() => (activeTab = 'comments')}
								class={`btn-nav cursor-pointer border-b-2 px-1 py-2 font-semibold transition-colors duration-200 ${activeTab === 'comments' ? "text-[var(--color-primary)]" : ""}`}
							>
								Comments
							</button>
							<button
								onclick={() => (activeTab = 'likes')}
								class={`btn-nav cursor-pointer border-b-2 px-1 py-2 font-semibold transition-colors duration-200 ${activeTab === 'likes' ? "text-[var(--color-primary)]" : ""}`}
							>
								Likes
							</button>
						</nav>
					</div>

					<div>
						{#if activeTab === 'posts' && posts}
                            <ForumFeed {posts} />
						{:else if activeTab === 'comments' && comments}
                            <CommentFeed {comments}/>
						{:else if activeTab === 'likes'}
							<div class="space-y-4">
								{#each likes as like (like.id)}
									<!-- <div class="input flex items-center justify-between p-4">
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
									</div> -->
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