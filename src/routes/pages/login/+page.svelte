<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client.ts';
	import ErrorModal from '$lib/components/popups/ErrorModal.svelte';
	import SuccessModal from '$lib/components/popups/SuccessModal.svelte';

	import Icon from '@iconify/svelte';

	let credentials = $state({
		email: '',
		password: ''
	});

	let loading = $state(false);
	let errorLog = $state('');
	let successLog = $state('');

	$effect(() => {
		credentials.email;
		credentials.password;
		errorLog = '';
	});

	const redirect = () => {
		successLog = 'Successfully signed in! Redirecting...';
		setTimeout(() => {
			goto('/');
		}, 2000);
	};

	const validateForm = () => {
		if (!credentials.email || !credentials.password) {
			errorLog = 'A Field is missing!';
			return false;
		} else {
			return true;
		}
	};

	const logInUser = async () => {
		errorLog = '';
		if (!validateForm()) {
			return;
		}
		loading = true;

		await authClient.signIn
			.email({
				email: credentials.email,
				password: credentials.password
			})
			.then(() => {
				redirect();
			})
			.catch((error) => {
				console.log(error.message, error.status);
				errorLog = 'Failed to sign in.';
				throw new Error(`Failed to sign in ${error}`);
			})
			.finally(() => {
				credentials = {
					email: '',
					password: ''
				};

				loading = false;
			});
	};

	const signInWithDiscord = async () => {
        errorLog = '';
        loading = true;

        try {
            await authClient.signIn.social({
                provider: 'discord',
            });

        } catch (error: any) {
            console.error('Discord Sign-in Error:', error.message, error.status);
            errorLog = error.message || 'Failed to sign in with Discord.';
        } finally {
            loading = false;
        }
    };
</script>

<main class="relative flex min-h-screen w-full overflow-hidden">
	<section class="w-full overflow-hidden">
		<img src="/images/snow.png" alt="" class="h-full w-full object-cover" />
	</section>

	<section class="relative flex w-3/4 items-center justify-center px-4">
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
		<div class="flex w-[25rem] flex-col gap-8">
			<div class="flex h-fit items-center justify-between">
				<h1 class="text-4xl">Log In</h1>
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
            <div>
                <button type="button" class="btn-discord w-full flex items-center justify-center gap-2" disabled={loading} onclick={signInWithDiscord}>
                    <Icon icon="ic:baseline-discord" class="text-2xl" />
                    Log in with Discord
                </button>
            </div>
			<!-- Log in and register buttons are disabled while loadings -->
			<div class="flex flex-col gap-4">
				<button type="button" class="btn-big" disabled={loading} onclick={() => logInUser()}
					>Log In</button
				>
				<p>
					No account? Create a new one <button
						aria-label="Signup"
						class="cursor-pointer text-blue-500 duration-200 hover:text-blue-900"
						onclick={() => goto('/pages/register')}
						disabled={loading}>here.</button
					>
				</p>
			</div>
		</div>
	</section>
</main>
