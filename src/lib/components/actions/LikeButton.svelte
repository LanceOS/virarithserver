<script lang="ts">
	import LikeClient from '$lib/client/tools/LikeClient.client.ts';
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

		const newObject = {
			senderId: user.id,
			receiverId: object.user.id,
			objectId: object.id,
			objectType: object.type
		};
		try {
			if (wasLiked) {
				await LikeClient.unlikeObject(newObject);
			} else {
				await LikeClient.likeObject(newObject);
			}
		} catch (error) {
			errorLog = 'Failed to like post';
		} finally {
			object = {
				...object,
				isLiked: !wasLiked,
				likeCount: wasLiked ? object.likeCount - 1 : object.likeCount + 1
			};

			if (object.isLiked) {
				setTimeout(() => {
					sendingLike = false;
				}, 1500);
			}
            else {
                sendingLike = false;
            }
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
		class="stat-icon"
		style={`color: ${object.isLiked ? 'var(--color-primary)' : 'var(--color-muted)'};`}
	/>
	<span class="text-sm font-medium" style="color: var(--color-base-content);">
		{sendingLike ? "Liking..." : `${object.likeCount || 0} Likes`}
	</span>
</button>
