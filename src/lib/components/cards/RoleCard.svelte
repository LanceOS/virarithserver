<script lang="ts">
	const { role } = $props();
</script>

{#if role === 'developer'}
	<div class="role-card">
		<p>Developer</p>
	</div>
{:else if role === 'admin'}
	<div class="role-card">
		<p>Admin</p>
	</div>
{:else if role === 'moderator'}
	<div class="role-card">
		<p>Moderator</p>
	</div>
{:else if role === 'founder'}
	<div class="role-card">
		<p>Founder</p>
	</div>
{/if}
