<script lang="ts">
    import Footer from '$lib/client/components/landing/Footer.svelte';
    import Header from '$lib/client/components/landing/Header.svelte';
    import data from '$lib/data/PrivacyPolicy.json' with { type: 'json' };

    interface SubSubListItem {
        subSubHeading: string;
        text: string;
    }

    interface SectionContent {
        text?: string;
        subHeading?: string;
        list?: (string | SubSubListItem)[];
    }

    interface PolicySection {
        heading: string;
        content: string | SectionContent[];
    }

    interface PrivacyPolicyData {
        title: string;
        lastUpdated?: string;
        introduction: string;
        sections: PolicySection[];
    }

    interface PrivacyJsonRoot {
        privacyPolicy: PrivacyPolicyData;
    }

    const privacyPolicy: PrivacyPolicyData = (data as PrivacyJsonRoot).privacyPolicy;
</script>

<Header />
<main class="text-base-content mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mb-12">
        <h1 class="text-base-content text-4xl font-extrabold tracking-tight sm:text-5xl">
            {privacyPolicy.title}
        </h1>
        <p class="text-text-secondary mt-4 text-xl">
            {privacyPolicy.introduction}
            {#if privacyPolicy.lastUpdated}
                <br /><br />
                Last Updated: {privacyPolicy.lastUpdated}
            {/if}
        </p>
    </div>

    {#each privacyPolicy.sections as section}
        <section class="bg-card border-card-border mb-10 rounded-lg border p-6 shadow-md">
            <h2 class="text-base-content mb-4 text-2xl font-bold">{section.heading}</h2>
            {#if Array.isArray(section.content)}
                {#each section.content as content}
                    <div class="mb-6">
                        {#if content.subHeading}
                            <h3 class="text-base-content mb-2 text-xl font-semibold">{content.subHeading}</h3>
                        {/if}
                        {#if content.text}
                            <p class="text-base-content leading-relaxed">{@html content.text}</p>
                        {/if}

                        {#if content.list}
                            <ul class="text-base-content mt-4 list-inside list-disc space-y-2">
                                {#each content.list as item}
                                    {#if typeof item === 'string'}
                                        <li>{@html item}</li>
                                    {:else}
                                        <li>
                                            {#if item.subSubHeading}
                                                <strong>{item.subSubHeading}</strong>
                                            {/if}
                                            {#if item.text}
                                                {@html item.text}
                                            {/if}
                                        </li>
                                    {/if}
                                {/each}
                            </ul>
                        {/if}
                    </div>
                {/each}
            {:else}
                <p class="text-base-content leading-relaxed">{@html section.content}</p>
            {/if}
        </section>
    {/each}
</main>
<Footer />