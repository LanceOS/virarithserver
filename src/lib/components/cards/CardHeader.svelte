<script lang="ts">
	let { data } = $props();

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<header
	class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4"
>
	<div class="flex flex-wrap items-center gap-4">
		{#if data.user.image && data.user.image !== 'placeholder'}
			<div class="user-avatar flex-shrink-0">
				<img
					src={data.user.image}
					alt={data.user.name || 'User avatar'}
					class="h-10 w-10 rounded-full object-cover"
				/>
			</div>
		{/if}
		<div class="flex flex-col leading-tight">
			<a
				class="btn-nav text-base font-semibold"
				style="color: var(--color-base-content)"
				href={`/pages/profile/${data.user.id}`}
			>
				{data.user.name}
			</a>
			<time class="text-sm font-light" datetime={data.createdAt} style="color: var(--color-muted);">
				{formatDate(data.createdAt)}
			</time>
		</div>

		<div class="mt-1 flex items-center gap-2 sm:mt-0">
			{#if data.user.role === 'developer'}
				<div class="role-card rounded bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800">
					<p>Developer</p>
				</div>
			{:else if data.user.role === 'admin'}
				<div class="role-card rounded bg-red-200 px-2 py-0.5 text-xs font-medium text-red-800">
					<p>Admin</p>
				</div>
			{:else if data.user.role === 'moderator'}
				<div class="role-card rounded bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800">
					<p>Moderator</p>
				</div>
			{/if}
			{#if data.isEdited}
				<p class="text-xs" style="color: var(--color-muted);">(edited)</p>
			{/if}
		</div>
	</div>
	<span class="mt-2 flex-shrink-0 text-sm font-medium sm:mt-0" style="color: var(--color-muted);">
		{data.category.toUpperCase()}
	</span>
</header>
