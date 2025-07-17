<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import UserClient from '$lib/client/UserClient.ts';

	const deleteUser = async () => {
		try {
			await UserClient.deleteUser();
		} catch (error) {
			console.error(error);
		} finally {
			await authClient.signOut();
			goto('/');
		}
	};
</script>

<main class="mx-auto flex h-screen max-w-4xl items-center justify-center px-4">
	<div class="card-setup h-fit w-full space-y-18 p-4 text-center">
		<div class="space-y-4 text-center">
			<h1 class="text-error text-3xl font-semibold">DELETE ACCOUNT</h1>
			<p class="muted text-xl">
				Heads up! You're about to permanently delete your account. Your personal information will be
				removed, but your content (posts, comments, etc.) will stay on the platform, attributed to
				an anonymous user. This action is irreversible. If you're certain, click 'Confirm Delete'.
			</p>
		</div>
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<button type="button" class="btn-delete" onclick={deleteUser}>CONFIRM DELETE</button>
			<a href="/" class="btn-small">CANCEL DELETE</a>
		</div>
	</div>
</main>
