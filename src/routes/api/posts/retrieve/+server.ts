import { DrizzleDB } from '$lib/Drizzle.ts';
import { and } from 'drizzle-orm';



export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get('topic');
        const userId = url.searchParams.get('userId');

        const pageParam = url.searchParams.get('page');
        const postPageLimit = 25;
        const page = Number(pageParam)

        const offset = (page - 1) * postPageLimit;


        let postData;


        if(isNaN(page) || page < 1) {
            throw new Error("Failed to get page paramter for pagination.")
        }


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
                },
                limit: postPageLimit,
                offset: offset,
                orderBy: (posts, { desc }) => [desc(posts.createdAt)]
            });
        }
        /**
         * @params userId
         * @returns Returns posts based on the userId, this is for fetch posts based on user profile
         */
        else if(userId) {
            postData = await DrizzleDB.query.posts.findMany({
                where: (posts, { eq }) => and(
                    eq(posts.user_id, userId),
                    eq(posts.isDeleted, false)
                ),
                with: {
                    user: true
                },
                limit: postPageLimit,
                offset: offset,
                orderBy: (posts, { desc }) => [desc(posts.createdAt)]
            });
        }
        /**
         * @returns all posts with a user
         */
        else {
            postData = await DrizzleDB.query.posts.findMany({
                where: (posts, { eq }) => eq(posts.isDeleted, false),
                with: {
                    user: true
                },
                limit: postPageLimit,
                offset: offset,
                orderBy: (posts, { desc }) => [desc(posts.createdAt)]
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
    catch(error: any) {
        return new Response(JSON.stringify(error.message), {
            status: 404,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}