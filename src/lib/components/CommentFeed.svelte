<script lang="ts">
	const { comments } = $props();
</script>

{#snippet Comments(data)}
	<div>
        
    </div>
{/snippet}

<section>
	{@render Comments(comments)}
</section>
