<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import AOS from 'aos';
	import 'aos/dist/aos.css'; 

	let { children } = $props();

	onMount(() => {
		AOS.init({
			duration: 400,
			easing: "ease"
		});
	})
</script>

{@render children()}
