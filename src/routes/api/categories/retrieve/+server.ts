import { DrizzleDB } from '$lib/Drizzle.ts'
import { category } from '$lib/server/schemas/Category.ts'
import { desc } from 'drizzle-orm'


export const GET = async ({ request }) => {
    try {
        const response = await DrizzleDB.query.category.findMany({
            where: (category, { eq }) => eq(category.isDeleted, false),
            orderBy: desc(category.updatedAt)
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