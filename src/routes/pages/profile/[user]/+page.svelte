<script lang="ts">
	import Header from '$lib/client/components/landing/Header.svelte';
	import Icon from '@iconify/svelte';
	import CommentFeed from '$lib/client/components/comments/CommentFeed.svelte';
	import type { UserSchema } from '$lib/server/schemas/authentication.ts';
	import type { IPagination, PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import ProfileAvatar from '$lib/client/components/profile/ProfileAvatar.svelte';
	import ProfileInfo from '$lib/client/components/profile/ProfileInfo.svelte';
	import { authClient } from '$lib/auth-client.ts';
	import { onMount } from 'svelte';
	import Pagination from '$lib/client/components/forum/Pagination.svelte';
	import { page } from '$app/state';
	import PostClient from '$lib/client/tools/PostClient.client.ts';
	import type { CommentSchema } from '$lib/server/schemas/Comments.ts';
	import ProfileClient from '$lib/client/tools/ProfileClient.client.ts';
	import CommentClient from '$lib/client/tools/CommentClient.client.ts';
	import type { IProfileWithUser } from '$lib/@types/IProfile.ts';
	import ForumFeed from '$lib/client/components/forum/ForumFeed.svelte';
	import RoleCard from '$lib/client/components/cards/RoleCard.svelte';
	import FollowButton from '$lib/client/components/actions/FollowButton.svelte';

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

	let activeTab: 'posts' | 'comments' = $state('posts');

	let isEditing: boolean = $state(false);
	let isLoading: boolean = $state(false);
	let newProfileInfo = $state({
		bio: '',
		minecraftName: '',
		discordName: ''
	});
	let newAvatar: File | undefined = $state();

	const stripHtmlTags = (html: string): string => {
		if (!html) return '';
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;
		return tempDiv.textContent || tempDiv.innerText || '';
	};

	const changeTab = (tab: 'posts' | 'comments') => {
		activeTab = tab;
		pagination = tab === 'posts' ? postPagination : commentPagination;
	};

	const fetchPosts = async (page: number) => {
		isLoading = true;
		try {
			const response = await PostClient.getPostsByUser({ userId: userPage, page: page });
			posts = response.posts;
			postPagination = response.pagination;
			if (activeTab === 'posts') pagination = postPagination;
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			isLoading = false;
		}
	};

	const fetchComments = async (page: number) => {
		isLoading = true;
		try {
			const response = await CommentClient.getCommentsByUser({ userId: userPage, page: page });
			comments = response.comments;
			commentPagination = response.pagination;
			if (activeTab === 'comments') pagination = commentPagination;
		} catch (error) {
			console.error('Error fetching comments:', error);
		} finally {
			isLoading = false;
		}
	};

	const incrementPage = async () => {
		if (!pagination || pagination.currentPage >= pagination.totalPages) return;

		if (activeTab === 'posts') {
			await fetchPosts(pagination.currentPage + 1);
		} else if (activeTab === 'comments') {
			await fetchComments(pagination.currentPage + 1);
		}
	};

	const decrementPage = async () => {
		if (!pagination || pagination.currentPage <= 1) return;

		if (activeTab === 'posts') {
			await fetchPosts(pagination.currentPage - 1);
		} else if (activeTab === 'comments') {
			await fetchComments(pagination.currentPage - 1);
		}
	};

	const handleEdit = () => {
		if (isEditing) {
			handleSave();
		} else {
			isEditing = true;
			newProfileInfo.bio = profile?.bio ? stripHtmlTags(profile.bio) : '';
			newProfileInfo.minecraftName = profile?.minecraftName
				? stripHtmlTags(profile.minecraftName)
				: '';
			newProfileInfo.discordName = profile?.discordName ? stripHtmlTags(profile.discordName) : '';
		}
	};

	const handleSave = async () => {
		isLoading = true;
		try {
			if (!profile?.id) {
				throw new Error('Profile must be present.');
			}

			const formData = new FormData();
			const updatedProfileData = {
				bio: newProfileInfo.bio,
				minecraftName: newProfileInfo.minecraftName,
				discordName: newProfileInfo.discordName,
				id: profile.id
			};

			formData.append('profile', JSON.stringify(updatedProfileData));

			if (newAvatar) {
				formData.append('file', newAvatar);
			}

			await fetch('?/submitEditedProfile', {
				method: 'POST',
				body: formData
			});

			profile = await ProfileClient.getUserProfile(userPage);
			profileUser = profile?.user;
		} catch (error) {
			console.error('Error saving profile:', error);
			alert(`Failed to save profile: ${error}`);
		} finally {
			isLoading = false;
			isEditing = false;
			newAvatar = undefined;
		}
	};

	const handleCancel = () => {
		newProfileInfo.bio = profile?.bio ? stripHtmlTags(profile.bio) : '';
		newProfileInfo.minecraftName = profile?.minecraftName
			? stripHtmlTags(profile.minecraftName)
			: '';
		newProfileInfo.discordName = profile?.discordName ? stripHtmlTags(profile.discordName) : '';
		newAvatar = undefined;
		isEditing = false;
	};

	onMount(async () => {
		try {
			const [profileResp, postsResp, commentsResp] = await Promise.all([
				ProfileClient.getUserProfile(userPage),
				PostClient.getPostsByUser({ userId: userPage, page: 1 }),
				CommentClient.getCommentsByUser({ userId: userPage, page: 1 })
			]);

			profile = profileResp;
			profileUser = profile?.user;

			posts = postsResp.posts;
			postPagination = postsResp.pagination;

			comments = commentsResp.comments;
			commentPagination = commentsResp.pagination;

			pagination = postPagination;
		} catch (error) {
			console.error('Error fetching profile data:', error);
		} finally {
			isHydrated = true;
		}
	});
</script>

<Header />
<main class="mx-auto min-h-screen max-w-7xl p-4 sm:p-6 lg:p-8 pb-12">
	<div class="w-full">
		{#if !isHydrated}
			<div
				class="card-setup flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 p-8"
			>
				<Icon
					icon="svg-spinners:blocks-shuffle-3"
					class="text-5xl"
					style="color: var(--color-primary);"
				/>
				<p class="text-2xl font-semibold" style="color: var(--color-base-content);">
					Loading profile...
				</p>
			</div>
		{:else if profile}
			<div class="space-y-8">
				<div class="card-setup p-6">
					<div class="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-10">
						<ProfileAvatar {isEditing} bind:newAvatar avatar={profile?.user.image || undefined} />

						<div class="flex-1 space-y-6 text-center lg:text-left">
							<div class="flex flex-col h-fit items-center gap-4 sm:flex-row">
								<h1
									class="text-3xl font-bold tracking-tight sm:text-4xl"
									style="color: var(--color-base-content);"
								>
									{profile.user?.name}
								</h1>
								{#if profile.user.role}
									<RoleCard role={profile.user.role} />
								{/if}
							</div>

							<ProfileInfo {isEditing} {profile} bind:newProfileInfo />

							<section class="space-y-3 space-x-4 pt-4">
								{#if isLoading}
									<button class="btn-small w-full cursor-not-allowed space-x-4 opacity-70" disabled>
										<Icon icon="svg-spinners:blocks-shuffle-3" class="iconify" />
										<span>Processing...</span>
									</button>
								{:else}
									{#if !isEditing && profile.userId !== $session.data?.user.id}
										<FollowButton bind:profile />
									{/if}

									{#if profile.userId === $session.data?.user.id}
										{#if isEditing}
											<div class="flex flex-col gap-2 sm:flex-row">
												<button onclick={handleSave} class="btn-small" disabled={isLoading}>
													<Icon icon="mdi:content-save" class="iconify"></Icon>
													Save
												</button>
												<button
													onclick={handleCancel}
													class="btn-small-active"
													disabled={isLoading}
												>
													<Icon icon="mdi:close" class="iconify"></Icon>
													Cancel
												</button>
											</div>
										{:else}
											<button onclick={handleEdit} class="btn-small flex items-center gap-2">
												<Icon icon="mdi:account-edit" class="iconify"></Icon>
												Edit Profile
											</button>
											<a href={`/pages/delete_user/${userPage}`} class="btn-delete flex items-center gap-2">
												<Icon icon="mdi:account-edit" class="iconify"></Icon>
												Delete Account
											</a>
										{/if}
									{/if}
								{/if}
							</section>
						</div>
					</div>
				</div>

				<div class="">
					<div class="card-border-subtle mb-6 border-b">
						<nav class="-mb-px flex space-x-6">
							<button
								onclick={() => changeTab('posts')}
								class:text-[var(--color-primary)]={activeTab === 'posts'}
								class:border-[var(--color-primary)]={activeTab === 'posts'}
								class:border-transparent={activeTab !== 'posts'}
								class="btn-nav inline-flex items-center border-b-2 px-1 py-3 text-base font-semibold"
							>
								Posts
							</button>
							<button
								onclick={() => changeTab('comments')}
								class:text-[var(--color-primary)]={activeTab === 'comments'}
								class:border-[var(--color-primary)]={activeTab === 'comments'}
								class:border-transparent={activeTab !== 'comments'}
								class="btn-nav inline-flex items-center border-b-2 px-1 py-3 text-base font-semibold"
							>
								Comments
							</button>
						</nav>
					</div>

					{#if isLoading}
						<section class="flex min-h-64 flex-col items-center justify-center gap-4 py-12">
							<Icon
								icon="svg-spinners:blocks-shuffle-3"
								class="text-4xl"
								style="color: var(--color-primary);"
							/>
							<p class="text-base" style="color: var(--color-muted);">Loading {activeTab}...</p>
						</section>
					{:else if activeTab === 'posts' && posts && posts.length > 0}
						<ForumFeed {posts} />
						{#if pagination && pagination.totalPages > 1}
							<div class="flex justify-center py-4">
								<Pagination
									{pagination}
									{incrementPage}
									{decrementPage}
									isPaginationLoading={isLoading}
								/>
							</div>
						{/if}
					{:else if activeTab === 'comments' && comments && comments.length > 0}
						<CommentFeed {comments} />
						{#if pagination && pagination.totalPages > 1}
							<div class="flex justify-center py-4">
								<Pagination
									{pagination}
									{incrementPage}
									{decrementPage}
									isPaginationLoading={isLoading}
								/>
							</div>
						{/if}
					{:else}
						<section class="card-setup flex flex-col items-center justify-center gap-4 py-12">
							<Icon
								icon="material-symbols:info-outline"
								class="text-4xl"
								style="color: var(--color-muted);"
							/>
							<p class="text-lg" style="color: var(--color-muted);">No {activeTab} yet.</p>
						</section>
					{/if}
				</div>
			</div>
		{:else}
			<div
				class="card-setup flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 p-8"
			>
				<Icon
					icon="material-symbols:error-outline"
					class="text-5xl"
					style="color: var(--color-error);"
				/>
				<p class="text-center text-2xl font-semibold" style="color: var(--color-error);">
					Profile not found or an error occurred.
				</p>
				<button class="btn-small mt-4" onclick={() => window.location.reload()}>
					Reload Page
				</button>
			</div>
		{/if}
	</div>
</main>
