import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import PostSerializer from '$lib/serializers/PostSerializer.ts';
import { isLikedSubquery } from '$lib/subqueries/PostsQueries.ts';
import ImageClient from '$lib/tools/ImageClient.ts';
import { and, sql } from 'drizzle-orm';


export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url)
        const postId = url.searchParams.get("postId");

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;



        if (!postId) {
            throw new Error("Must pass a postId to fetch specific post")
        }

        /**
         * @params postId
         * @returns Grabs a specific post based on its Id 
         */
        const post = await DrizzleDB.query.posts.findFirst({
            where: (posts, { eq }) => and(
                eq(posts.id, postId),
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
        })

        if(!post) {
            throw new Error("Failed to find post")
        }

        const images = await ImageClient.getS3Objects(post);
        const conformedPostData = PostSerializer.serializedPostDataAndAlignImages(post, images)

        return new Response(JSON.stringify(conformedPostData), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error: any) {
        return new Response(JSON.stringify(error.message), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}