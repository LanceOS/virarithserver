import { DrizzleDB } from '$lib/Drizzle.ts';
import { topic, type TopicSchema } from '$lib/server/schemas/Topic.ts';



export const POST = async ({ request }) => {
    try {
        const body: TopicSchema = await request.json();

        if(!body) {
            return new Response(JSON.stringify({ error: `Topic data required to create a new topic!` }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const response = await DrizzleDB.insert(topic).values(body).returning()

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