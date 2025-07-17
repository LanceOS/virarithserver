import type { ImageWithUrl } from '$lib/@types/IImage.ts';
import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import ImageService from '$lib/server/ImageService.ts';
import { isPostLikedSubquery, isPostReportedSubquery } from '$lib/subqueries/PostsQueries.ts';
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
			return new Response(JSON.stringify({ error: 'Missing required post id for retrieval!' }), {
				status: 400,
				statusText: 'BAD REQUEST'
			});
		}

		/**
		 * @params postId
		 * @returns Grabs a specific post based on its Id
		 */
		const post = await DrizzleDB.query.posts.findFirst({
			where: (posts, { eq }) => and(eq(posts.id, postId), eq(posts.isDeleted, false)),
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
				isLiked: isPostLikedSubquery(userId).as('is_liked'),
				isReported: isPostReportedSubquery(userId).as('is_reported')
			},
			with: {
				user: true
			}
		});

		if (!post) {
			return new Response(JSON.stringify({ error: 'Failed to find post!' }), {
				status: 404,
				statusText: 'UNAVAILABLE'
			});
		}

		const images: ImageWithUrl[] = await ImageService.getS3Objects(post);
		const conformedPostData: PostWithImage | PostWithImage[] =
			Generalizer.serializedPostDataAndAlignImages(post, images);

		return new Response(JSON.stringify(conformedPostData), {
			status: 200,
			statusText: 'OK',
			headers: {
				'Content-Type': 'application/json'
			}
		});
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
