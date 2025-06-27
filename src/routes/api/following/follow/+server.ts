import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import NotificationService from '$lib/server/NotificationService.ts';


export const POST = async ({ request }) => {
    try {
        const body = await request.json();

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session?.user) {
            throw new Error("Must be logged in to like.")
        }

        const user = session.user

        if(!body.objectId || !body.objectType) {
            throw new Error("Failed to data to like object")
        }

        const notification = await NotificationService.generateUserNotification(body);
        const response = await DrizzleDB.insert(followers).values({ userId: user.id, objectId: body.objectId, objectType: body.objectType }).returning();

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