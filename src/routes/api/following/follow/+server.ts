import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { followers } from '$lib/schemas/Followers.ts';
import NotificationService from '$lib/server/NotificationService.ts';


export const POST = async ({ request }) => {
    try {
        const profile = await request.json();

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session?.user) {
            return new Response(JSON.stringify({ error: "User must be logged in!"}), {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        }

        const user = session.user

        if(!profile.objectId) {
            return new Response(JSON.stringify({ error: "Missing required object information for request!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const objectDetails = {
            senderId: user.id,
            receiverId: profile.receiverId,
            objectId: profile.objectId,
            objectType: "profile"
        }

        const newFollower = await DrizzleDB.insert(followers).values(objectDetails).returning();
        const notification = await NotificationService.generateUserNotification(objectDetails);

        return new Response(JSON.stringify({
            notification: notification,
            followers: newFollower
        }), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch(error) {
        console.error(error)
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}