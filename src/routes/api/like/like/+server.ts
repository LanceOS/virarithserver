import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts'
import { likes } from '$lib/schemas/Likes.ts';
import UserService from '$lib/server/UserService.ts';


export const POST = async ({ request }) => {
    try {
        const body = await request.json();

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session?.user) {
            throw new Error("Must be logged in to like.")
        }

        if(!body.objectId || !body.objectType) {
            throw new Error("Failed to data to like object")
        }

        const notification = await UserService.generateUserNotification(body)
        const response = await DrizzleDB.insert(likes).values(body).returning();

        return new Response(JSON.stringify({
            notification: notification,
            like: response
        }), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        });
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