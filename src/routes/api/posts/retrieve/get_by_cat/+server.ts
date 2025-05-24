import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { and, count, eq } from 'drizzle-orm';



export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');

        const pageParam = url.searchParams.get('page');
        const postPageLimit = 25;
        const page = Number(pageParam)

        const offset = (page - 1) * postPageLimit;



        if (isNaN(page) || page < 1) {
            throw new Error("Failed to get page paramter for pagination.")
        }

        if(!category) {
            throw new Error("A category must be passed to fetch by categorys")
        }


        /**
         * @params category
         * @returns posts filtered by is_deleted and category
         */
        const postData = await DrizzleDB.query.posts.findMany({
            where: (posts, { eq }) => and(
                eq(posts.topic, category),
                eq(posts.isDeleted, false)
            ),
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