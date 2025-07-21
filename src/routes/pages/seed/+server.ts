import { Seeder } from '$lib/server/seeds/Seeder.ts'



export const POST = async (): Promise<Response> => {
    try {
        await Seeder()

        return new Response(JSON.stringify("Successfully seeded database"), {
            status: 200,
            statusText: "SUCCESS"
        })
    }
    catch(error: any) {
        return new Response(JSON.stringify(`Failed to seed database due to ${error.message}`), {
            status: 500,
            statusText: "FAIL"
        })
    }
}