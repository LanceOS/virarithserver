import { DrizzleDB } from '$lib/Drizzle.ts';
import { likes, type LikeSchema } from '$lib/schemas/Likes.ts';
import { eq } from 'drizzle-orm';


export const DELETE = async ({ request }) => {
    try {
        const body: LikeSchema = await request.json();

        const removalSort = () => {
            if(body.postId) {
                return (eq(likes.postId, body.postId), eq(likes.userId, body.userId))
            }
            else if (body.commentId) {
                return (eq(likes.commentId, body.commentId), eq(likes.userId, body.userId))
            }
            else if (body.commentReplyId) {
                return (eq(likes.commentReplyId, body.commentReplyId), eq(likes.userId, body.userId))
            }
            else {
                throw new Error(`Couldn't determine which object to unlike.`)
            }
        }


        const response = await DrizzleDB.delete(likes).where(removalSort())

        return new Response(JSON.stringify(response), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
        
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