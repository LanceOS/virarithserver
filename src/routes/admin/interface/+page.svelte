<script lang="ts">
	import { authClient } from '$lib/auth-client.ts';
	import UserActions from '$lib/components/actions/UserActions.svelte';
	import RoleCard from '$lib/components/cards/RoleCard.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import ErrorModal from '$lib/components/popups/ErrorModal.svelte';
	import ProfileAvatar from '$lib/components/profile/ProfileAvatar.svelte';
	import { type UserSchema } from '$lib/server/schemas/authentication.ts';
	import UserClient from '$lib/client/tools/UserClient.client.ts';

	const session = authClient.useSession();
	const currentUser = $session.data?.user || undefined;

	const roles: string[] = ['admin', 'developer', 'founder', 'moderator', 'user'];

	let searchedUser: UserSchema | undefined = $state();
	let nameInput: string = $state('');
	let selectedRole: string = $state('');

	let warning: string = $state('');
	let warningError: string = $state('');

	let errorLog: string = $state('');

	let banAction: boolean = $state(false);
	let roleAction: boolean = $state(false);

	const searchUser = async () => {
		errorLog = '';
		searchedUser = undefined;
		banAction = false;
		roleAction = false;

		try {
			if (nameInput) {
				const response = await UserClient.getUserByName(nameInput);
				if (response && response.role) {
					searchedUser = response;
					selectedRole = response.role;
				} else {
					errorLog = 'User not found.';
				}
			} else {
				errorLog = 'Must provide a name!';
			}
		} catch (error: any) {
			errorLog = error.message;
		}
	};

	const updateUserRole = async () => {
		errorLog = '';
		if (!searchedUser) {
			errorLog = 'No user selected to update.';
			return;
		}
		if (selectedRole === searchedUser.role) {
			errorLog = 'The selected role is already the current role.';
			banAction = false;
			roleAction = false;
			return;
		}

		const formData = new FormData();
		formData.append('userId', searchedUser.id);
		formData.append('newRole', selectedRole);

		try {
			await fetch('?/updateUser', {
				method: 'PUT',
				body: formData
			});
			searchedUser.role = selectedRole;
			errorLog = `Successfully updated role for ${searchedUser.name} to ${selectedRole}.`;
			banAction = false;
			roleAction = false;
		} catch (error: any) {
			errorLog = `Failed to update role: ${error.message}`;
		}
	};

	const banUser = async () => {
		errorLog = '';
		if (!searchedUser) {
			errorLog = 'No user selected to ban.';
			return;
		}

		try {
			banAction = false;
			roleAction = false;
			searchedUser = undefined;
			nameInput = '';
		} catch (error: any) {
			errorLog = `Failed to ban user: ${error.message}`;
		}
	};

	const cancelAction = () => {
		banAction = false;
		roleAction = false;
		warning = '';
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
				warning = `You are about to ban a user's account. This will result in the permanent and irreversible deletion
                of all content created by this user. THIS CANNOT BE UNDONE!`;
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
				warning = `You are about to give the selected user an administrative role. This will allow them to edit contents
                of the site such as other users profiles and `;
				return;
			} else if (searchedUser?.role !== 'user') {
				warning = `You are about the change the role of an administrative user. Are you sure you want to change them from ${searchedUser?.role}
                to ${selectedRole}.`;
				return;
			}
		}
	});
</script>

{#if errorLog}
	<ErrorModal {errorLog} />
{/if}
{#if roleAction}
	<UserActions {warning} {cancelAction} />
{/if}
{#if banAction}
	<UserActions {warning} {cancelAction} />
{/if}
<Header />
<main class="bg-base min-h-screen px-4 py-16">
	<div class="card-setup mx-auto flex max-w-7xl flex-col gap-8">
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
							<button type="button" class="btn-small" onclick={() => (roleAction = true)}>
								Update Role
							</button>
						</div>

						<div class="flex items-center gap-4">
							<button type="button" class="btn-delete" onclick={() => (banAction = true)}>
								Ban User
							</button>
						</div>
						<div></div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>
