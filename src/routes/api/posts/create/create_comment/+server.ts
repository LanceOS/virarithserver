import { authClient } from '$lib/auth-client.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { comment, type NewComment } from '$lib/schemas/Comment.ts';


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
        
        /**
         * Creating new comment with drizzle
         */
        const newComment = await DrizzleDB.insert(comment).values(body).returning()

        return new Response(JSON.stringify(newComment), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch(error) {
        return new Response(JSON.stringify(error), {
            status: 404,
            statusText: "Failed to create post!",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}