import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { eq } from 'drizzle-orm';


export const PUT = async ({ request }) => {
    try {
        const body = await request.json()

        if (!body) {
            throw new Error(`Post information was not provided ${body}`);
        }

        const response = await DrizzleDB.update(posts).set({
            title: body.title,
            content: body.content
        })
            .where(eq(posts.id, body.postId))
            .returning()

        if (!response) {
            throw new Error(`Failed to update post in database ${response}`)
        }


        return new Response(JSON.stringify(response), {
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
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}