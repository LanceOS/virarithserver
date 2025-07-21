import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { user } from '$lib/server/schemas/authentication.ts';
import { banned } from '$lib/server/schemas/Banned.ts';
import { commentReply } from '$lib/server/schemas/CommentReply.ts';
import { comments } from '$lib/server/schemas/Comments.ts';
import { followers } from '$lib/server/schemas/Followers.ts';
import { images } from '$lib/server/schemas/Images.ts';
import { notifications } from '$lib/server/schemas/Notifications.ts';
import { posts } from '$lib/server/schemas/Posts.ts';
import { profile } from '$lib/server/schemas/Profile.ts';
import { and, eq } from 'drizzle-orm';

export const PUT = async ({ request }) => {
	try {
		const userToBan = await request.json();

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user || session.user.role === 'user') {
			return new Response(
				JSON.stringify({ error: 'User must be logged in and have an administrative role!' }),
				{
					status: 403,
					statusText: 'UNAUTHORIZED'
				}
			);
		}

		if (!userToBan.id || !userToBan.email) {
			return new Response(
				JSON.stringify({ error: 'User ID and email are required to ban a user.' }),
				{
					status: 400,
					statusText: 'BAD REQUEST',
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		await DrizzleDB.insert(banned).values({
			email: userToBan.email,
			reason: userToBan.reason
		});

		await DrizzleDB.transaction(async (tx) => {
			await tx.delete(posts).where(eq(posts.userId, userToBan.id)).execute();
			await tx.delete(comments).where(eq(comments.userId, userToBan.id)).execute();
			await tx.delete(commentReply).where(eq(commentReply.userId, userToBan.id)).execute();
			await tx.delete(images).where(eq(images.userId, userToBan.id)).execute();

			await tx.delete(followers).where(eq(followers.senderId, userToBan.id)).execute();
			await tx.delete(notifications).where(eq(notifications.senderId, userToBan.id)).execute();
			await tx.delete(profile).where(eq(profile.userId, userToBan.id)).execute();
			await tx
				.delete(user)
				.where(and(eq(user.id, userToBan.id), eq(user.email, userToBan.email)))
				.execute();
		});
		return new Response(
			JSON.stringify({ message: `User ${userToBan.email} banned successfully.` }),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			statusText: 'FAIL',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
