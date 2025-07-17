import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import { replyCountSubquery } from '$lib/subqueries/CommentQueries.query.ts';
import { isCommentReportedSubquery } from '$lib/subqueries/CommentQueries.query.ts';
import { isCommentLikedSubquery } from '$lib/subqueries/CommentQueries.query.ts';
import { and, sql } from 'drizzle-orm';

export const GET = async ({ request }): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const postId = url.searchParams.get('postId');

		const session = await auth.api.getSession({
			headers: request.headers
		});
		const userId: string | null = session?.user.id || null;

		if (!postId) {
			return new Response(
				JSON.stringify({ error: 'Missing required object information for request!' }),
				{
					status: 400,
					statusText: 'BAD REQUEST'
				}
			);
		}
		/**
		 * @params postId
		 * @returns Grabs a specific comments based on postId
		 */
		const comments = await DrizzleDB.query.comments.findMany({
			where: (comments, { eq }) => and(eq(comments.isDeleted, false), eq(comments.postId, postId)),
			extras: {
				likeCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM likes 
                    WHERE likes.object_id = comments.id
                    AND likes.object_type = comments.type
                )`.as('like_count'),
				isLiked: isCommentLikedSubquery(userId).as('is_liked'),
				isReported: isCommentReportedSubquery(userId).as('is_reported'),
				replyCount: replyCountSubquery(postId)
			},
			with: {
				user: true
			},
			orderBy: (comments, { desc }) => [desc(comments.createdAt)]
		});

		const serializeData = comments.map(Generalizer.serializeComment);

		return new Response(JSON.stringify(serializeData), {
			status: 200,
			statusText: 'OK',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify(error), {
			status: 500,
			statusText: 'FAIL',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
