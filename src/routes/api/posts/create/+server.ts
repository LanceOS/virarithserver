import { authClient } from '$lib/auth-client.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts, type NewPost } from '$lib/schemas/Posts.ts';


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
        
        const body = await request.json();
        
        const postData: NewPost = {
            title: body.title,
            content: body.content,
            user_id: body.user_id,
            topic: body.topic
        };
        
        /**
         * Creating new post with drizzle
         */
        const [post] = await DrizzleDB.insert(posts).values(postData).returning()

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