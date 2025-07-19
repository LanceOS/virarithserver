import { DrizzleDB } from '$lib/Drizzle.ts';
import { profile, type ProfileSchema } from '$lib/server/schemas/Profile.ts';


export const POST = async ({ request }): Promise<Response> => {
    try {

        const body: ProfileSchema = await request.json();
        
        const newProfile = await DrizzleDB.insert(profile).values(body).returning();

        return new Response(JSON.stringify(newProfile), {
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