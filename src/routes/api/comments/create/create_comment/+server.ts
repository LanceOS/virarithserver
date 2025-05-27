
import { authClient } from '$lib/auth-client.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { comments, type NewComment } from '$lib/schemas/Comments.ts';
import Sentry from '$lib/tools/Sentry.ts';

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
            throw new Error("User must be logged in to create a new post!")
        }
        
        const body: NewComment = await request.json();

        if(!body) {
            throw new Error("Failed to get data for comment")
        }
        
        /**
         * Creating new comment with drizzle
         */
        const newComment = await DrizzleDB.insert(comments).values(body).returning()

        return new Response(JSON.stringify(newComment), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch(error: unknown) {
        Sentry.error(error)
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "Failed to create post!",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}