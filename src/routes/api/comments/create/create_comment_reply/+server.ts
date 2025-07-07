
import { authClient } from '$lib/auth-client.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { commentReply, type CommentReplySchema } from '$lib/schemas/CommentReply.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';


export const GET = async () => {
    return new Response((""), {
        status: 200
    })
}


export const POST = async ({ request }): Promise<Response> => {
    try {
        /**
         * If there is no user then throw an error
         * to block post creation
         */
        const session = await authClient.getSession();
        if(!session.data) {
            return new Response(JSON.stringify({ error: "User must be logged in!"}), {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        }

        const body: CommentReplySchema = await request.json();

        if (!body) {
            return new Response(JSON.stringify({ error: "Missing required object information for request!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const cleanBody = {
            content: await Generalizer.serializeRawText(body.content),
            userId: body.userId,
            postId: body.postId,
            parentComment: body.parentComment,
            type: "commentReply"
        }

        /**
         * Creating new comment reply with drizzle
         */
        const newComment = await DrizzleDB.insert(commentReply).values(cleanBody).returning()

        return new Response(JSON.stringify(newComment), {
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
            statusText: "Failed to create post!",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}