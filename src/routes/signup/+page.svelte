<script>
	import { goto } from '$app/navigation';
	import PBClient from '$lib/tools/Pocketbase.js';
	import Icon from '@iconify/svelte';

	let credentials = $state({
		email: '',
		password: '',
		confirmPassword: '',
        name: ''
	});

	let loading = $state(false);
	let error = $state("");
	
	const validateForm = () => {
		if(!credentials.email || !credentials.password || !credentials.confirmPassword || !credentials.name) {
			error = "A Field is missing!"
			return false;
		}
		else if(credentials.password !== credentials.confirmPassword) {
			error = "Both passwords must match!"
			return false;
		}
		else if(credentials.password.length < 8) {
			error = "Password must be longer than 8 characters!"
			return false
		}
		else {
			return true;
		}
	}
	
	const createAccount = async () => {
		error = "";
		if(!validateForm()) {
			return;
		}
		loading = true;

		console.log("creating account")

		try {
			await PBClient.register(credentials);
			await PBClient.signin(credentials);

			credentials = {
				email: '',
				password: '',
				confirmPassword: '',
				name: ''
			};
		}
		catch(error) {
			error = "Failed to create user or sign in"
			throw new Error(`Failed to create user or sign in ${error}`)
		}
		finally {
			loading = false
		}
	};
</script>

<main class="flex min-h-screen w-full">
	<section class="flex w-3/4 items-center justify-center px-4" data-aos="fade-in relative">
		<button
			type="button"
			aria-label="Return Home"
			class="cursor-pointer absolute top-4 right-4"
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

			<div class="flex flex-col gap-4">
				<button type="button" class="btn-big" onclick={() => createAccount()} disabled={loading}>Create Account</button>
				<p>
					Have an account? Sign in <button
						aria-label="Signup"
						class="cursor-pointer text-blue-500 duration-200 hover:text-blue-900"
						onclick={() => goto('/signin')} disabled={loading}>here.</button
					>
				</p>
			</div>
		</div>
	</section>
	<section class="w-full">
		<img src="/images/gray.png" alt="" class="h-full w-full object-cover" />
	</section>
</main>
