<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import LikeButton from '../actions/LikeButton.svelte';

	let { comments } = $props();
</script>


<section class="flex flex-col gap-4">
	<h4 class="text-xl">Comments</h4>
	{#each comments as comment (comment.id)}
		<div class="card-setup flex flex-col gap-2 p-6">
			<div class="flex justify-between items-center">
				<button
					class="text-md btn-nav w-fit font-semibold"
					onclick={() => goto(`/pages/profile/${comment.user.id}`)}>{comment.user.name}</button
				>
				<button class="stat-item">
					<Icon icon="ic:outline-more-vert" class="text-xl duration-200 sm:text-xl" />
				</button>
			</div>

			<p>
				{@html comment.content}
			</p>

			<div class="flex justify-between">
				<div class="flex items-center gap-4">
					<LikeButton object={comment}/>
				</div>
			</div>
		</div>
	{/each}
</section>
