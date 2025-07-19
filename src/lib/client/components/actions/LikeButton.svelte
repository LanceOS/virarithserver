<script lang="ts">
	import LikeClient from '$lib/client/tools/LikeClient.client.ts';
	import Icon from '@iconify/svelte';
	import { authClient } from '$lib/auth-client.ts';
	import { toast } from '@zerodevx/svelte-toast';

	const session = authClient.useSession();

	let { object } = $props();

	let sendingLike = $state(false);

	const likePost = async (id: string) => {
		if (!$session.data?.user) {
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
		} catch (error: any) {
			toast.push(error.message);
		} finally {
			object = {
				...object,
				isLiked: !wasLiked,
				likeCount: wasLiked ? object.likeCount - 1 : object.likeCount + 1
			};

			sendingLike = false;
		}
	};
</script>

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
		{sendingLike ? 'Liking...' : `${object.likeCount || 0} Likes`}
	</span>
</button>
