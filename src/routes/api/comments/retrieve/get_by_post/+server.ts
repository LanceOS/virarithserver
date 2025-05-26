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
         * @returns Grabs a specific comments based on postId
         */
        const comments = await DrizzleDB.query.comments.findMany({
            where: (comments, { eq }) => and(eq(comments.isDeleted, false), eq(comments.postId, postId)),
            extras: {
                likeCount: sql<number>`(
                    SELECT COUNT(*) 
                    FROM likes 
                    WHERE likes.comment_id = comments.id
                )`.as('like_count'),
            },
            with: {
                user: true,
            },
            orderBy: (comments, { asc }) => [asc(comments.createdAt)]
        })

        return new Response(JSON.stringify(comments), {
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