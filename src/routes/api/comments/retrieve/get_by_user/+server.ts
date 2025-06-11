import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { serializeComment } from '$lib/serializers/CommentSerializer.ts';
import { replyCountSubquery } from '$lib/subqueries/CommentQueries.ts';
import { isLikedSubquery } from '$lib/subqueries/PostsQueries.ts';
import { and, sql } from 'drizzle-orm';


export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url)
        const userIdParam = url.searchParams.get("userId")

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        if (!userIdParam) {
            throw new Error("Must pass a postId to fetch specific post")
        }

        /**
         * @params userId
         * @returns Grabs a specific comments based on userId
         */
        const comments = await DrizzleDB.query.comments.findMany({
            where: (comments, { eq }) => and(eq(comments.isDeleted, false), eq(comments.userId, userIdParam)),
            extras: {
                likeCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM likes 
                    WHERE likes.comment_id = comments.id
                )`.as('like_count'),
                isLiked: isLikedSubquery(userId).as('is_liked'),
                replyCount: replyCountSubquery(null)
            },
            with: {
                user: true,
            },
            orderBy: (comments, { desc }) => [desc(comments.createdAt)]
        })

        /**
         * @returns Serializes comments
         */
        const serializeData = comments.map(serializeComment)

        return new Response(JSON.stringify(serializeData), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error: unknown) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}