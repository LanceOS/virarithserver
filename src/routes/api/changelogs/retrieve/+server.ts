import { DrizzleDB } from '$lib/Drizzle.ts';
import { and } from 'drizzle-orm';



export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get('topic');
        let postData;

        /**
         * @params topic
         * @returns posts filtered by is_deleted and topic
         */
        if (topic) {
            postData = await DrizzleDB.query.posts.findMany({
                where: (posts, { eq }) => and(
                    eq(posts.topic, topic),
                    eq(posts.isDeleted, false)
                ),
                with: {
                    user: true
                }
            });
        }
        /**
         * @returns all posts with a user
         */
        else {
            postData = await DrizzleDB.query.posts.findMany({
                where: (posts, { eq }) => eq(posts.isDeleted, true),
                with: {
                    user: true
                }
            });
        }

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