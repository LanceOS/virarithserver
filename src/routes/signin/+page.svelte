<script>
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let credentials = $state({
		email: '',
		password: ''
	});
</script>

<main class="flex min-h-screen w-full">
	<section class="w-full">
		<img src="/images/snow.png" alt="" class="h-full w-full object-cover" />
	</section>

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
			<div class="flex h-fit items-center justify-between">
				<h1 class="text-4xl">Signin</h1>
			</div>

			<div class="flex flex-col gap-8">
				<div class="input">
					<label for="email" class="text-lg font-bold"
						>Email <span class="color-error">*</span></label
					>
					<input
						type="text"
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
						type="text"
						name="password"
						id="password"
						class="focus:outline-0"
						bind:value={credentials.password}
					/>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<button type="button" class="btn-big">Signin</button>
				<p>
					No account? Sign up for a new one <button
						aria-label="Signup"
						class="cursor-pointer text-blue-500 duration-200 hover:text-blue-900"
						onclick={() => goto('/signup')}>here.</button
					>
				</p>
			</div>
		</div>
	</section>
</main>
