<script lang="ts">
	import LikeClient from '$lib/tools/LikeClient.ts';
	import Icon from '@iconify/svelte';
	import ErrorModal from '../popups/ErrorModal.svelte';
	import { authClient } from '$lib/auth-client.ts';

	const session = authClient.useSession();

	let { object } = $props();

	let errorLog = $state('');
	let sendingLike = $state(false);

	const likePost = async (id: string) => {
		if (!$session.data?.user) {
			setError();
			return;
		}

		const user = $session.data.user;
		sendingLike = true;
		let wasLiked: boolean = object.isLiked;

		try {
			if (wasLiked) {
				await LikeClient.unlikeObject({ userId: user.id, objectId: object.id, objectType: object.type });
			} else {
				await LikeClient.likeObject({ userId: user.id, objectId: object.id, objectType: object.type });
			}

			object = {
				...object,
				isLiked: !wasLiked,
				likeCount: wasLiked ? object.likeCount - 1 : object.likeCount + 1
			};
		} catch (error) {
			errorLog = 'Failed to like post';
		} finally {
			sendingLike = false;
		}
	};

	const setError = () => {
		errorLog = 'Must log in to like.';
		sendingLike = true;
		setTimeout(() => {
			errorLog = '';
			sendingLike = false;
		}, 2000);
	};
</script>

{#if errorLog}
	<ErrorModal {errorLog} />
{/if}

<button
    class="stat-item"
    onclick={() => likePost(object.id)}
    disabled={sendingLike}
    aria-label={object.isLiked ? 'Unlike' : 'Like'}
>
    <Icon
        icon="material-symbols:thumb-up"
        class={`stat-icon ${object.isLiked ? "content" : ""}`}
    />
    <span class=" lg:text-sm font-medium">
        {object.likeCount || 0} Likes
    </span>
</button>