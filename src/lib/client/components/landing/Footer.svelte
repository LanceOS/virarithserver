<script lang="ts">
	const quickLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'Rules', href: '/pages/rules' },
		{ name: 'Vote', href: '/pages/vote' }
	];

	const legalLinks = [{ name: 'Terms of Service', href: '/pages/legal/tos' }, { name: 'Privacy Policy', href: '/pages/legal/privacy' }];

	const socialLinks = [
		{ name: 'Discord', href: 'https://discord.gg/EHeUmvuV', icon: 'ic:baseline-discord' }
	];
</script>

<footer class="bg-[var(--color-card)] mt-16 py-12">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-10 text-center md:grid-cols-4 md:text-left lg:grid-cols-5">
			<div
				class="col-span-1 flex flex-col items-center gap-3 md:col-span-2 md:items-start lg:col-span-2"
			>
				<p class="text-2xl font-bold" style="color: var(--color-base-content);">VirarithMC</p>
				<p class="text-sm" style="color: var(--color-muted);">
					&copy; {new Date().getFullYear()} VirarithMC. All rights reserved.
				</p>
				<p class="mt-2 text-sm" style="color: var(--color-muted);">
					A vibrant community for Minecraft enthusiasts. Join us for an unforgettable gaming
					experience!
				</p>
			</div>

			<nav class="col-span-1" aria-labelledby="quick-links-heading">
				<h3
					id="quick-links-heading"
					class="mb-4 text-lg font-semibold"
					style="color: var(--color-base-content);"
				>
					Quick Links
				</h3>
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
				<h3
					id="community-heading"
					class="mb-4 text-lg font-semibold"
					style="color: var(--color-base-content);"
				>
					Community
				</h3>
				<ul class="space-y-3">
					{#each socialLinks as link}
						<li>
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="btn-nav"
								style="color: var(--color-muted); --tw-text-opacity: 1;"
							>
								<span>{link.name}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<nav class="col-span-1" aria-labelledby="legal-heading">
				<h3
					id="legal-heading"
					class="mb-4 text-lg font-semibold"
					style="color: var(--color-base-content);"
				>
					Legal
				</h3>
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
	</div>
</footer>
