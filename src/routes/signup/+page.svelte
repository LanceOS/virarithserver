<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorModal from '$lib/components/Popups/ErrorModal.svelte';
	import SuccessModal from '$lib/components/Popups/SuccessModal.svelte';
	import Icon from '@iconify/svelte';

	let credentials = $state({
		email: '',
		password: '',
		confirmPassword: '',
		name: ''
	});

	let loading = $state(false);
	let errorLog = $state('');
	let success = $state('');

	const redirect = () => {
		success = 'Successfully signed in! Redirecting...';
		setTimeout(() => {
			goto('/');
		}, 3000);
	};

	$effect(() => {
		credentials.name;
		credentials.email;
		credentials.password;
		credentials.confirmPassword;
		errorLog = '';
	});

	const validateForm = () => {
		if (
			!credentials.email ||
			!credentials.password ||
			!credentials.confirmPassword ||
			!credentials.name
		) {
			errorLog = 'A Field is missing!';
			return false;
		} else if (credentials.password !== credentials.confirmPassword) {
			errorLog = 'Both passwords must match!';
			return false;
		} else if (credentials.password.length < 8) {
			errorLog = 'Password must be longer than 8 characters!';
			return false;
		} else {
			return true;
		}
	};

	const createAccount = async () => {
		errorLog = '';
		if (!validateForm()) {
			return;
		}
		loading = true;

		console.log('creating account');

		try {
			credentials = {
				email: '',
				password: '',
				confirmPassword: '',
				name: ''
			};

			redirect();
		} catch (error: any) {
			errorLog = 'Failed to create user and sign in.';
			throw new Error(`Failed to create user or sign in ${error}`);
		} finally {
			loading = false;
		}
	};
</script>

<main class="relative flex min-h-screen w-full overflow-hidden">
	<section class="relative flex w-3/4 items-center justify-center px-4">
		{#if errorLog}
			<ErrorModal {errorLog} />
		{/if}
		{#if success}
			<SuccessModal {success} />
		{/if}
		<button
			type="button"
			aria-label="Return Home"
			class="absolute top-4 right-4 cursor-pointer"
			onclick={() => {
				goto('/');
			}}><Icon icon="stash:signout-alt" class="text-5xl" /></button
		>
		<div class="flex w-[25rem] flex-col gap-10">
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

			<!-- Sign up and sign in buttons are disabled while loading -->
			<div class="flex flex-col gap-4">
				<button type="button" class="btn-big" onclick={() => createAccount()} disabled={loading}
					>Create Account</button
				>
				<p>
					Have an account? Sign in <button
						aria-label="Signup"
						class="cursor-pointer text-blue-500 duration-200 hover:text-blue-900"
						onclick={() => goto('/signin')}
						disabled={loading}>here.</button
					>
				</p>
			</div>
		</div>
	</section>
	<section class="w-full">
		<img src="/images/gray.png" alt="" class="h-full w-full object-cover" />
	</section>
</main>
