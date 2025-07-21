<script lang="ts">
	import Footer from '$lib/client/components/landing/Footer.svelte';
	import Header from '$lib/client/components/landing/Header.svelte';
	import data from '$lib/data/TermsOfService.json' with { type: 'json' };

	const termsOfService = data.termsOfService;
</script>

<Header />
<main class="text-base-content mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<div class="mb-12">
		<h1 class="text-base-content text-4xl font-extrabold tracking-tight sm:text-5xl">
			{termsOfService.title}
		</h1>
		<p class="text-text-secondary mt-4 text-xl">{termsOfService.introduction}</p>
	</div>

	{#each termsOfService.sections as section}
		<section class="bg-card border-card-border mb-10 rounded-lg border p-6 shadow-md">
			<h2 class="text-base-content mb-4 text-2xl font-bold">{section.heading}</h2>
			{#if Array.isArray(section.content)}
				{#each section.content as content}
					<div class="mb-6">
						<h3 class="text-base-content mb-2 text-xl font-semibold">{content.subHeading}</h3>
						<p class="text-base-content leading-relaxed">{content.text}</p>
						{#if content.list}
							<ul class="text-base-content mt-4 list-inside list-disc space-y-2">
								{#each content.list as item}
									<li>{item}</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			{:else}
				<p class="text-base-content leading-relaxed">{section.content}</p>
			{/if}
		</section>
	{/each}
</main>
<Footer />
