import { DrizzleDB } from '$lib/Drizzle.ts';
import { likes } from '$lib/schemas/Likes.ts';
import NotificationService from '$lib/server/NotificationServer.server.ts';
import { eq } from 'drizzle-orm';


export const DELETE = async ({ request }) => {
    try {
        const body = await request.json();

        if(!body.objectId || !body.objectType) {
            return new Response(JSON.stringify({ error: "Missing required object information for request!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }


        await NotificationService.removeUserNotification(body)
        const response = await DrizzleDB.delete(likes).where(eq(likes.objectId, body.objectId))

        return new Response(JSON.stringify(response), {
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