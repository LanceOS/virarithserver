import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { isFollowing } from '$lib/server/subqueries/FollowQueries.query.ts';
import { and } from 'drizzle-orm';


export const GET = async ({ request }): Promise<Response>  => {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!userId) {
            return new Response(JSON.stringify({ error: "User's ID must be provided for profile search!"}), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const profile = await DrizzleDB.query.profile.findFirst({
            where: (profile, { eq }) => and(eq(profile.isDeleted, false), eq(profile.userId, userId)),
            extras: {
                isFollowed: isFollowing(userId, session?.user.id).as("is_followed")
            },
            with: {
                user: true,
            },
        })

        if(!profile) {
            return new Response(JSON.stringify({ error: "Failed to find user's profile." }), {
                status: 404,
                statusText: "UNAVAILABLE"
            })
        }

        return new Response(JSON.stringify(profile), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}