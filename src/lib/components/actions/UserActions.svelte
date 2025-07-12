<script lang="ts">
	let { warning, cancelAction } = $props();
</script>

<div class="absolute z-20 flex h-full w-full items-center justify-center p-4">
	<div class="bg-base border-muted w-full space-y-6 p-12 text-center sm:w-3/4">
		<h2 class="text-error text-6xl">WARNING</h2>
		<p class="text-2xl">{warning}</p>

		<div class="flex items-center gap-4 justify-center">
			<button type="button" class="btn-small" onclick={cancelAction}>CANCEL ACTION</button>
			<button type="button" class="btn-delete">CONFIRM ACTION</button>
		</div>
	</div>
</div>
