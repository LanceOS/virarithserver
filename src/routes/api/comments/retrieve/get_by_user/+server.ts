import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { serializeComment } from '$lib/serializers/CommentSerializer.ts';
import { replyCountSubquery } from '$lib/subqueries/CommentQueries.ts';
import { isLikedSubquery } from '$lib/subqueries/PostsQueries.ts';
import { and, count, eq, sql } from 'drizzle-orm';
import { postPageLimit } from '../../../posts/retrieve/retrieval.config.ts';
import { comments } from '$lib/schemas/Comments.ts';


export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url)
        const userIdParam = url.searchParams.get("userId")
        const pageParam = url.searchParams.get("page")

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        if (!userIdParam) {
            throw new Error("Must pass a postId to fetch specific post")
        }

        const page = Number(pageParam)
        const offset = (page - 1) * postPageLimit;

        /**
         * @params userId
         * @returns Grabs a specific comments based on userId
         */
        const commentData = await DrizzleDB.query.comments.findMany({
            where: (comments, { eq }) => and(eq(comments.isDeleted, false), eq(comments.userId, userIdParam)),
            extras: {
                likeCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM likes 
                    WHERE likes.object_id = comments.id
                )`.as('like_count'),
                isLiked: isLikedSubquery(userId).as('is_liked'),
                replyCount: replyCountSubquery(null)
            },
            with: {
                user: true,
            },
            limit: postPageLimit,
            offset: offset,
            orderBy: (comments, { desc }) => [desc(comments.createdAt)]
        })


        /**
         * Getting the total number of comments from the database.
         * This is so that way the number of pages for pagination can
         * be calculated.
        */
       const [{ count: totalCount }] = await DrizzleDB
            .select({ count: count() })
            .from(comments)
            .where(and(eq(comments.isDeleted, false), eq(comments.userId, userIdParam)));

        const totalPages = Math.ceil(Number(totalCount) / postPageLimit);

        /**
         * @returns Serializes comments
         */
        const serializeData = commentData.map(serializeComment)


        return new Response(JSON.stringify({
            comments: serializeData,
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