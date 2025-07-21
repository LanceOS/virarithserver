<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	// The 'UserActions' component is no longer needed here as we've created specific modals.
	// import UserActions from '$lib/client/components/actions/UserActions.svelte';
	import RoleCard from '$lib/client/components/cards/RoleCard.svelte';
	import Header from '$lib/client/components/landing/Header.svelte';
	import ProfileAvatar from '$lib/client/components/profile/ProfileAvatar.svelte';
	import { type UserSchema } from '$lib/server/schemas/authentication.ts';
	import UserClient from '$lib/client/tools/UserClient.client.ts';
	import { toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const session = authClient.useSession();
	const currentUser = $session.data?.user || undefined;

	const roles: string[] = ['admin', 'developer', 'founder', 'moderator', 'user'];

	let searchedUser: UserSchema | undefined = $state();
	let nameInput: string = $state('');
	let selectedRole: string = $state('');

	let warning: string = $state('');
	let warningError: string = $state('');

	let banAction: boolean = $state(false);
	let roleAction: boolean = $state(false);

	let banReason: string = $state('');

	const searchUser = async () => {
		searchedUser = undefined;
		banAction = false;
		roleAction = false;
		warningError = '';

		try {
			if (nameInput) {
				const response = await UserClient.getUserByName(nameInput);
				if (response && response.role) {
					searchedUser = response;
					selectedRole = response.role;
				} else {
					toast.push('User not found.');
				}
			} else {
				toast.push('Must provide a name!');
			}
		} catch (error: any) {
			toast.push(error.message);
		}
	};

	const updateUserRole = async () => {
		if (!searchedUser) {
			toast.push('No user selected to update.');
			return;
		}
		if (selectedRole === searchedUser.role) {
			toast.push('The selected role is already the current role.');
			roleAction = false;
			return;
		}

		const userToChange = {
			id: searchedUser.id,
			newRole: selectedRole
		};

		try {
			const response = await fetch('/admin/interface/update_role', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userToChange)
			});

			if (response.status !== 200) {
				throw new Error('');
			}
			searchedUser.role = selectedRole;
			toast.push(`Successfully updated role for ${searchedUser.name} to ${selectedRole}.`);
			roleAction = false;
		} catch (error: any) {
			toast.push(`Failed to update role: ${error.message}`);
		}
	};

	const banUser = async () => {
		if (!searchedUser) {
			toast.push('No user selected to ban.');
			return;
		}
		if (!banReason.trim()) {
			toast.push('A reason for the ban is required.');
			return;
		}

		const userToBan = {
			id: searchedUser.id,
			email: searchedUser.email,
			reason: banReason
		};

		try {
			const response = await fetch('/admin/interface/ban_user', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userToBan)
			});

			if (!response.ok) {
				const errorResult = await response
					.json()
					.catch(() => ({ message: 'An unknown error occurred.' }));
				throw new Error(errorResult.message);
			}

			toast.push(`Successfully banned ${searchedUser.name}.`);

			searchedUser = undefined;
			nameInput = '';
			banAction = false;
			banReason = '';
		} catch (error: any) {
			toast.push(`Failed to ban user: ${error.message}`);
		}
	};

	const cancelAction = () => {
		banAction = false;
		roleAction = false;
		warning = '';
		banReason = '';
	};

	$effect(() => {
		if (banAction) {
			if (searchedUser?.role === 'founder' && currentUser?.role !== 'founder') {
				warningError = `Only founders can edit other founders!`;
				warning = '';
				banAction = false;
				roleAction = false;
				return;
			} else {
				warning = `You are about to ban this user's account. This will result in the permanent and irreversible deletion of all content created by this user. THIS CANNOT BE UNDONE!`;
				return;
			}
		}
	});

	$effect(() => {
		if (roleAction) {
			if (searchedUser?.role === 'founder' && currentUser?.role !== 'founder') {
				warningError = `Only founders can edit other founders!`;
				warning = '';
				banAction = false;
				roleAction = false;
				return;
			} else if (selectedRole !== 'user' && searchedUser?.role === 'user') {
				warning = `You are about to give the selected user an administrative role. This will allow them to edit site content and manage other users.`;
				return;
			} else if (searchedUser?.role !== 'user') {
				warning = `You are about the change the role of an administrative user from ${searchedUser?.role} to ${selectedRole}. Are you sure?`;
				return;
			}
		}
	});

	onMount(() => {
		const user = $session?.data?.user;
		if (!user || user.role === 'user') {
			goto('/');
		}
	});
</script>

{#if roleAction}
	<div class="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="card-setup max-w-lg space-y-4 p-6">
			<h3 class="text-xl font-bold">Confirm Role Change</h3>
			<p class="text-base-content/80">{warning}</p>
			<div class="flex justify-end gap-4 pt-2">
				<button type="button" class="btn-small-active" onclick={cancelAction}>Cancel</button>
				<button type="button" class="btn-small" onclick={updateUserRole}>Confirm Update</button>
			</div>
		</div>
	</div>
{/if}

{#if banAction}
	<div class="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="card-setup max-w-lg space-y-4 p-6">
			<h3 class="text-error text-xl font-bold">Confirm Ban</h3>
			<p class="text-base-content/80">{warning}</p>

			<div class="form-control w-full">
				<label for="ban-reason" class="label">
					<span class="label-text font-semibold">Reason for Ban (Required)</span>
				</label>
				<input
					id="ban-reason"
					type="text"
					placeholder="Enter reason..."
					bind:value={banReason}
					class="input w-full"
				/>
			</div>

			<div class="flex justify-end gap-4 pt-2">
				<button type="button" class="btn-small-active" onclick={cancelAction}>Cancel</button>
				<button type="button" class="btn-delete" onclick={banUser} disabled={!banReason.trim()}>
					Confirm Ban
				</button>
			</div>
		</div>
	</div>
{/if}

<Header />
<main class="bg-base mx-auto min-h-screen max-w-7xl px-4 py-16 space-y-4">
	<section>
		<button type="button" class="btn-nav" onclick={() => goto("/admin/reported_feed")}>Report Feed</button>
	</section>
	<div class="card-setup flex flex-col gap-8">
		<div class="space-y-4">
			<h1 class="text-3xl font-bold">Admin User Management</h1>
			<p>
				Here you can search for a user and modify their role. You can demote and promote users as
				well as delete them.
			</p>
		</div>

		<div class="flex items-center gap-4">
			<input
				type="text"
				placeholder="Search user by name..."
				bind:value={nameInput}
				class="input w-full"
				aria-label="Search users"
				onkeydown={(e) => e.key === 'Enter' && searchUser()}
			/>
			<button type="button" class="btn-small" onclick={searchUser}>Search</button>
		</div>

		{#if searchedUser}
			<div class="space-y-4">
				<div class="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-10">
					<ProfileAvatar avatar={searchedUser.image || undefined} />

					<div class="flex-1 space-y-6 text-center lg:text-left">
						<div class="flex h-fit flex-col items-center gap-4 sm:flex-row">
							<h2
								class="text-3xl font-bold tracking-tight sm:text-4xl"
								style="color: var(--color-base-content);"
							>
								{searchedUser.name}
							</h2>
							<RoleCard role={searchedUser.role} />
						</div>
						{#if warningError}
							<p class="text-error">{warningError}</p>
						{/if}

						<div class="flex items-center gap-4">
							<label for="role-select" class="text-2xl font-semibold">Current Role:</label>
							<select id="role-select" bind:value={selectedRole} class="dropdown-selector">
								{#each roles as roleOption}
									<option value={roleOption}>{roleOption}</option>
								{/each}
							</select>
							<button
								type="button"
								class="btn-small"
								onclick={() => (roleAction = true)}
								disabled={selectedRole === searchedUser.role}
							>
								Update Role
							</button>
						</div>

						<div class="flex items-center gap-4">
							<button type="button" class="btn-delete" onclick={() => (banAction = true)}>
								Ban User
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>
