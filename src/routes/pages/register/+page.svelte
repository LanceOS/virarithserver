<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ErrorModal from '$lib/components/popups/ErrorModal.svelte';
	import SuccessModal from '$lib/components/popups/SuccessModal.svelte';
	import Icon from '@iconify/svelte';

	const { form } = $props();

	let credentials = $state({
		email: '',
		password: '',
		confirmPassword: '',
		name: ''
	});

	let loading = $state(false);
	let errorLog = $state('');
	let successLog = $state('');

	$effect(() => {
		credentials.name;
		credentials.email;
		credentials.password;
		credentials.confirmPassword;
		errorLog = '';
	});

	const showError = (message: string) => {
		errorLog = message;
	};
</script>

<main class="relative flex min-h-screen w-full overflow-hidden">
	<h1>Registering with email and password has been disabled</h1>
	<!-- <section class="relative flex w-3/4 items-center justify-center px-4">
		{#if errorLog}
			<ErrorModal {errorLog} />
		{/if}
		{#if successLog}
			<SuccessModal {successLog} />
		{/if}
		<button
			type="button"
			aria-label="Return Home"
			class="absolute top-4 right-4 cursor-pointer"
			onclick={() => {
				goto('/');
			}}><Icon icon="stash:signout-alt" class="text-5xl" /></button
		>
		<form
			class="flex w-[25rem] flex-col gap-8"
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }: any) => {
					loading = false;
					await update();
					if (!form?.errorLog && !form?.success) {
						goto("/")
					} else {
						showError(form?.errorLog!)
					}
				};
			}}
			action="?/createNewUser"
		>
			<div class="flex h-12 items-center justify-between">
				<h1 class="text-4xl">Create Account</h1>
			</div>

			<div class="flex flex-col gap-8">
				<div class="input">
					<label for="name" class="text-lg font-bold"
						>Username <span class="color-error">*</span></label
					>
					<input
						type="text"
						name="name"
						id="name"
						class="focus:outline-0"
						bind:value={credentials.name}
					/>
				</div>

				<div class="input">
					<label for="email" class="text-lg font-bold"
						>Email <span class="color-error">*</span></label
					>
					<input
						type="email"
						name="email"
						id="email"
						class="focus:outline-0"
						bind:value={credentials.email}
					/>
				</div>

				<div class="input">
					<label for="password" class="text-lg font-bold"
						>Password <span class="color-error">*</span></label
					>
					<input
						type="password"
						name="password"
						id="password"
						class="focus:outline-0"
						bind:value={credentials.password}
					/>
				</div>

				<div class="input">
					<label for="confirm" class="text-lg font-bold"
						>Confirm Password <span class="color-error">*</span></label
					>
					<input
						type="password"
						name="confirm"
						id="confirm"
						class="focus:outline-0"
						bind:value={credentials.confirmPassword}
					/>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<button type="submit" class="btn-big" disabled={loading}>Create Account</button>
				<p>
					Have an account? Log in <button
						aria-label="Signup"
						class="cursor-pointer text-blue-500 duration-200 hover:text-blue-900"
						onclick={() => goto('/pages/login')}
						disabled={loading}>here.</button
					>
				</p>
			</div>
		</form>
	</section>
	<section class="w-full">
		<img src="/images/gray.png" alt="" class="h-full w-full object-cover" />
	</section> -->
</main>
