import { DrizzleDB } from '$lib/Drizzle.ts';
import { and } from 'drizzle-orm';



export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');

        /**
         * @params category
         * @returns posts filtered by is_deleted and category
         */
        const postData = await DrizzleDB.query.posts.findMany({
            where: (posts, { eq }) => and(
                eq(posts.category, category),
                eq(posts.isDeleted, false)
            ),
            with: {
                user: true
            }
        });

        return new Response(JSON.stringify(postData), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error) {
        return new Response(JSON.stringify(error), {
            status: 404,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}