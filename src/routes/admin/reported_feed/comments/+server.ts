import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { postPageLimit } from '$lib/retrieval.config.ts';
import { posts } from '$lib/server/schemas/Posts.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import { orderBySort } from '$lib/server/subqueries/PostsQueries.query.ts';
import { eq } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { and } from 'drizzle-orm';

export const GET = async ({ request }): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const pageParam = url.searchParams.get('page');
		const orderBy = url.searchParams.get('orderBy');
		const usernameParam = url.searchParams.get('username');

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user || session.user.role === 'user') {
			return new Response('User must be logged in or an administrator to see reported posts.');
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
		let commentData;

		if (usernameParam) {
			const searchedUser = await DrizzleDB.query.user.findFirst({
				where: (user, { eq }) => eq(user.name, usernameParam)
			});

			if (!searchedUser) {
				return new Response(JSON.stringify({ error: 'Failed to find user' }), {
					status: 404
				});
			}

			commentData = await DrizzleDB.query.comments.findMany({
				where: (comments, { eq }) =>
					and(
						eq(comments.isDeleted, true),
						eq(comments.isFlagged, true),
						eq(comments.userId, searchedUser.id)
					),
				with: {
					user: true
				},
				limit: postPageLimit,
				offset: offset,
				orderBy: orderBySort(orderBy)
			});
		} else {
			commentData = await DrizzleDB.query.comments.findMany({
				where: (comments, { eq }) =>
					and(eq(comments.isDeleted, true), eq(comments.isFlagged, true)),
				with: {
					user: true
				},
				limit: postPageLimit,
				offset: offset,
				orderBy: orderBySort(orderBy)
			});
		}

		/**
		 * Getting the total number of comments from the database.
		 * This is so that way the number of pages for pagination can
		 * be calculated.
		 */
		const [{ count: totalCount }] = await DrizzleDB.select({ count: count() })
			.from(posts)
			.where(and(eq(posts.isDeleted, true), eq(posts.isFlagged, true)));

		const totalPages = Math.ceil(Number(totalCount) / postPageLimit);

		const serializeData = commentData.map(Generalizer.serializeComment);

		return new Response(
			JSON.stringify({
				posts: serializeData,
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
