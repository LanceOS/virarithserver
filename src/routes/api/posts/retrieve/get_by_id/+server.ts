import { DrizzleDB } from '$lib/Drizzle.ts';
import { and, sql } from 'drizzle-orm';


export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url)
        const postId = url.searchParams.get("postId");

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
                    SELECT COUNT(*) 
                    FROM likes 
                    WHERE likes.post_id = posts.id
                )`.as('like_count'),
                commentCount: sql<number>`(
                    SELECT COUNT(*) 
                    FROM comment 
                    WHERE comment.post_id = posts.id
                )`.as('comment_count')
            },
            with: {
                user: true,
            },
        })

        return new Response(JSON.stringify(post), {
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