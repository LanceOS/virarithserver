import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { and, eq } from 'drizzle-orm';
import { comments } from '$lib/schemas/Comments.ts'

export const PUT = async ({ request }) => {
    try {
        const body = await request.json()

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!body) {
            throw new Error(`Post information was not provided ${body}`);
        }
        if (!session?.user) {
            throw new Error(`User must be logged in to edit post ${session?.user}`)
        }

        const response = await DrizzleDB.update(comments).set({
            content: body.content,
            isEdited: true
        })
        .where(and(eq(comments.id, body.id), eq(comments.userId, session.user.id)))
        .returning({ id: comments.id })

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