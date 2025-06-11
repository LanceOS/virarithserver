import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { serializeComment } from '$lib/serializers/CommentSerializer.ts';
import { replyCountSubquery } from '$lib/subqueries/CommentQueries.ts';
import { isLikedSubquery } from '$lib/subqueries/PostsQueries.ts';
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
                isLiked: isLikedSubquery(userId).as('is_liked'),
                replyCount: replyCountSubquery(postId),
            },
            with: {
                user: true,
            },
            orderBy: (comments, { desc }) => [desc(comments.createdAt)]
        })

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