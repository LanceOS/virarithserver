import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { and, count, eq, sql } from 'drizzle-orm';
import { postPageLimit } from '../retrieval.config.ts';
import { auth } from '$lib/auth.ts';
import PostSerializer from '$lib/serializers/PostSerializer.ts';
import { isLikedSubquery } from '$lib/subqueries/PostsQueries.ts';
import ImageService from '$lib/server/ImageService.ts';




export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const userIdParam = url.searchParams.get('userId');
        const pageParam = url.searchParams.get('page');

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        console.log(userId)


        const page = Number(pageParam)

        const offset = (page - 1) * postPageLimit;


        if (isNaN(page) || page < 1) {
            throw new Error("Failed to get page paramter for pagination.")
        }

        if (!userIdParam) {
            throw new Error("A user must be passed to fetch by users")
        }



        /**
         * @params userId
         * @returns Returns posts based on the userId, this is for fetch posts based on user profile
         */
        const postData = await DrizzleDB.query.posts.findMany({
            where: (posts, { eq }) => and(
                eq(posts.userId, userIdParam),
                eq(posts.isDeleted, false)
            ),
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
                isLiked: isLikedSubquery(userId).as('is_liked')
            },
            with: {
                user: true,
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
        const [{ count: totalCount }] = await DrizzleDB
            .select({ count: count() })
            .from(posts)
            .where(and(eq(posts.isDeleted, false), eq(posts.userId, userIdParam)));

        const totalPages = Math.ceil(Number(totalCount) / postPageLimit);
        
        const images = await ImageService.getS3Objects(postData);
        const conformedPostData = PostSerializer.serializedPostDataAndAlignImages(postData, images);
        
        return new Response(JSON.stringify({
            posts: conformedPostData,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrevious: page > 1
            }
        }), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error: any) {
        return new Response(JSON.stringify(error.message), {
            status: 404,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}