import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { followers } from '$lib/schemas/Followers.ts';
import NotificationService from '$lib/server/NotificationService.ts';
import { eq } from 'drizzle-orm';
import { and } from 'drizzle-orm';


export const DELETE = async ({ request, url }) => {
    try {
        const recieverId = url.searchParams.get('recieverId');
        const objectId = url.searchParams.get('objectId');

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!session?.user) {
            throw new Error("Must be logged in to like.")
        }

        const user = session.user

        if (!objectId || !recieverId) {
            throw new Error("Failed to data to like object")
        }

        const objectDetails = {
            senderId: user.id,
            recieverId: recieverId,
            objectId: objectId,
            objectType: "profile"
        }

        const removedFollower = await DrizzleDB.delete(followers)
            .where(and(
                eq(followers.recieverId, objectDetails.recieverId),
                eq(followers.objectType, objectDetails.objectType),
                eq(followers.objectId, objectDetails.objectId)
            )).returning();

        const notification = await NotificationService.removeUserNotification({
            senderId: user.id,
            recieverId: objectDetails.recieverId,
            objectId: objectDetails.objectId,
            objectType: objectDetails.objectType
        });

        return new Response(JSON.stringify({
            notification: notification,
            followers: removedFollower
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