

import { authClient } from '$lib/auth-client.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { likes, type NewLike } from '$lib/schemas/Likes.ts';


export const POST = async ({ request }): Promise<Response> => {
	
    try {
        /**
         * If there is no user then throw an error
         * to block like creation
         */
        const session = await authClient.getSession();
        if(!session.data) {
            throw new Error("User must be logged in to create a new post!")
        }
        
        const body: NewLike = await request.json();
        
        /**
         * Creating new like with drizzle
         */
        const [post] = await DrizzleDB.insert(likes).values(body).returning()

        return new Response(JSON.stringify(post), {
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