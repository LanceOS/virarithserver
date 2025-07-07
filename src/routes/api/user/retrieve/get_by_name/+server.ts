import { DrizzleDB } from '$lib/Drizzle.ts';

export const GET = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const userNameParam = url.searchParams.get("name");

        if(!userNameParam) {
            return new Response(JSON.stringify({ error: "A user's name must be provided for search!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const foundUser = await DrizzleDB.query.user.findFirst({
            where: (user, { eq }) => eq(user.name, userNameParam)
        })

        if(!foundUser) {
            return new Response(JSON.stringify({ error: "Failed to find user with that username!" }), {
                status: 404,
                statusText: "UNAVAILABLE",
            })
        }

        return new Response(JSON.stringify(foundUser), {
            status: 200,
            statusText: "OK",
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