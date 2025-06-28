
import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { comments, type CommentSchema } from '$lib/schemas/Comments.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import NotificationService from '$lib/server/NotificationService.ts';


export const GET = async () => {
    return new Response((""), {
        status: 200
    })
}


export const POST = async ({ request }): Promise<Response> => {
    try {
        const body = await request.json();

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session?.user) {
            throw new Error(`User must be logged in to post a comment`)
        }

        const user = session.user;

        if (!body) {
            throw new Error("Failed to get data for comment")
        }

        const cleanBody = {
            content: await Generalizer.serializeRawText(body.content),
            userId: body.userId,
            postId: body.postId,
            type: "comment"
        }

        /**
         * Creating new comment with drizzle
         */
        const newComment = await DrizzleDB.insert(comments).values(cleanBody).returning()
        await NotificationService.generateUserNotification({ objectId: newComment[0].id, objectType: newComment[0].type, senderId: user.id, recieverId: body.postUser })

        return new Response(JSON.stringify(newComment), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error: unknown) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "Failed to create post!",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}