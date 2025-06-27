<script lang="ts">
	import Header from "$lib/components/landing/Header.svelte";
	import type { PageData } from "./$types.js";

	const { data } = $props<{ data: PageData }>();

	console.log(data.notifications)
</script>

<Header />
<main>

</main>