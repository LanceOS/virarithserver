<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
	import type { UserSchema } from '$lib/schemas/authentication.ts';
	import type { CommentSchema } from '$lib/schemas/Comments.ts';
	import PostClient from '$lib/client/PostClient.client.ts';
	import Icon from '@iconify/svelte';
	import ErrorModal from '../popups/ErrorModal.svelte';
	import UserClient from '$lib/client/UserClient.client.ts';

	let { data, user } = $props<{
		data?: PostWithImage | CommentSchema;
		user?: UserSchema;
	}>();

	/**
	 * @description We are getting the data from the passed object or the passed user. This is so that way
	 * You can pass either or while not having to worry about specific attribute names.
	 */
	let currentUser: UserSchema | undefined = $state();

	let errorLog: string = $state('');

	$effect(() => {
		if (data) {
			currentUser = data.user;
		} else {
			currentUser = user;
		}
	});

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	let openPostActions = $state(false);

	const deletePost = async () => {
		openPostActions = false;

		try {
			if (!data) return;

			if (data.type === 'post') {
				await PostClient.deletePost(data);
			}

			goto('/pages/forum');
		} catch (error) {
			console.log(error);
			errorLog = 'Failed to delete post';
		} finally {
			window.location.reload();
		}
	};

	const handleClickOutsidePostActions = (event: MouseEvent) => {
		const target = event.target as Element;
		if (
			!target.closest('.actions-menu-container') &&
			!target.closest('.stat-item.actions-button')
		) {
			openPostActions = false;
		}
	};

	$effect(() => {
		if (openPostActions) {
			document.addEventListener('click', handleClickOutsidePostActions);
			return () => {
				document.removeEventListener('click', handleClickOutsidePostActions);
			};
		}
	});

	const reportObject = async () => {
		openPostActions = false;

		try {
			await UserClient.userReportTool(data);
		} catch (error: any) {
			errorLog = error;
		} finally {
			if (!errorLog) {
				window.location.reload();
			}
		}
	};
</script>

{#if errorLog}
	<ErrorModal {errorLog} />
{/if}
<header
	class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4"
>
	<div class="flex flex-wrap items-center gap-4">
		{#if currentUser?.image}
			<div class="user-avatar flex-shrink-0">
				<img
					src={currentUser?.image}
					alt={currentUser?.name || 'User avatar'}
					class="h-10 w-10 rounded-full object-cover"
				/>
			</div>
		{/if}
		<div class="flex flex-col leading-tight">
			<a
				class="btn-nav font-semibold"
				style="color: var(--color-base-content)"
				href={`/pages/profile/${currentUser?.id}`}
			>
				{currentUser?.name}
			</a>
			{#if data}
				<time
					class="text-sm font-light"
					datetime={data.createdAt}
					style="color: var(--color-muted);"
				>
					{formatDate(data.createdAt)}
				</time>
			{/if}
		</div>

		<div class="mt-1 flex items-center gap-2 sm:mt-0">
			{#if currentUser?.role === 'developer'}
				<div class="role-card rounded bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800">
					<p>Developer</p>
				</div>
			{:else if currentUser?.role === 'admin'}
				<div class="role-card rounded bg-red-200 px-2 py-0.5 text-xs font-medium text-red-800">
					<p>Admin</p>
				</div>
			{:else if currentUser?.role === 'moderator'}
				<div class="role-card rounded bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800">
					<p>Moderator</p>
				</div>
			{:else if currentUser?.role === 'founder'}
				<div class="role-card rounded bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800">
					<p>Founder</p>
				</div>
			{/if}
			{#if data && data.isEdited}
				<p class="text-xs" style="color: var(--color-muted);">(edited)</p>
			{/if}
		</div>
	</div>
	{#if data}
		<div class="relative flex items-center gap-2">
			<span
				class="mt-2 flex-shrink-0 text-sm font-medium sm:mt-0"
				style="color: var(--color-muted);"
			>
				{data.category.toUpperCase()}
			</span>

			<button
				class="stat-item actions-button"
				onclick={() => (openPostActions = !openPostActions)}
				aria-label="Post actions"
			>
				<Icon icon="ic:outline-more-vert" class="stat-icon" />
			</button>
			{#if openPostActions}
				<div
					class="actions-menu-container absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden"
				>
					{#if user && user.id === data.user.id}
						{#if data.isEdited === false}
							<button
								onclick={() => goto(`/pages/edit_post/${data?.id}`)}
								class="actions-menu-item"
							>
								<Icon icon="mdi:text-box-edit-outline" />
								<span class="text-sm font-medium">Edit</span>
							</button>
						{/if}

						<div class="border-t" style="border-color: var(--color-border-subtle);"></div>

						<button onclick={deletePost} class="actions-menu-item danger">
							<Icon icon="mdi:trash-can-outline" />
							<span class="text-sm font-medium">Delete</span>
						</button>
					{/if}
					{#if !data.isReported && data.user.id !== user.id}
						<button class="actions-menu-item danger" onclick={reportObject}>
							<Icon icon="material-symbols:report-outline" />
							<span class="text-sm font-medium">Report</span>
						</button>
					{:else if data.isReported}
						<div class="actions-menu-item">
							<p class="text-sm font-medium">Already Reported</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</header>
