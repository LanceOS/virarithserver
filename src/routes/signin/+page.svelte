<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorModal from '$lib/components/Popups/ErrorModal.svelte';
	import SuccessModal from '$lib/components/Popups/SuccessModal.svelte';
	import PBClient from '$lib/tools/Pocketbase.js';
	import Icon from '@iconify/svelte';

	let credentials = $state({
		email: '',
		password: ''
	});

	let loading = $state(false);
	let errorLog = $state('');
	let success = $state('');

	$effect(() => {
		credentials.email;
		credentials.password;
		errorLog = '';
	});

	const redirect = () => {
		success = 'Successfully signed in! Redirecting...';
		setTimeout(() => {
			goto('/');
		}, 3000);
	};

	const validateForm = () => {
		if (!credentials.email || !credentials.password) {
			errorLog = 'A Field is missing!';
			return false;
		} else {
			return true;
		}
	};

	const signInUser = async () => {
		errorLog = '';
		if (!validateForm()) {
			return;
		}
		loading = true;

		try {
			await PBClient.signin(credentials);

			credentials = {
				email: '',
				password: ''
			};

			redirect();
		} catch (error: any) {
			errorLog = "Failed to authenticate."
			console.log(error)
			throw new Error(`Failed to sign in user" ${error}`);
		} finally {
			loading = false;
		}
	};
</script>

<main class="relative flex min-h-screen w-full">
	<section class="w-full overflow-hidden">
		<img src="/images/snow.png" alt="" class="h-full w-full object-cover" />
	</section>

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
			<div class="flex h-fit items-center justify-between">
				<h1 class="text-4xl">Signin</h1>
			</div>

			<div class="flex flex-col gap-8">
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
			</div>

			<!-- Sign in and sign up buttons are disabled while loadings -->
			<div class="flex flex-col gap-4">
				<button type="button" class="btn-big" disabled={loading} onclick={() => signInUser()}
					>Signin</button
				>
				<p>
					No account? Sign up for a new one <button
						aria-label="Signup"
						class="cursor-pointer text-blue-500 duration-200 hover:text-blue-900"
						onclick={() => goto('/signup')}
						disabled={loading}>here.</button
					>
				</p>
			</div>
		</div>
	</section>
</main>
