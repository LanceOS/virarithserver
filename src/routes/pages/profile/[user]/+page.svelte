<script lang="ts">
	import Header from '$lib/components/landing/Header.svelte';
	import Icon from '@iconify/svelte';
	import CommentFeed from '$lib/components/comments/CommentFeed.svelte';
	import type { UserSchema } from '$lib/schemas/authentication.ts';
	import type { IPagination, PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import ProfileAvatar from '$lib/components/profile/ProfileAvatar.svelte';
	import ProfileInfo from '$lib/components/profile/ProfileInfo.svelte';
	import { authClient } from '$lib/auth-client.ts';
	import { onMount } from 'svelte';
	import Pagination from '$lib/components/forum/Pagination.svelte';
	import { page } from '$app/state';
	import PostClient from '$lib/tools/PostClient.ts';
	import type { CommentSchema } from '$lib/schemas/Comments.ts';
	import ProfileClient from '$lib/tools/ProfileClient.ts';
	import CommentClient from '$lib/tools/CommentClient.ts';
	import type { IProfileWithUser } from '$lib/@types/IProfile.ts';
	import ForumFeed from '$lib/components/forum/ForumFeed.svelte';

	const userPage = page.params.user;

	const session = authClient.useSession();

	let isHydrated = $state(false);

	let profile: IProfileWithUser | undefined = $state();
	let profileUser: UserSchema | undefined = $state();

	let posts: PostWithImage[] | undefined = $state([]);
	let postPagination: IPagination | undefined = $state();

	let comments: CommentSchema[] | undefined = $state([]);
	let commentPagination: IPagination | undefined = $state();

	let pagination: IPagination | undefined = $state();
	let isPaginationLoading: boolean = $state(false);

	let activeTab: 'posts' | 'comments' = $state('posts');

	let isFollowing: boolean = $state(false);
	
	let isEditing: boolean = $state(false);
	let isLoading: boolean = $state(false);
	
	let newProfileInfo = $state({
		bio: '',
		minecraftName: '',
		discordName: ''
	});
	let newAvatar: File | undefined = $state();


	const changeTab = (tab: string) => {
		if(tab === "posts") {
			activeTab = "posts";
			pagination = postPagination;
		}
		else {
			activeTab = "comments";
			pagination = commentPagination;
		}
	}

	const incrementPage = async () => {
		if (pagination?.currentPage! >= pagination?.totalPages!) {
			return;
		}
		isLoading = true;
		try {
			const page = pagination?.currentPage! + 1;
			if (activeTab === 'posts') {
				const response = await PostClient.getPostsByUser({ userId: userPage, page: page });
				posts = response.posts;
				pagination = response.pagination;
			} else if (activeTab === 'comments') {
				return;
			} else {
				return;
			}
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	};

	const decrementPage = async () => {
		if (pagination?.currentPage! >= pagination?.totalPages!) {
			return;
		}
		try {
			const page = pagination?.currentPage! - 1;
			if (activeTab === 'posts') {
				const response = await PostClient.getPostsByUser({ userId: userPage, page: page });
				posts = response.posts;
				pagination = response.pagination;
			} else if (activeTab === 'comments') {
				return;
			} else {
				return;
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleFollow = () => {
		isFollowing = !isFollowing;
	};

	const handleEdit = () => {
		if (isEditing) {
			handleSave();
		} else {
			isEditing = true;
			newProfileInfo.bio = profile?.bio || '';
			newProfileInfo.minecraftName = profile?.minecraftName || '';
			newProfileInfo.discordName = profile?.discordName || '';
		}
	};

	const handleSave = async () => {
		isLoading = true;
		try {
			const formData = new FormData();
			formData.append(
				'profile',
				JSON.stringify({
					...profile,
					bio: newProfileInfo.bio,
					minecraftName: newProfileInfo.minecraftName,
					discordName: newProfileInfo.discordName
				})
			);

			if(newAvatar) {
				formData.append('file', newAvatar)
			}

			await fetch('?/submitEditedProfile', {
				method: 'POST',
				body: formData
			});
		} catch (error) {
			console.error('Error saving profile:', error);
			alert(`Failed to save profile: ${error}`);
		} finally {
			isLoading = false;
			isEditing = false;
			profile = await ProfileClient.getUserProfile(userPage)
		}
	};

	const handleCancel = () => {
		newProfileInfo.bio = profile?.bio || '';
		newProfileInfo.minecraftName = profile?.minecraftName || '';
		newProfileInfo.discordName = profile?.discordName || '';
		isEditing = false;
	};

	onMount(async () => {
		isHydrated = true;

		try {
			const profileResponse = await ProfileClient.getUserProfile(userPage)
            const postResponse = await PostClient.getPostsByUser({ userId: userPage, page: 1 })
            const commentResponse = await CommentClient.getCommentsByUser({ userId: userPage, page: 1 })

			profile = profileResponse;
			profileUser = profile?.user;

			posts = postResponse.posts;
			postPagination = postResponse.pagination;

			pagination = postPagination;

			comments = commentResponse.comments;
			commentPagination = commentResponse.pagination;
		}
		catch(error) {
			console.error("Error on:", error)
		}
	});
</script>

<Header />
<main
	class="bg-base text-base-content border-muted mx-auto min-h-screen max-w-7xl p-4 sm:p-6 lg:p-8"
>
	<div class="container w-full">
		{#if profile}
			<div class="space-y-8">
				<div class="card-setup p-6">
					<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
						<div class="flex-1 space-y-6">
							<div>
								<h1 class="text-4xl font-bold text-white">{profile.user?.name}</h1>
							</div>

							<ProfileInfo {isEditing} {profile} bind:newProfileInfo />

							<section class="space-y-3">
								{#if !isHydrated}
									<!-- Show a neutral loading state during hydration -->
									<div
										class="btn-small border-muted flex w-full items-center justify-center gap-2 opacity-50"
									>
										<Icon icon="svg-spinners:ring-resize" class="text-lg"></Icon>
										Loading...
									</div>
								{:else}
									{#if !isEditing && profile.userId !== $session.data?.user.id}
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

									{#if profile.userId === $session.data?.user.id}
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
									{/if}
								{/if}
							</section>
						</div>

						<ProfileAvatar {isEditing} bind:newAvatar avatar={profile?.user.image || undefined}/>
					</div>
				</div>

				<div class="card-setup p-6">
					<div class="mb-4 border-b" style="border-color: var(--color-card-border);">
						<nav class="flex space-x-4">
							<button
								onclick={() => changeTab("posts")}
								class:text-[var(--color-primary)]={activeTab === 'posts'}
								class="btn-nav cursor-pointer border-b-2 px-1 py-2 font-semibold transition-colors duration-200"
							>
								Posts
							</button>
							<button
								onclick={() => changeTab("comments")}
								class:text-[var(--color-primary)]={activeTab === 'comments'}
								class="btn-nav cursor-pointer border-b-2 px-1 py-2 font-semibold transition-colors duration-200"
							>
								Comments
							</button>
						</nav>
					</div>

					{#if isHydrated}
						<div class="space-y-4">
							<Pagination {pagination} {incrementPage} {decrementPage} {isPaginationLoading} />
							{#if !isLoading}
								{#if activeTab === 'posts' && posts}
									<ForumFeed {posts} />
								{:else if activeTab === 'comments' && comments}
									<CommentFeed {comments} />
								<!-- {:else if activeTab === 'likes'}
									<ForumFeed posts={likedPosts}/> -->
								{/if}
							{:else}
								<section class="flex min-h-64 flex-col items-center justify-center gap-4">
									<Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl" />
									<p class="text-muted text-sm sm:text-base">Loading posts...</p>
								</section>
							{/if}
						</div>
					{:else}
						<section class="flex min-h-64 flex-col items-center justify-center gap-4">
							<Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl" />
							<p class="text-muted text-sm sm:text-base">Loading posts...</p>
						</section>
					{/if}
				</div>
			</div>
		{:else}
			<div class="flex h-64 flex-col items-center justify-center gap-12">
				<Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl" />
				<p class="muted text-2xl">Loading profile...</p>
			</div>
		{/if}
	</div>
</main>
