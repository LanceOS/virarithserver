
import { DrizzleDB } from '$lib/Drizzle.ts';
import { comments, type CommentSchema } from '$lib/schemas/Comments.ts';
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
        // const session = await authClient.getSession();
        // if(!session.data) {
        //     throw new Error("User must be logged in to create a new post!")
        // }

        const body: CommentSchema = await request.json();

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