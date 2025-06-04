import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { count, eq, sql } from 'drizzle-orm';
import { postPageLimit } from '../retrieval.config.ts';
import { auth } from '$lib/auth.ts';



export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const pageParam = url.searchParams.get('page');
        const orderBy = url.searchParams.get('orderBy')

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;


        const page = Number(pageParam)
        const offset = (page - 1) * postPageLimit;

        if (isNaN(page) || page < 1) {
            throw new Error("Failed to get page paramter for pagination.")
        }

        const orderByClause = () => {
            if (orderBy === "desc") {
                return (posts, { desc }) => [desc(posts.createdAt)]
            }
            else {
                return (posts, { asc }) => [asc(posts.createdAt)]
            }
        }

        /**
         * @returns all posts with a user
         */

        const postData = await DrizzleDB.query.posts.findMany({
            where: (posts, { eq }) => eq(posts.isDeleted, false),
            extras: {
                likeCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM likes 
                    WHERE likes.post_id = posts.id
                )`.as('like_count'),
                commentCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM comments
                    WHERE comments.post_id = posts.id
                )`.as('comment_count'),
                isLiked: sql<boolean>`EXISTS (
                    SELECT 1 FROM likes 
                    WHERE likes.object_id = posts.id
                    AND likes.object_type = 'post' 
                    AND likes.user_id = ${userId}
                )`.as('is_liked')
            },
            with: {
                user: true,
            },
            limit: postPageLimit,
            offset: offset,
            orderBy: orderByClause()
        });


        /**
         * Getting the total number of posts from the database.
         * This is so that way the number of pages for pagination can
         * be calculated.
         */
        const [{ count: totalCount }] = await DrizzleDB
            .select({ count: count() })
            .from(posts)
            .where(eq(posts.isDeleted, false));

        const totalPages = Math.ceil(Number(totalCount) / postPageLimit);

        return new Response(JSON.stringify({
            posts: postData,
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