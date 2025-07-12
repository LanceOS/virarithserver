import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { and, count, eq, sql } from 'drizzle-orm';
import { postPageLimit } from '../retrieval.config.ts';
import { auth } from '$lib/auth.ts';
import { isLikedSubquery } from '$lib/subqueries/PostsQueries.ts';
import ImageService from '$lib/server/ImageService.ts';
import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
import type { ImageWithUrl } from '$lib/@types/IImage.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import { isReportedSubquery } from '$lib/subqueries/PostsQueries.ts';

export const GET = async ({ request }): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const userIdParam = url.searchParams.get('userId');
		const pageParam = url.searchParams.get('page');

		const session = await auth.api.getSession({
			headers: request.headers
		});
		const userId: string | null = session?.user.id || null;

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

		if (!userIdParam) {
			return new Response(JSON.stringify({ error: 'Missing user ID required for retrieval!' }), {
				status: 400,
				statusText: 'BAD REQUEST'
			});
		}

		/**
		 * @params userId
		 * @returns Returns posts based on the userId, this is for fetch posts based on user profile
		 */
		const postData = await DrizzleDB.query.posts.findMany({
			where: (posts, { eq }) => and(eq(posts.userId, userIdParam), eq(posts.isDeleted, false)),
			extras: {
				likeCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM likes 
                    WHERE likes.object_id = posts.id
                )`.as('like_count'),
				commentCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM comments
                    WHERE comments.post_id = posts.id
                    AND comments.is_deleted = false
                )`.as('comment_count'),
				isLiked: isLikedSubquery(userId).as('is_liked'),
				isReported: isReportedSubquery(userId).as('is_reported')
			},
			with: {
				user: true
			},
			limit: postPageLimit,
			offset: offset,
			orderBy: (posts, { desc }) => [desc(posts.createdAt)]
		});

		/**
		 * Getting the total number of posts from the database.
		 * This is so that way the number of pages for pagination can
		 * be calculated.
		 */
		const [{ count: totalCount }] = await DrizzleDB.select({ count: count() })
			.from(posts)
			.where(and(eq(posts.isDeleted, false), eq(posts.userId, userIdParam)));

		const totalPages = Math.ceil(Number(totalCount) / postPageLimit);

		const images: ImageWithUrl[] = await ImageService.getS3Objects(postData);
		const conformedPostData: PostWithImage | PostWithImage[] =
			Generalizer.serializedPostDataAndAlignImages(postData, images);

		return new Response(
			JSON.stringify({
				posts: conformedPostData,
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
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 404,
			statusText: 'FAIL',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
