import { DrizzleDB } from '$lib/Drizzle.ts';
import { followers } from '$lib/server/schemas/Followers.ts';
import { eq } from 'drizzle-orm';


export const GET = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if(!userId) {
            return new Response(JSON.stringify({ error: "Missing user ID for follower retrieval" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const following = await DrizzleDB.query.followers.findMany({
            where: eq(followers.senderId, userId),
            with: {
                followedUser: true
            }
        })

        return new Response(JSON.stringify(following), {
            status: 200,
            statusText: "SUCCESS",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch(error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}