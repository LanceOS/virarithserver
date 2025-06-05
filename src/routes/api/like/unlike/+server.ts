import { DrizzleDB } from '$lib/Drizzle.ts';
import { likes, type LikeSchema } from '$lib/schemas/Likes.ts';
import { eq } from 'drizzle-orm';


export const DELETE = async ({ request }) => {
    try {
        const body: LikeSchema = await request.json();

        if(!body.objectId || !body.objectType) {
            throw new Error("Failed to data to like object")
        }



        const response = await DrizzleDB.delete(likes).where(eq(likes.objectId, body.objectId))

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