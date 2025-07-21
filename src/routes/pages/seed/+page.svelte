<script lang="ts">
	let message = '';
	let error = false;

	const seedDatabase = async () => {
		try {
			const response = await fetch('/pages/seed', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				message = await response.json();
				error = false;
			} else {
				const errorText = await response.json();
				message = `Error: ${errorText}`;
				error = true;
			}
		} catch (e: any) {
			message = `Network error: ${e.message}`;
			error = true;
		}
	}
</script>

<main class="h-screen max-w-7xl mx-auto flex flex-col justify-center items-center gap-8">
	<h1 class="text-5xl">Database Seeder</h1>

	<button type="button" class="btn-big" onclick={seedDatabase}>Seed Database</button>

	{#if message}
		<p style="color: {error ? 'red' : 'green'};">{message}</p>
	{/if}
</main>
