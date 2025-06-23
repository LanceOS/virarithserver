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
	import RoleCard from '$lib/components/cards/RoleCard.svelte';

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

    let isFollowing: boolean = $state(false);

    let isEditing: boolean = $state(false);
    let isLoading: boolean = $state(false);

    let newProfileInfo = $state({
        name: '',
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
                const response = await CommentClient.getCommentsByUser({ userId: userPage, page: page })
                comments = response.comments;
                commentPagination = response.commentPagination;
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
        if (pagination?.currentPage! <= 1) {
            return;
        }
        isLoading = true;
        try {
            const page = pagination?.currentPage! - 1;
            if (activeTab === 'posts') {
                const response = await PostClient.getPostsByUser({ userId: userPage, page: page });
                posts = response.posts;
                pagination = response.pagination;
            } else if (activeTab === 'comments') {
                const response = await CommentClient.getCommentsByUser({ userId: userPage, page: page })
                comments = response.comments;
                commentPagination = response.commentPagination;
            } else {
                return;
            }
        } catch (error) {
            console.error(error);
        } finally {
            isLoading = false; 
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
            
            newProfileInfo.bio = profile?.bio ? stripHtmlTags(profile.bio) : '';
            newProfileInfo.minecraftName = profile?.minecraftName ? stripHtmlTags(profile.minecraftName) : '';
            newProfileInfo.discordName = profile?.discordName ? stripHtmlTags(profile.discordName) : '';
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


            profile = await ProfileClient.getUserProfile(userPage)
        } catch (error) {
            console.error('Error saving profile:', error);
            alert(`Failed to save profile: ${error}`); 
        } finally {
            isLoading = false;
            isEditing = false;
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
            const [ profileResponse, postResponse, commentResponse ] = await Promise.all([
                await ProfileClient.getUserProfile(userPage),
                await PostClient.getPostsByUser({ userId: userPage, page: 1 }),
                await CommentClient.getCommentsByUser({ userId: userPage, page: 1 })
            ])

            profile = profileResponse;
            profileUser = profile?.user;

            posts = postResponse.posts;
            postPagination = postResponse.pagination;

            pagination = postPagination; 

            comments = commentResponse.comments;
            commentPagination = commentResponse.pagination;

        }
        catch(error) {
            console.error("Error fetching profile data:", error);
        }
    });
</script>

<Header />
<main class="mx-auto min-h-screen max-w-7xl p-4 sm:p-6 lg:p-8">
    <div class="container w-full">
        {#if profile}
            <div class="space-y-8">
                <div class="card-setup p-6">
                    <div class="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-10">
                        <ProfileAvatar {isEditing} bind:newAvatar avatar={profile?.user.image || undefined}/>

                        <div class="flex-1 space-y-6 text-center lg:text-left">
                            <div class="flex items-center gap-6 h-fit">
                                <h1 class="content text-3xl sm:text-4xl font-bold tracking-tight">
                                    {profile.user?.name}
                                </h1>
                                <RoleCard role={profile.user.role}/>
                            </div>

                            <ProfileInfo {isEditing} {profile} bind:newProfileInfo />

                            <section class="space-y-3 pt-4">
                                {#if !isHydrated || isLoading}
                                    <div class="btn-small flex w-full items-center justify-center gap-2 opacity-60 cursor-not-allowed">
                                        <Icon icon="svg-spinners:ring-resize" class="text-lg"/>
                                        Loading...
                                    </div>
                                {:else}
                                    {#if !isEditing && profile.userId !== $session.data?.user.id}
                                        <button
                                            onclick={handleFollow}
                                            class="btn-big-active flex w-full items-center justify-center gap-2"
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
                                            <div class="flex flex-col sm:flex-row gap-2">
                                                <button
                                                    onclick={handleSave}
                                                    class="btn-big-active flex flex-1 items-center justify-center gap-2"
                                                    disabled={isLoading}
                                                >
                                                    <Icon icon="mdi:content-save" class="text-lg"></Icon>
                                                    Save
                                                </button>
                                                <button
                                                    onclick={handleCancel}
                                                    class="btn-small border-muted flex flex-1 items-center justify-center gap-2"
                                                    disabled={isLoading}
                                                >
                                                    <Icon icon="mdi:close" class="text-lg"></Icon>
                                                    Cancel
                                                </button>
                                            </div>
                                        {:else}
                                            <button
                                                onclick={handleEdit}
                                                class="btn-small border-muted flex w-full items-center justify-center gap-2"
                                            >
                                                <Icon icon="mdi:account-edit" class="text-lg"></Icon>
                                                Edit Profile
                                            </button>
                                        {/if}
                                    {/if}
                                {/if}
                            </section>
                        </div>
                    </div>
                </div>

                <div class="card-setup p-6">
                    <div class="mb-6 border-b border-[var(--color-card-border)]">
                        <nav class="flex space-x-6 -mb-px"> <button
                                onclick={() => changeTab("posts")}
                                class:text-[var(--color-primary)]={activeTab === 'posts'}
                                class:border-[var(--color-primary)]={activeTab === 'posts'}
                                class:border-transparent={activeTab !== 'posts'}
                                class="inline-flex items-center px-1 py-3 text-base font-semibold border-b-2 btn-nav"
                            >
                                Posts
                            </button>
                            <button
                                onclick={() => changeTab("comments")}
                                class:text-[var(--color-primary)]={activeTab === 'comments'}
                                class:border-[var(--color-primary)]={activeTab === 'comments'}
                                class:border-transparent={activeTab !== 'comments'}
                                class="inline-flex items-center px-1 py-3 text-base font-semibold border-b-2 btn-nav"
                            >
                                Comments
                            </button>
                            </nav>
                    </div>

                    {#if isHydrated}
                        <div class="space-y-4">
                            {#if pagination && pagination.totalPages > 1}
                                <div class="flex justify-center py-4">
                                    <Pagination {pagination} {incrementPage} {decrementPage} isPaginationLoading={isLoading} />
                                </div>
                            {/if}

                            {#if !isLoading}
                                {#if activeTab === 'posts' && posts && posts.length > 0}
                                    <ForumFeed {posts} />
                                {:else if activeTab === 'comments' && comments && comments.length > 0}
                                    <CommentFeed {comments} />
                                {:else if (activeTab === 'posts' && (!posts || posts.length === 0)) || (activeTab === 'comments' && (!comments || comments.length === 0))}
                                    <section class="flex flex-col items-center justify-center gap-4 py-12">
                                        <Icon icon="mdi:information-outline" class="text-4xl text-[var(--color-muted)]" />
                                        <p class="muted text-lg">No {activeTab} yet.</p>
                                    </section>
                                {/if}
                            {:else}
                                <section class="flex min-h-64 flex-col items-center justify-center gap-4 py-12">
                                    <Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl text-[var(--color-primary)]" />
                                    <p class="muted text-base">Loading {activeTab}...</p>
                                </section>
                            {/if}
                        </div>
                    {:else}
                        <section class="flex min-h-64 flex-col items-center justify-center gap-4 py-12">
                            <Icon icon="svg-spinners:blocks-shuffle-3" class="text-4xl text-[var(--color-primary)]" />
                            <p class="muted text-base">Loading profile data...</p>
                        </section>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-12">
                <Icon icon="svg-spinners:blocks-shuffle-3" class="text-5xl text-[var(--color-primary)]" />
                <p class="content text-2xl font-semibold">Loading profile...</p>
            </div>
        {/if}
    </div>
</main>