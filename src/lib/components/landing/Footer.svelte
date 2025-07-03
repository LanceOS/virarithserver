<script lang="ts">
    import Icon from "@iconify/svelte";

    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "Rules", href: "/pages/rules" },
        { name: "Vote", href: "/pages/vote" },
    ];

    const legalLinks = [
        { name: "Terms of Service", href: "/pages/terms-of-service" },
    ];

    const socialLinks = [
        { name: "Discord", href: "https://discord.gg/EHeUmvuV", icon: "ic:baseline-discord" },
    ];
</script>

<footer class="bg-card py-12 mt-16">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 text-center md:text-left">
            <div class="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col items-center md:items-start gap-3">
                <p class="text-2xl font-bold" style="color: var(--color-base-content);">VirarithMC</p>
                <p class="text-sm" style="color: var(--color-muted);">&copy; {new Date().getFullYear()} VirarithMC. All rights reserved.</p>
                <p class="text-sm mt-2" style="color: var(--color-muted);">
                    A vibrant community for Minecraft enthusiasts. Join us for an unforgettable gaming experience!
                </p>
            </div>

            <nav class="col-span-1" aria-labelledby="quick-links-heading">
                <h3 id="quick-links-heading" class="text-lg font-semibold mb-4" style="color: var(--color-base-content);">Quick Links</h3>
                <ul class="space-y-3">
                    {#each quickLinks as link}
                        <li>
                            <a
                                href={link.href}
                                class="btn-nav"
                                style="color: var(--color-muted); --tw-text-opacity: 1;"
                            >
                                {link.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>

            <nav class="col-span-1" aria-labelledby="community-heading">
                <h3 id="community-heading" class="text-lg font-semibold mb-4" style="color: var(--color-base-content);">Community</h3>
                <ul class="space-y-3">
                    {#each socialLinks as link}
                        <li>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn-nav"
                                style="color: var(--color-muted); --tw-text-opacity: 1;"                            >
                                <span>{link.name}</span>
                                
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>

            <nav class="col-span-1" aria-labelledby="legal-heading">
                <h3 id="legal-heading" class="text-lg font-semibold mb-4" style="color: var(--color-base-content);">Legal</h3>
                <ul class="space-y-3">
                    {#each legalLinks as link}
                        <li>
                            <a
                                href={link.href}
                                class="btn-nav"
                                style="color: var(--color-muted); --tw-text-opacity: 1;"
                            >
                                {link.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </div>

        <div class="border-t pt-8 mt-12 text-center" style="border-color: var(--color-muted);">
            <p class="text-sm" style="color: var(--color-muted);">
                Crafted with ❤️ by the VirarithMC Team.
            </p>
        </div>
    </div>
</footer>