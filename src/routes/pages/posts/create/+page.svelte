<script lang="ts">
	import { authClient } from "$lib/auth-client.ts";

    let counter = $state(0);
    let body = $state('');

    const session = authClient.useSession()
</script>

<main>
    <form action="#">
        <div class="h-fit flex items-center relative">
			<textarea
				placeholder="What's on your mind?"
				aria-label="Create your post body"
				class={`w-full h-10 focus:outline-0 focus:h-52 ${body.length > 0 && 'h-52'}  transition-all duration-150 leading-normal bg-base-300 rounded-lg py-2 px-6 resize-none overflow-hidden`}
				bind:value={body}
				onfocus={() => (counter = !counter)}
				onfocusout={() => (counter = !counter)}
			>
			</textarea>
			{#if counter}
				<p
					class={`absolute py-2 px-4 self-end ${body.length < 400 ? 'text-info' : 'text-error'} right-0`}
				>
					{body.length}/400
				</p>
			{/if}
		</div>
    </form>
</main>