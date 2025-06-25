<script lang="ts">
    import Icon from "@iconify/svelte";
</script>

<footer class="bg-card py-8 mt-12">
    <div class="mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
        <div class="flex flex-col items-center md:items-start gap-2">
            <p class="text-lg font-semibold" style="color: var(--color-base-content);">VirarithMC</p>
            <p class="text-sm" style="color: var(--color-muted);">&copy; {new Date().getFullYear()} VirarithMC. All rights reserved.</p>
        </div>

        <div class="flex flex-col gap-2">
            <h4 class="text-lg font-semibold mb-1" style="color: var(--color-base-content);">Quick Links</h4>
            <a href="/" class="btn-nav text-sm transition-colors hover:text-[var(--color-primary)]">Home</a>
            <a href="/pages/rules" class="btn-nav text-sm transition-colors hover:text-[var(--color-primary)]">Rules</a>
            <a href="/pages/vote" class="btn-nav text-sm transition-colors hover:text-[var(--color-primary)]">Vote</a>
            </div>

        <div class="flex flex-col gap-2">
            <h4 class="text-lg font-semibold mb-1" style="color: var(--color-base-content);">Community</h4>
            <a href="YOUR_DISCORD_INVITE_LINK" target="_blank" rel="noopener noreferrer" class="btn-nav flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-primary)]">
                <Icon icon="ic:baseline-discord" class="iconify" />
                Discord
            </a>
            </div>

        <div class="flex flex-col gap-2">
            <h4 class="text-lg font-semibold mb-1" style="color: var(--color-base-content);">Legal</h4>
            <a href="/pages/terms-of-service" class="btn-nav text-sm transition-colors hover:text-[var(--color-primary)]">Terms of Service</a>
        </div>
    </div>
</footer>