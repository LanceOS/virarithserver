import { fail, type Actions } from "@sveltejs/kit";
import { auth } from "$lib/auth.ts";
import ProfileService from "$lib/server/ProfileService.ts";



export const actions: Actions = {
    submitEditedProfile: async ({ request }) => {
        try {
            const data = await request.formData();
            const profile = JSON.parse(data.get("profile") as string);

            const session = await auth.api.getSession({
                headers: request.headers
            })
            if(!session?.user) {
                throw new Error(`User must be logged in to edit post. User: ${session?.user}`);            }

            const response = await ProfileService.updateUserProfile({ ...profile, userId: session.user.id})
            

            console.log("Returning response from drizzle:", response)
            await new Promise(resolve => setTimeout(resolve, 500));

            return { success: true }
        }
        catch (error) {
            return fail(500, { success: false, message: error.message })
        }
    }
}