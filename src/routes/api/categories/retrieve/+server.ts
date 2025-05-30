import { DrizzleDB } from '$lib/Drizzle.ts'
import { topic } from '$lib/schemas/Topic.ts'
import { desc } from 'drizzle-orm'


export const GET = async ({ request }) => {
    try {
        const response = await DrizzleDB.query.topic.findMany({
            where: (topic, { eq }) => eq(topic.isDeleted, false),
            orderBy: desc(topic.updatedAt)
        })

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