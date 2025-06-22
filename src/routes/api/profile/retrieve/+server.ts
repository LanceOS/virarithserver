import { DrizzleDB } from '$lib/Drizzle.ts';
import { and } from 'drizzle-orm';


export const GET = async ({ request }): Promise<Response>  => {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if(!userId) {
            throw new Error("User Id must be passed to get profile.")
        }

        const profile = await DrizzleDB.query.profile.findFirst({
            where: (profile, { eq }) => and(eq(profile.isDeleted, false), eq(profile.userId, userId)),
            with: {
                user: true,
            },
        })

        if(!profile) {
            throw new Error(`Failed to get user's profile`)
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