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
            return new Response(JSON.stringify({ error: "Missing required object information for request!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }
        if (!session?.user) {
            return new Response(JSON.stringify({ error: "User must be logged in!"}), {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        }

        const response = await DrizzleDB.update(comments).set({
            content: body.content,
            isEdited: true
        })
        .where(and(eq(comments.id, body.id), eq(comments.userId, session.user.id)))
        .returning({ id: comments.id })
        
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