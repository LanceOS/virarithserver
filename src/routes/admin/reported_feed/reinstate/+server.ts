import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { commentReply } from '$lib/server/schemas/CommentReply.ts';
import { comments } from '$lib/server/schemas/Comments.ts';
import { posts } from '$lib/server/schemas/Posts.ts';
import { and, eq } from 'drizzle-orm';

export const PUT = async ({ request }): Promise<Response> => {
	try {
		const body = await request.json();

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			return new Response(
				JSON.stringify({ error: 'Administrator must be signed in to reinstate posts' }),
				{
					status: 403,
					statusText: 'UNAUTHORIZED',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		switch (body.objectType) {
			case 'post':
				await DrizzleDB.update(posts)
					.set({ isFlagged: false, isDeleted: false })
					.where(and(eq(posts.id, body.objectId), eq(posts.type, body.objectType)))
					.execute();
				break;

			case 'comment':
				await DrizzleDB.update(comments)
					.set({ isFlagged: false, isDeleted: false })
					.where(and(eq(comments.id, body.objectId), eq(comments.type, body.objectType)));
				break;
			case 'commentReply':
				await DrizzleDB.update(commentReply)
					.set({ isFlagged: false, isDeleted: false })
					.where(and(eq(commentReply.id, body.objectId), eq(commentReply.type, body.objectType)));
				break;
			default:
				// Optional: Handle cases where objectType is neither 'post' nor 'comment'
				console.log(`Unhandled object type: ${body.objectType}`);
				break;
		}

		return new Response('', {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			statusText: 'FAIL',
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
