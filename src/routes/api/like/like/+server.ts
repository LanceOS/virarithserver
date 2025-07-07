import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts'
import { likes } from '$lib/schemas/Likes.ts';
import NotificationService from '$lib/server/NotificationService.ts';


export const POST = async ({ request }) => {
    try {
        const body = await request.json();

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "User must be logged in!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const user = session.user

        if (!body.objectId || !body.objectType) {
            return new Response(JSON.stringify({ error: "Missing required object information for request!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }
        const notification = await NotificationService.generateUserNotification(body);
        const response = await DrizzleDB.insert(likes).values({ userId: user.id, objectId: body.objectId, objectType: body.objectType }).returning();

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