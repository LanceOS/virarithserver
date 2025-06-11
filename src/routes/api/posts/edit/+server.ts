import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { and, eq } from 'drizzle-orm';


export const PUT = async ({ request }) => {
    try {
        const body = await request.json()

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!body) {
            throw new Error(`Post information was not provided ${body}`);
        }
        if(!session?.user) {
            throw new Error(`User must be logged in to edit post ${session?.user}`)
        }

        const response = await DrizzleDB.update(posts).set({
            title: body.title,
            content: body.content,
            category: body.category,
            isEdited: true
        })
        .where(and(eq(posts.id, body.postId), eq(posts.userId, session.user.id)))
        .returning({ id: posts.id })

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