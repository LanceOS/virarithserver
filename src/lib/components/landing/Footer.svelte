<script lang="ts">
	import Icon from "@iconify/svelte";


</script>

<footer class="bg-card py-8 mt-12">
    <div class="mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
        <div class="flex flex-col items-center md:items-start gap-2">
            <p class="content text-lg font-semibold">VirarithMC</p>
            <p class="muted text-sm">&copy; {new Date().getFullYear()} VirarithMC. All rights reserved.</p>
        </div>

        <div class="flex flex-col gap-2">
            <h4 class="content text-lg font-semibold mb-1">Quick Links</h4>
            <a href="/" class="btn-nav text-sm hover:text-primary-light transition-colors">Home</a>
            <a href="/pages/rules" class="btn-nav text-sm hover:text-primary-light transition-colors">Rules</a>
            <a href="/pages/vote" class="btn-nav text-sm hover:text-primary-light transition-colors">Vote</a>
            </div>

        <div class="flex flex-col gap-2">
            <h4 class="content text-lg font-semibold mb-1">Community</h4>
            <a href="YOUR_DISCORD_INVITE_LINK" target="_blank" rel="noopener noreferrer" class="btn-nav flex items-center justify-center md:justify-start gap-2 text-sm hover:text-primary-light transition-colors">
                <Icon icon="ic:baseline-discord" class="h-5 w-5" />
                Discord
            </a>
            </div>

        <div class="flex flex-col gap-2">
            <h4 class="content text-lg font-semibold mb-1">Legal</h4>
            <a href="/pages/privacy-policy" class="btn-nav text-sm hover:text-primary-light transition-colors">Privacy Policy</a>
            <a href="/pages/terms-of-service" class="btn-nav text-sm hover:text-primary-light transition-colors">Terms of Service</a>
        </div>
    </div>
</footer>