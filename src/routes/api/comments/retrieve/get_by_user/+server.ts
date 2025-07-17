import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { isCommentLikedSubquery, replyCountSubquery } from '$lib/subqueries/CommentQueries.query.ts';
import { and, count, eq, sql } from 'drizzle-orm';
import { postPageLimit } from '../../../../../lib/retrieval.config.ts';
import { comments } from '$lib/schemas/Comments.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import { isCommentReportedSubquery } from '$lib/subqueries/CommentQueries.query.ts';

export const GET = async ({ request }): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const userIdParam = url.searchParams.get('userId');
		const pageParam = url.searchParams.get('page');

		const session = await auth.api.getSession({
			headers: request.headers
		});
		const userId: string | null = session?.user.id || null;

		if (!userIdParam) {
			return new Response(JSON.stringify({ error: 'Missing user ID for comment retrieval' }), {
				status: 400,
				statusText: 'BAD REQUEST'
			});
		}

		const page = Number(pageParam);
		const offset = (page - 1) * postPageLimit;

		if (isNaN(page) || page < 1) {
			return new Response(
				JSON.stringify({ error: 'Failed to get page parameter for pagination.' }),
				{
					status: 400,
					statusText: 'BAD REQUEST'
				}
			);
		}

		/**
		 * @params userId
		 * @returns Grabs a specific comments based on userId
		 */
		const commentData = await DrizzleDB.query.comments.findMany({
			where: (comments, { eq }) =>
				and(eq(comments.isDeleted, false), eq(comments.userId, userIdParam)),
			extras: {
				likeCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM likes 
                    WHERE likes.object_id = comments.id
                )`.as('like_count'),
				isLiked: isCommentLikedSubquery(userId).as('is_liked'),
				isReported: isCommentReportedSubquery(userId).as('is_reported'),
				replyCount: replyCountSubquery(null)
			},
			with: {
				user: true
			},
			limit: postPageLimit,
			offset: offset,
			orderBy: (comments, { desc }) => [desc(comments.createdAt)]
		});

		/**
		 * Getting the total number of comments from the database.
		 * This is so that way the number of pages for pagination can
		 * be calculated.
		 */
		const [{ count: totalCount }] = await DrizzleDB.select({ count: count() })
			.from(comments)
			.where(and(eq(comments.isDeleted, false), eq(comments.userId, userIdParam)));

		const totalPages = Math.ceil(Number(totalCount) / postPageLimit);

		/**
		 * @returns Serializes comments
		 */
		const serializeData = commentData.map(Generalizer.serializeComment);

		return new Response(
			JSON.stringify({
				comments: serializeData,
				pagination: {
					currentPage: page,
					totalPages: totalPages,
					hasNext: page < totalPages,
					hasPrevious: page > 1
				}
			}),
			{
				status: 200,
				statusText: 'OK',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error: unknown) {
		return new Response(JSON.stringify(error), {
			status: 500,
			statusText: 'FAIL',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
