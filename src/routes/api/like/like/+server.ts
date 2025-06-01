import { DrizzleDB } from '$lib/Drizzle.ts'
import { likes, type LikeSchema } from '$lib/schemas/Likes.ts'


export const POST = async ({ request }) => {
    try {
        const body: LikeSchema = await request.json();

        if(!body.postId && !body.commentId && !body.commentReplyId) {
            throw new Error(`Must include of an ID of the object to like ${body}`)
        }

        const response = await DrizzleDB.insert(likes).values(body).returning();

        return new Response(JSON.stringify(response), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch(error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}