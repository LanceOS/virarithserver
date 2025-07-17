<script lang="ts">
	import Footer from '$lib/components/landing/Footer.svelte';
    import Header from '$lib/components/landing/Header.svelte';
    import data from '$lib/data/TermsOfService.json' with { type: 'json' };

    const termsOfService = data.termsOfService;
</script>

<Header />
<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-base-content">
    <div class="mb-12">
        <h1 class="text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">{termsOfService.title}</h1>
        <p class="mt-4 text-xl text-text-secondary">{termsOfService.introduction}</p>
    </div>

    {#each termsOfService.sections as section}
        <section class="mb-10 rounded-lg bg-card p-6 shadow-md border border-card-border">
            <h2 class="mb-4 text-2xl font-bold text-base-content">{section.heading}</h2>
            {#if Array.isArray(section.content)}
                {#each section.content as content}
                    <div class="mb-6">
                        <h3 class="mb-2 text-xl font-semibold text-base-content">{content.subHeading}</h3>
                        <p class="text-base-content leading-relaxed">{content.text}</p>
                        {#if content.list}
                            <ul class="mt-4 list-inside list-disc space-y-2 text-base-content">
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