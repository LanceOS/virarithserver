import { authClient } from '$lib/auth-client.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts, type NewPost } from '$lib/schemas/Posts.ts';


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
        
        const body: NewPost = await request.json();
        
        /**
         * Creating new post with drizzle
         */
        const newPost = await DrizzleDB.insert(posts).values(body).returning()

        return new Response(JSON.stringify(newPost), {
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